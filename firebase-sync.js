import { initializeApp } from 'https://esm.sh/firebase@10.8.0/app';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail,
    signOut, 
    onAuthStateChanged 
} from 'https://esm.sh/firebase@10.8.0/auth';
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDocFromServer,
    serverTimestamp 
} from 'https://esm.sh/firebase@10.8.0/firestore';
import firebaseConfig from './firebase-applet-config.json';

let activeConfig = firebaseConfig;
try {
    const customStored = localStorage.getItem('obsidian_custom_firebase_config');
    if (customStored) {
        const parsed = JSON.parse(customStored);
        if (parsed && parsed.apiKey && parsed.projectId) {
            activeConfig = parsed;
        }
    }
} catch {}

const app = initializeApp(activeConfig);
export const db = getFirestore(app, activeConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Test connection on boot
async function testConnection() {
    try {
        await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
            console.error("Please check your Firebase configuration.");
        }
    }
}
testConnection();

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
        return Array.isArray(parsed) ? parsed : fallback;
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

const googleProvider = new GoogleAuthProvider();

window.ObsidianAuth = {
    auth,
    currentUser: null,
    isCloudSynced: false,
    syncStatus: 'guest',
    isMigrating: false,

    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (err) {
            console.error("Google sign in error:", err);
            throw err;
        }
    },

    async signInWithGoogleRedirect() {
        return this.signInWithGoogle();
    },

    async loginWithGoogle() {
        return this.signInWithGoogle();
    },

    async loginWithGoogleRedirect() {
        return this.signInWithGoogle();
    },

    async signInWithEmail(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (err) {
            console.error("Email sign in error:", err);
            throw err;
        }
    },

    async signUpWithEmail(email, password) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (err) {
            console.error("Email sign up error:", err);
            throw err;
        }
    },

    async sendMagicLink(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            return true;
        } catch (err) {
            console.error("Password reset / magic link error:", err);
            throw err;
        }
    },

    async logout() {
        try {
            await signOut(auth);
            this.currentUser = null;
            this.isCloudSynced = false;
            this.syncStatus = 'guest';
            window.dispatchEvent(new CustomEvent('obsidian-auth-state-changed', { detail: { user: null } }));
            window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
        } catch (err) {
            console.error("Sign out error:", err);
            throw err;
        }
    },

    async signOut() {
        return this.logout();
    },

    getActiveConfig() {
        try {
            const stored = localStorage.getItem('obsidian_custom_firebase_config');
            if (stored) return JSON.parse(stored);
        } catch {}
        return firebaseConfig;
    },

    saveCustomConfig(configObj) {
        localStorage.setItem('obsidian_custom_firebase_config', JSON.stringify(configObj));
        setTimeout(() => {
            window.location.reload();
        }, 500);
    },

    resetToDefaultConfig() {
        localStorage.removeItem('obsidian_custom_firebase_config');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    },

    async syncUserCloudData(userId) {
        if (!userId) return;
        this.isMigrating = true;
        try {
            // Fetch user profile
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                const operatorName = localStorage.getItem('obsidian_operator_name') || 'Architect';
                const avatar = localStorage.getItem('obsidian_avatar') || 'photos/avatar.png';
                await setDoc(userDocRef, {
                    id: userId,
                    email: this.currentUser?.email || '',
                    operatorName,
                    avatar,
                    updatedAt: new Date().toISOString()
                });
            } else {
                const data = userDoc.data();
                if (data.operatorName) localStorage.setItem('obsidian_operator_name', data.operatorName);
                if (data.avatar) localStorage.setItem('obsidian_avatar', data.avatar);
            }

            // Fetch classes from /users/{userId}/classes
            const classesColRef = collection(db, 'users', userId, 'classes');
            const classesSnapshot = await getDocs(classesColRef);
            let classesList = [];
            classesSnapshot.forEach(d => {
                classesList.push({ id: d.id, ...d.data() });
            });

            // Fetch tasks from /users/{userId}/tasks
            const tasksColRef = collection(db, 'users', userId, 'tasks');
            const tasksSnapshot = await getDocs(tasksColRef);
            let tasksList = [];
            tasksSnapshot.forEach(d => {
                tasksList.push({ id: d.id, ...d.data() });
            });

            if (classesList.length === 0) {
                // If cloud is empty, upload local items linked to user
                const localClasses = getLocalArray('obsidianClasses', []);
                for (const cls of localClasses) {
                    const { id, ...clsData } = cls;
                    await addDoc(classesColRef, { ...clsData, userId, createdAt: clsData.createdAt || new Date().toISOString() });
                }
                const refetchClasses = await getDocs(classesColRef);
                classesList = [];
                refetchClasses.forEach(d => classesList.push({ id: d.id, ...d.data() }));
            }

            if (tasksList.length === 0) {
                const localTasks = getLocalArray('obsidianTasks', DEFAULT_INITIAL_TASKS);
                for (const tsk of localTasks) {
                    const { id, ...tskData } = tsk;
                    await addDoc(tasksColRef, { ...tskData, userId, createdAt: tskData.createdAt || new Date().toISOString() });
                }
                const refetchTasks = await getDocs(tasksColRef);
                tasksList = [];
                refetchTasks.forEach(d => tasksList.push({ id: d.id, ...d.data() }));
            }

            localStorage.setItem('obsidianClasses', JSON.stringify(classesList));
            localStorage.setItem('obsidianTasks', JSON.stringify(tasksList));

            window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
            window.dispatchEvent(new CustomEvent('obsidian-cloud-data-synced', {
                detail: { classes: classesList, tasks: tasksList }
            }));
        } catch (err) {
            console.error("Failed to sync user cloud data:", err);
        } finally {
            this.isMigrating = false;
        }
    },

    async addClass(classData) {
        const newClass = {
            userId: this.currentUser ? this.currentUser.uid : 'guest',
            ...classData,
            createdAt: new Date().toISOString()
        };

        if (this.currentUser) {
            try {
                const colRef = collection(db, 'users', this.currentUser.uid, 'classes');
                const docRef = await addDoc(colRef, newClass);
                newClass.id = docRef.id;
            } catch (err) {
                console.error("Failed to add class to Firestore:", err);
                newClass.id = 'cls_' + Math.random().toString(36).substr(2, 9);
            }
        } else {
            newClass.id = 'cls_' + Math.random().toString(36).substr(2, 9);
        }

        const classes = getLocalArray('obsidianClasses', []);
        classes.push(newClass);
        localStorage.setItem('obsidianClasses', JSON.stringify(classes));
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
        return newClass.id;
    },

    async updateClass(classId, updatedData) {
        const classes = getLocalArray('obsidianClasses', []);
        const index = classes.findIndex(c => c.id === classId);
        if (index !== -1) {
            classes[index] = { ...classes[index], ...updatedData, updatedAt: new Date().toISOString() };
            localStorage.setItem('obsidianClasses', JSON.stringify(classes));

            if (this.currentUser) {
                try {
                    const docRef = doc(db, 'users', this.currentUser.uid, 'classes', classId);
                    await updateDoc(docRef, { ...updatedData, updatedAt: new Date().toISOString() });
                } catch (err) {
                    console.error("Failed to update class in Firestore:", err);
                }
            }
            window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
        }
    },

    async deleteClass(classId) {
        let classes = getLocalArray('obsidianClasses', []);
        classes = classes.filter(c => c.id !== classId);
        localStorage.setItem('obsidianClasses', JSON.stringify(classes));

        if (this.currentUser) {
            try {
                const docRef = doc(db, 'users', this.currentUser.uid, 'classes', classId);
                await deleteDoc(docRef);
            } catch (err) {
                console.error("Failed to delete class from Firestore:", err);
            }
        }
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
    },

    async addTask(taskData) {
        const newTask = {
            userId: this.currentUser ? this.currentUser.uid : 'guest',
            ...taskData,
            createdAt: new Date().toISOString()
        };

        if (this.currentUser) {
            try {
                const colRef = collection(db, 'users', this.currentUser.uid, 'tasks');
                const docRef = await addDoc(colRef, newTask);
                newTask.id = docRef.id;
            } catch (err) {
                console.error("Failed to add task to Firestore:", err);
                newTask.id = 'tsk_' + Math.random().toString(36).substr(2, 9);
            }
        } else {
            newTask.id = 'tsk_' + Math.random().toString(36).substr(2, 9);
        }

        const tasks = getLocalArray('obsidianTasks', []);
        tasks.push(newTask);
        localStorage.setItem('obsidianTasks', JSON.stringify(tasks));
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
        return newTask.id;
    },

    async updateTask(taskId, updatedData) {
        const tasks = getLocalArray('obsidianTasks', []);
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedData, updatedAt: new Date().toISOString() };
            localStorage.setItem('obsidianTasks', JSON.stringify(tasks));

            if (this.currentUser) {
                try {
                    const docRef = doc(db, 'users', this.currentUser.uid, 'tasks', taskId);
                    await updateDoc(docRef, { ...updatedData, updatedAt: new Date().toISOString() });
                } catch (err) {
                    console.error("Failed to update task in Firestore:", err);
                }
            }
            window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
        }
    },

    async deleteTask(taskId) {
        let tasks = getLocalArray('obsidianTasks', []);
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('obsidianTasks', JSON.stringify(tasks));

        if (this.currentUser) {
            try {
                const docRef = doc(db, 'users', this.currentUser.uid, 'tasks', taskId);
                await deleteDoc(docRef);
            } catch (err) {
                console.error("Failed to delete task from Firestore:", err);
            }
        }
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
    },

    async saveUserProfile(operatorName, avatar) {
        localStorage.setItem('obsidian_operator_name', operatorName);
        localStorage.setItem('obsidian_avatar', avatar);

        if (this.currentUser) {
            try {
                const userDocRef = doc(db, 'users', this.currentUser.uid);
                await updateDoc(userDocRef, { operatorName, avatar, updatedAt: new Date().toISOString() });
            } catch (err) {
                console.error("Failed to update user profile in Firestore:", err);
            }
        }
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
    }
};

window.ObsidianAuth._isReal = true;

// Monitor Auth State
onAuthStateChanged(auth, (user) => {
    window.ObsidianAuth.currentUser = user;
    window.ObsidianAuth.isCloudSynced = !!user;
    window.ObsidianAuth.syncStatus = user ? 'synced' : 'guest';
    if (user) {
        window.ObsidianAuth.syncUserCloudData(user.uid);
    }
    window.dispatchEvent(new CustomEvent('obsidian-auth-state-changed', { detail: { user } }));
});
