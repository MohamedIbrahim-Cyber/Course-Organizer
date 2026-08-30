import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Default Supabase config (placeholder / empty, user can input their own in settings or config)
const defaultSupabaseConfig = {
    supabaseUrl: "https://iaftsszffdgetrgpjomq.supabase.co",
    supabaseAnonKey: "sb_publishable_SSB7I44SbPyccx-cd0QbEQ_b4x-bXQy"
};

let activeConfig = defaultSupabaseConfig;
try {
    const customConfigRaw = localStorage.getItem('obsidian_custom_supabase_config');
    if (customConfigRaw) {
        const parsed = JSON.parse(customConfigRaw);
        if (parsed) {
            activeConfig = { 
                supabaseUrl: parsed.supabaseUrl || defaultSupabaseConfig.supabaseUrl,
                supabaseAnonKey: parsed.supabaseAnonKey || defaultSupabaseConfig.supabaseAnonKey
            };
        }
    } else {
        // Automatically store initial config with the provided URL and key
        localStorage.setItem('obsidian_custom_supabase_config', JSON.stringify(defaultSupabaseConfig));
    }
} catch (e) {
    console.warn("Custom Supabase config parse notice:", e);
}

// Initialize Supabase Client if configured
let supabase = null;
if (activeConfig.supabaseUrl && activeConfig.supabaseAnonKey) {
    try {
        supabase = createClient(activeConfig.supabaseUrl, activeConfig.supabaseAnonKey);
    } catch (e) {
        console.warn("Failed to initialize Supabase client:", e);
    }
}

// Default Academic Dataset for Fresh Initialization
const DEFAULT_INITIAL_CLASSES = [];

const DEFAULT_INITIAL_TASKS = [
    {
        id: 'tsk_def_1',
        title: "Kernel Synchronization Lab",
        description: "Implement semaphore lock barriers and solve race conditions in C/Rust.",
        date: "Wed, 23:59",
        completed: false
    },
    {
        id: 'tsk_def_2',
        title: "Microservices Architecture Essay",
        description: "Submit 5-page case study analyzing event-driven distributed consensus.",
        date: "Fri, 18:00",
        completed: false
    },
    {
        id: 'tsk_def_3',
        title: "Network Packet Analysis WireGuard",
        description: "Inspect PCAP stream captures and verify cryptographic handshakes.",
        date: "Sat, 20:00",
        completed: true
    }
];

function getLocalArray(key, fallback = []) {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return fallback;
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
    } catch {
        return fallback;
    }
}

// Ensure initial datasets exist locally if empty
if (getLocalArray('obsidianClasses', []).length === 0) {
    localStorage.setItem('obsidianClasses', JSON.stringify(DEFAULT_INITIAL_CLASSES));
}
if (getLocalArray('obsidianTasks', []).length === 0) {
    localStorage.setItem('obsidianTasks', JSON.stringify(DEFAULT_INITIAL_TASKS));
}

// Expose ObsidianAuth interface to window for website.js compatibility
window.ObsidianAuth = {
    supabase,
    currentUser: null,
    isCloudSynced: false,
    syncStatus: 'offline', // 'synced', 'guest', 'offline'
    isMigrating: false,

    async signInWithEmail(email, password) {
        if (!supabase) {
            throw new Error("Supabase is not configured.");
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    },

    async signUpWithEmail(email, password) {
        if (!supabase) {
            throw new Error("Supabase is not configured.");
        }
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        return data;
    },

    async sendMagicLink(email) {
        if (!supabase) {
            throw new Error("Supabase is not configured.");
        }
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin + window.location.pathname
            }
        });
        if (error) throw error;
        return data;
    },

    async loginWithGoogle() {
        if (!supabase) {
            throw new Error("Supabase is not configured. Please enter your Supabase URL & Anon Key in the terminal settings below.");
        }
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + window.location.pathname
            }
        });
        if (error) throw error;
        return data;
    },

    async loginWithGoogleRedirect() {
        return this.loginWithGoogle();
    },

    async signInWithGoogle() {
        return this.loginWithGoogle();
    },

    async signInWithGoogleRedirect() {
        return this.loginWithGoogleRedirect();
    },

    async logout() {
        if (supabase) {
            await supabase.auth.signOut();
        }
        this.currentUser = null;
        this.isCloudSynced = false;
        this.syncStatus = 'guest';
        window.dispatchEvent(new CustomEvent('obsidian-auth-state-changed', { detail: { user: null } }));
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
    },

    async signOut() {
        return this.logout();
    },

    getCurrentHostname() {
        return window.location.hostname || 'localhost';
    },

    getActiveConfig() {
        return { ...activeConfig };
    },

    saveCustomConfig(configObj) {
        try {
            if (typeof configObj === 'string') {
                configObj = JSON.parse(configObj);
            }
            if (!configObj.supabaseUrl || !configObj.supabaseAnonKey) {
                throw new Error("Configuration must contain at least supabaseUrl and supabaseAnonKey.");
            }
            localStorage.setItem('obsidian_custom_supabase_config', JSON.stringify(configObj));
            window.location.reload();
            return true;
        } catch (e) {
            console.error("Failed to save custom Supabase config:", e);
            throw e;
        }
    },

    resetToDefaultConfig() {
        localStorage.removeItem('obsidian_custom_supabase_config');
        window.location.reload();
    },

    async syncUserCloudData(userId) {
        if (!supabase || !userId) return;
        this.isMigrating = true;
        try {
            const { data: vaultData } = await supabase
                .from('obsidian_vaults')
                .select('*')
                .eq('user_id', userId)
                .single();

            let classesList = getLocalArray('obsidianClasses', DEFAULT_INITIAL_CLASSES);
            let tasksList = getLocalArray('obsidianTasks', DEFAULT_INITIAL_TASKS);

            if (vaultData) {
                if (vaultData.classes && Array.isArray(vaultData.classes) && vaultData.classes.length > 0) {
                    classesList = vaultData.classes;
                }
                if (vaultData.tasks && Array.isArray(vaultData.tasks) && vaultData.tasks.length > 0) {
                    tasksList = vaultData.tasks;
                }
                if (vaultData.operator_name) {
                    localStorage.setItem('obsidian_operator_name', vaultData.operator_name);
                }
                if (vaultData.avatar) {
                    localStorage.setItem('obsidian_avatar', vaultData.avatar);
                }
            } else {
                const operatorName = localStorage.getItem('obsidian_operator_name') || 'Architect';
                const avatar = localStorage.getItem('obsidian_avatar') || 'photos/avatar.png';
                await supabase.from('obsidian_vaults').upsert({
                    user_id: userId,
                    operator_name: operatorName,
                    avatar: avatar,
                    classes: classesList,
                    tasks: tasksList,
                    updated_at: new Date().toISOString()
                });
            }

            localStorage.setItem('obsidianClasses', JSON.stringify(classesList));
            localStorage.setItem('obsidianTasks', JSON.stringify(tasksList));

            window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
            window.dispatchEvent(new CustomEvent('obsidian-cloud-data-synced', {
                detail: { classes: classesList, tasks: tasksList }
            }));
        } catch (err) {
            console.warn("Supabase vault sync notice (table may need creation):", err);
        } finally {
            this.isMigrating = false;
        }
    },

    async saveCloudVault() {
        if (!supabase || !this.currentUser) return;
        try {
            const userId = this.currentUser.id;
            const classes = getLocalArray('obsidianClasses', []);
            const tasks = getLocalArray('obsidianTasks', []);
            const operatorName = localStorage.getItem('obsidian_operator_name') || 'Architect';
            const avatar = localStorage.getItem('obsidian_avatar') || 'photos/avatar.png';

            await supabase.from('obsidian_vaults').upsert({
                user_id: userId,
                operator_name: operatorName,
                avatar: avatar,
                classes,
                tasks,
                updated_at: new Date().toISOString()
            });
        } catch (err) {
            console.warn("Failed to save vault to Supabase:", err);
        }
    },

    async addClass(classData) {
        const classes = getLocalArray('obsidianClasses', []);
        const newClass = {
            id: 'cls_' + Math.random().toString(36).substr(2, 9),
            ...classData,
            createdAt: new Date().toISOString()
        };
        classes.push(newClass);
        localStorage.setItem('obsidianClasses', JSON.stringify(classes));
        await this.saveCloudVault();
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
        return newClass.id;
    },

    async updateClass(classId, updatedData) {
        const classes = getLocalArray('obsidianClasses', []);
        const index = classes.findIndex(c => c.id === classId);
        if (index !== -1) {
            classes[index] = { ...classes[index], ...updatedData, updatedAt: new Date().toISOString() };
            localStorage.setItem('obsidianClasses', JSON.stringify(classes));
            await this.saveCloudVault();
            window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
        }
    },

    async deleteClass(classId) {
        let classes = getLocalArray('obsidianClasses', []);
        classes = classes.filter(c => c.id !== classId);
        localStorage.setItem('obsidianClasses', JSON.stringify(classes));
        await this.saveCloudVault();
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
    },

    async addTask(taskData) {
        const tasks = getLocalArray('obsidianTasks', []);
        const newTask = {
            id: 'tsk_' + Math.random().toString(36).substr(2, 9),
            ...taskData,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        localStorage.setItem('obsidianTasks', JSON.stringify(tasks));
        await this.saveCloudVault();
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
        return newTask.id;
    },

    async updateTask(taskId, updatedData) {
        const tasks = getLocalArray('obsidianTasks', []);
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedData, updatedAt: new Date().toISOString() };
            localStorage.setItem('obsidianTasks', JSON.stringify(tasks));
            await this.saveCloudVault();
            window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
        }
    },

    async deleteTask(taskId) {
        let tasks = getLocalArray('obsidianTasks', []);
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('obsidianTasks', JSON.stringify(tasks));
        await this.saveCloudVault();
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
    },

    async saveUserProfile(operatorName, avatar) {
        localStorage.setItem('obsidian_operator_name', operatorName);
        localStorage.setItem('obsidian_avatar', avatar);
        await this.saveCloudVault();
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
    }
};

// Initialize Supabase Session listener
if (supabase) {
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
            window.ObsidianAuth.currentUser = session.user;
            window.ObsidianAuth.isCloudSynced = true;
            window.ObsidianAuth.syncStatus = 'synced';
            window.ObsidianAuth.syncUserCloudData(session.user.id);
            window.dispatchEvent(new CustomEvent('obsidian-auth-state-changed', { detail: { user: session.user } }));
        }
    });

    supabase.auth.onAuthStateChange((event, session) => {
        const user = session ? session.user : null;
        window.ObsidianAuth.currentUser = user;
        window.ObsidianAuth.isCloudSynced = !!user;
        window.ObsidianAuth.syncStatus = user ? 'synced' : 'guest';
        if (user) {
            window.ObsidianAuth.syncUserCloudData(user.id);
        }
        window.dispatchEvent(new CustomEvent('obsidian-auth-state-changed', { detail: { user } }));
    });
}
