import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithPopup, 
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider, 
    signOut
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    getDocs, 
    addDoc, 
    deleteDoc, 
    updateDoc, 
    onSnapshot,
    serverTimestamp,
    writeBatch
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

// Configuration loaded from firebase-applet-config.json
const firebaseConfig = {
    projectId: "striped-justice-4nm9t",
    appId: "1:1069814168930:web:409021f1a1c3ba7d06403b",
    apiKey: "AIzaSyD1kWGjClo5YhG0dnKwGChMB_RElo9uxME",
    authDomain: "striped-justice-4nm9t.firebaseapp.com",
    firestoreDatabaseId: "ai-studio-courseorganizer-1452768d-72f5-4821-87fa-14f384749d70",
    storageBucket: "striped-justice-4nm9t.firebasestorage.app",
    messagingSenderId: "1069814168930"
};

// Initialize Firebase App & Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Default Academic Dataset for Fresh Initialization
const DEFAULT_INITIAL_CLASSES = [
    {
        title: "Advanced Operating Systems",
        code: "CS-301",
        instructor: "Dr. Vance",
        date: "Mon, 09:00 - 10:30"
    },
    {
        title: "Distributed Systems & Cloud",
        code: "CS-410",
        instructor: "Dr. Sterling",
        date: "Wed, 11:00 - 12:30"
    },
    {
        title: "Cyber Security Protocols",
        code: "SEC-220",
        instructor: "Eng. Mohamed Ibrahim",
        date: "Thu, 14:00 - 16:00"
    }
];

const DEFAULT_INITIAL_TASKS = [
    {
        title: "Kernel Synchronization Lab",
        description: "Implement semaphore lock barriers and solve race conditions in C/Rust.",
        date: "Wed, 23:59",
        completed: false
    },
    {
        title: "Microservices Architecture Essay",
        description: "Submit 5-page case study analyzing event-driven distributed consensus.",
        date: "Fri, 18:00",
        completed: false
    },
    {
        title: "Network Packet Analysis WireGuard",
        description: "Inspect PCAP stream captures and verify cryptographic handshakes.",
        date: "Sat, 20:00",
        completed: true
    }
];

// Helper to safely get local stored array
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

// Backup local classes & tasks immediately on script load so they are never lost
(function backupLocalStorage() {
    try {
        const localClasses = getLocalArray('obsidianClasses', []);
        if (localClasses.length > 0) {
            localStorage.setItem('obsidian_backup_classes', JSON.stringify(localClasses));
        }
        const localTasks = getLocalArray('obsidianTasks', []);
        if (localTasks.length > 0) {
            localStorage.setItem('obsidian_backup_tasks', JSON.stringify(localTasks));
        }
    } catch (e) {
        console.warn("Storage backup notice:", e);
    }
})();

// Process potential redirect result upon page load
getRedirectResult(auth).then(async (result) => {
    if (result && result.user) {
        const user = result.user;
        await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            email: user.email,
            operatorName: user.displayName || (user.email ? user.email.split('@')[0] : 'Architect'),
            avatar: user.photoURL || localStorage.getItem('obsidian_avatar') || 'photos/avatar.png',
            theme: localStorage.getItem('obsidian_theme') || 'dark',
            lang: localStorage.getItem('obsidian_lang') || 'en',
            updatedAt: new Date().toISOString()
        }, { merge: true });
        await window.ObsidianAuth.syncUserCloudData(user.uid);
    }
}).catch((redirectErr) => {
    console.warn("Redirect sign-in check notice:", redirectErr);
});

// Expose state and functions to window for global access
window.ObsidianAuth = {
    app,
    auth,
    db,
    currentUser: null,
    isCloudSynced: false,
    syncStatus: 'offline', // 'synced', 'syncing', 'guest'
    isMigrating: false,

    // Google Sign-In with Popup
    async loginWithGoogle() {
        try {
            // Ensure pre-login backup is secured
            const currentLocalClasses = getLocalArray('obsidianClasses', getLocalArray('obsidian_backup_classes', []));
            if (currentLocalClasses.length > 0) {
                localStorage.setItem('obsidian_backup_classes', JSON.stringify(currentLocalClasses));
            }
            const currentLocalTasks = getLocalArray('obsidianTasks', getLocalArray('obsidian_backup_tasks', []));
            if (currentLocalTasks.length > 0) {
                localStorage.setItem('obsidian_backup_tasks', JSON.stringify(currentLocalTasks));
            }

            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;
            
            // Sync user doc
            await setDoc(doc(db, 'users', user.uid), {
                id: user.uid,
                email: user.email,
                operatorName: user.displayName || (user.email ? user.email.split('@')[0] : 'Architect'),
                avatar: user.photoURL || localStorage.getItem('obsidian_avatar') || 'photos/avatar.png',
                theme: localStorage.getItem('obsidian_theme') || 'dark',
                lang: localStorage.getItem('obsidian_lang') || 'en',
                updatedAt: new Date().toISOString()
            }, { merge: true });

            await this.syncUserCloudData(user.uid);
            return user;
        } catch (popupErr) {
            console.error("Popup Sign-in error:", popupErr);
            throw popupErr;
        }
    },

    // Alternative Google Sign-In with Full Page Redirect (Resilient for iframe/mobile/Vercel)
    async loginWithGoogleRedirect() {
        // Ensure pre-login backup is secured
        const currentLocalClasses = getLocalArray('obsidianClasses', getLocalArray('obsidian_backup_classes', []));
        if (currentLocalClasses.length > 0) {
            localStorage.setItem('obsidian_backup_classes', JSON.stringify(currentLocalClasses));
        }
        const currentLocalTasks = getLocalArray('obsidianTasks', getLocalArray('obsidian_backup_tasks', []));
        if (currentLocalTasks.length > 0) {
            localStorage.setItem('obsidian_backup_tasks', JSON.stringify(currentLocalTasks));
        }
        return signInWithRedirect(auth, googleProvider);
    },

    async signInWithGoogle() {
        return this.loginWithGoogle();
    },

    async signInWithGoogleRedirect() {
        return this.loginWithGoogleRedirect();
    },

    async logout() {
        await signOut(auth);
    },

    async signOut() {
        await signOut(auth);
    },

    // Comprehensive Cloud Data Sync & Migration (Local/Guest -> Cloud Firestore & Cloud -> Local)
    async syncUserCloudData(userId) {
        if (!userId) return;
        this.isMigrating = true;

        try {
            const classesCol = collection(db, 'users', userId, 'classes');
            const tasksCol = collection(db, 'users', userId, 'tasks');

            // 1. Fetch Cloud Classes
            const cloudClassesSnap = await getDocs(classesCol);
            let classesList = [];

            if (!cloudClassesSnap.empty) {
                // Cloud already has stored classes, load them!
                cloudClassesSnap.forEach(docSnap => {
                    classesList.push({
                        id: docSnap.id,
                        ...docSnap.data()
                    });
                });
            } else {
                // Cloud is empty for this user! Migrate stored local classes or default dataset
                let sourceClasses = getLocalArray('obsidianClasses', []);
                if (sourceClasses.length === 0) {
                    sourceClasses = getLocalArray('obsidian_backup_classes', DEFAULT_INITIAL_CLASSES);
                }

                for (const c of sourceClasses) {
                    const classPayload = {
                        userId,
                        title: c.title || 'Untitled Class',
                        code: c.code || '',
                        instructor: c.instructor || '',
                        date: c.date || 'Mon, 09:00 - 10:30',
                        createdAt: c.createdAt || new Date().toISOString()
                    };
                    const docRef = await addDoc(classesCol, classPayload);
                    classesList.push({
                        id: docRef.id,
                        ...classPayload
                    });
                }
            }

            // Save to localStorage & notify UI
            localStorage.setItem('obsidianClasses', JSON.stringify(classesList));
            localStorage.setItem('obsidian_backup_classes', JSON.stringify(classesList));

            // 2. Fetch Cloud Tasks
            const cloudTasksSnap = await getDocs(tasksCol);
            let tasksList = [];

            if (!cloudTasksSnap.empty) {
                // Cloud already has stored tasks, load them!
                cloudTasksSnap.forEach(docSnap => {
                    tasksList.push({
                        id: docSnap.id,
                        ...docSnap.data()
                    });
                });
            } else {
                // Cloud is empty for this user! Migrate stored local tasks or default dataset
                let sourceTasks = getLocalArray('obsidianTasks', []);
                if (sourceTasks.length === 0) {
                    sourceTasks = getLocalArray('obsidian_backup_tasks', DEFAULT_INITIAL_TASKS);
                }

                for (const t of sourceTasks) {
                    const taskPayload = {
                        userId,
                        title: t.title || 'Untitled Task',
                        description: t.description || '',
                        date: t.date || 'Wed, 23:59',
                        completed: !!t.completed,
                        createdAt: t.createdAt || new Date().toISOString()
                    };
                    const docRef = await addDoc(tasksCol, taskPayload);
                    tasksList.push({
                        id: docRef.id,
                        ...taskPayload
                    });
                }
            }

            // Save to localStorage & notify UI
            localStorage.setItem('obsidianTasks', JSON.stringify(tasksList));
            localStorage.setItem('obsidian_backup_tasks', JSON.stringify(tasksList));

            // Dispatch updates to all listeners and UI
            window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
            window.dispatchEvent(new CustomEvent('obsidian-cloud-data-synced', {
                detail: { classes: classesList, tasks: tasksList }
            }));

            if (window.ObsidianUI && typeof window.ObsidianUI.refreshUI === 'function') {
                window.ObsidianUI.refreshUI();
            }
        } catch (err) {
            console.error("Error in syncUserCloudData:", err);
        } finally {
            this.isMigrating = false;
        }
    },

    // Save Class to Cloud
    async addClass(classData) {
        if (!auth.currentUser) return null;
        try {
            const ref = collection(db, 'users', auth.currentUser.uid, 'classes');
            const docRef = await addDoc(ref, {
                ...classData,
                userId: auth.currentUser.uid,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (err) {
            console.error("Failed to add class to cloud:", err);
            return null;
        }
    },

    async updateClass(classId, updatedData) {
        if (!auth.currentUser || !classId) return;
        try {
            const ref = doc(db, 'users', auth.currentUser.uid, 'classes', classId);
            await updateDoc(ref, {
                ...updatedData,
                updatedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error("Failed to update class in cloud:", err);
        }
    },

    async deleteClass(classId) {
        if (!auth.currentUser || !classId) return;
        try {
            const ref = doc(db, 'users', auth.currentUser.uid, 'classes', classId);
            await deleteDoc(ref);
        } catch (err) {
            console.error("Failed to delete class from cloud:", err);
        }
    },

    // Save Task to Cloud
    async addTask(taskData) {
        if (!auth.currentUser) return null;
        try {
            const ref = collection(db, 'users', auth.currentUser.uid, 'tasks');
            const docRef = await addDoc(ref, {
                ...taskData,
                userId: auth.currentUser.uid,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (err) {
            console.error("Failed to add task to cloud:", err);
            return null;
        }
    },

    async updateTask(taskId, updatedData) {
        if (!auth.currentUser || !taskId) return;
        try {
            const ref = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
            await updateDoc(ref, {
                ...updatedData,
                updatedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error("Failed to update task in cloud:", err);
        }
    },

    async deleteTask(taskId) {
        if (!auth.currentUser || !taskId) return;
        try {
            const ref = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
            await deleteDoc(ref);
        } catch (err) {
            console.error("Failed to delete task from cloud:", err);
        }
    },

    async updateUserProfile(profileData) {
        if (!auth.currentUser) return;
        try {
            const ref = doc(db, 'users', auth.currentUser.uid);
            await setDoc(ref, {
                ...profileData,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        } catch (err) {
            console.error("Failed to update user profile:", err);
        }
    },

    async saveUserProfile(operatorName, avatar) {
        return this.updateUserProfile({
            operatorName,
            avatar
        });
    },

    // Session Security & Token Validation
    async getValidToken(forceRefresh = false) {
        if (!auth.currentUser) return null;
        try {
            const token = await auth.currentUser.getIdToken(forceRefresh);
            return token;
        } catch (err) {
            console.error("Token verification failed:", err);
            return null;
        }
    }
};

// --------------------------------------------------------------------------
// Session Inactivity Timeout Guard (30 Minutes)
// --------------------------------------------------------------------------
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
let sessionTimeoutTimer = null;
let lastActivityTimestamp = Date.now();

function resetSessionActivity() {
    lastActivityTimestamp = Date.now();
    if (sessionTimeoutTimer) clearTimeout(sessionTimeoutTimer);

    if (auth.currentUser) {
        sessionTimeoutTimer = setTimeout(async () => {
            if (auth.currentUser) {
                console.warn("[Security] User session timed out due to inactivity.");
                await signOut(auth);
                window.dispatchEvent(new CustomEvent('obsidian-session-timeout', {
                    detail: { reason: 'inactivity', timestamp: new Date().toISOString() }
                }));
            }
        }, INACTIVITY_TIMEOUT_MS);
    }
}

// Activity listeners to reset idle timer
if (typeof window !== 'undefined') {
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, resetSessionActivity, { passive: true });
    });
}

// Listen to Auth State
let unsubscribeClasses = null;
let unsubscribeTasks = null;
let unsubscribeProfile = null;

onAuthStateChanged(auth, async (user) => {
    window.ObsidianAuth.currentUser = user;
    resetSessionActivity();
    
    if (unsubscribeClasses) unsubscribeClasses();
    if (unsubscribeTasks) unsubscribeTasks();
    if (unsubscribeProfile) unsubscribeProfile();

    if (user) {
        window.ObsidianAuth.isCloudSynced = true;
        window.ObsidianAuth.syncStatus = 'synced';

        // Verify token integrity on start
        try {
            await user.getIdToken();
        } catch (tokenErr) {
            console.warn("Token check warning:", tokenErr);
        }

        // Initial sync of user cloud data immediately upon sign-in
        await window.ObsidianAuth.syncUserCloudData(user.uid);

        // 1. Subscribe to profile
        unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.operatorName) {
                    localStorage.setItem('obsidian_operator_name', data.operatorName);
                }
                if (data.avatar) {
                    localStorage.setItem('obsidian_avatar', data.avatar);
                }
                if (window.ObsidianUI && typeof window.ObsidianUI.refreshUI === 'function') {
                    window.ObsidianUI.refreshUI();
                }
            }
        });

        // 2. Subscribe to user's classes collection in real-time
        const classesCol = collection(db, 'users', user.uid, 'classes');
        unsubscribeClasses = onSnapshot(classesCol, (snap) => {
            if (snap.empty && !window.ObsidianAuth.isMigrating) {
                window.ObsidianAuth.syncUserCloudData(user.uid);
                return;
            }
            if (!snap.empty) {
                const classesList = [];
                snap.forEach(docSnap => {
                    classesList.push({
                        id: docSnap.id,
                        ...docSnap.data()
                    });
                });
                localStorage.setItem('obsidianClasses', JSON.stringify(classesList));
                localStorage.setItem('obsidian_backup_classes', JSON.stringify(classesList));
                window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
                window.dispatchEvent(new CustomEvent('obsidian-cloud-data-synced', {
                    detail: { classes: classesList }
                }));
                if (window.ObsidianUI && typeof window.ObsidianUI.refreshUI === 'function') {
                    window.ObsidianUI.refreshUI();
                }
            }
        }, (error) => {
            console.error("Firestore Classes sync error:", error);
        });

        // 3. Subscribe to user's tasks collection in real-time
        const tasksCol = collection(db, 'users', user.uid, 'tasks');
        unsubscribeTasks = onSnapshot(tasksCol, (snap) => {
            if (snap.empty && !window.ObsidianAuth.isMigrating) {
                window.ObsidianAuth.syncUserCloudData(user.uid);
                return;
            }
            if (!snap.empty) {
                const tasksList = [];
                snap.forEach(docSnap => {
                    tasksList.push({
                        id: docSnap.id,
                        ...docSnap.data()
                    });
                });
                localStorage.setItem('obsidianTasks', JSON.stringify(tasksList));
                localStorage.setItem('obsidian_backup_tasks', JSON.stringify(tasksList));
                window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
                window.dispatchEvent(new CustomEvent('obsidian-cloud-data-synced', {
                    detail: { tasks: tasksList }
                }));
                if (window.ObsidianUI && typeof window.ObsidianUI.refreshUI === 'function') {
                    window.ObsidianUI.refreshUI();
                }
            }
        }, (error) => {
            console.error("Firestore Tasks sync error:", error);
        });

    } else {
        window.ObsidianAuth.isCloudSynced = false;
        window.ObsidianAuth.syncStatus = 'guest';
        if (sessionTimeoutTimer) clearTimeout(sessionTimeoutTimer);
        window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
    }

    // Trigger UI Update for Auth Header and Modals
    window.dispatchEvent(new CustomEvent('obsidian-auth-state-changed', { detail: { user } }));
});
