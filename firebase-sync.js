import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut,
    sendPasswordResetEmail,
    updateProfile
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

// Expose state and functions to window for global access
window.ObsidianAuth = {
    app,
    auth,
    db,
    currentUser: null,
    isCloudSynced: false,
    syncStatus: 'offline', // 'synced', 'syncing', 'guest'

    // Auth Actions
    async registerWithEmail(email, password, displayName) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (displayName) {
            await updateProfile(user, { displayName });
        }
        // Create initial user doc
        await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            email: user.email,
            operatorName: displayName || user.email.split('@')[0],
            avatar: localStorage.getItem('obsidian_avatar') || 'photos/avatar.png',
            theme: localStorage.getItem('obsidian_theme') || 'dark',
            lang: localStorage.getItem('obsidian_lang') || 'en',
            updatedAt: new Date().toISOString()
        }, { merge: true });

        // Migrate existing guest data if present
        await window.ObsidianAuth.migrateGuestDataToCloud(user.uid);
        return user;
    },

    async loginWithEmail(email, password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    },

    async loginWithGoogle() {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;
        
        // Sync user doc
        await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            email: user.email,
            operatorName: user.displayName || user.email.split('@')[0],
            avatar: user.photoURL || localStorage.getItem('obsidian_avatar') || 'photos/avatar.png',
            theme: localStorage.getItem('obsidian_theme') || 'dark',
            lang: localStorage.getItem('obsidian_lang') || 'en',
            updatedAt: new Date().toISOString()
        }, { merge: true });

        await window.ObsidianAuth.migrateGuestDataToCloud(user.uid);
        return user;
    },

    async sendPasswordReset(email) {
        await sendPasswordResetEmail(auth, email);
    },

    async logout() {
        await signOut(auth);
    },

    async signOut() {
        await signOut(auth);
    },

    async signInWithGoogle() {
        return this.loginWithGoogle();
    },

    async signInWithEmail(email, password) {
        return this.loginWithEmail(email, password);
    },

    // Cloud Data Migration from LocalStorage (Guest -> Cloud)
    async migrateGuestDataToCloud(userId) {
        try {
            const localClasses = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
            const localTasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');

            // Check if user already has data in cloud
            const classesCol = collection(db, 'users', userId, 'classes');
            const tasksCol = collection(db, 'users', userId, 'tasks');

            const existingClassesSnap = await getDocs(classesCol);
            if (existingClassesSnap.empty && localClasses.length > 0) {
                for (const c of localClasses) {
                    await addDoc(classesCol, {
                        userId,
                        title: c.title || 'Untitled Class',
                        code: c.code || '',
                        instructor: c.instructor || '',
                        date: c.date || 'Mon, 09:00 - 10:30',
                        createdAt: new Date().toISOString()
                    });
                }
            }

            const existingTasksSnap = await getDocs(tasksCol);
            if (existingTasksSnap.empty && localTasks.length > 0) {
                for (const t of localTasks) {
                    await addDoc(tasksCol, {
                        userId,
                        title: t.title || 'Untitled Task',
                        description: t.description || '',
                        date: t.date || 'Wed, 23:59',
                        completed: !!t.completed,
                        createdAt: new Date().toISOString()
                    });
                }
            }
        } catch (e) {
            console.error("Migration warning:", e);
        }
    },

    // Save Class to Cloud
    async addClass(classData) {
        if (!auth.currentUser) return null;
        const ref = collection(db, 'users', auth.currentUser.uid, 'classes');
        const docRef = await addDoc(ref, {
            ...classData,
            userId: auth.currentUser.uid,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    },

    async updateClass(classId, updatedData) {
        if (!auth.currentUser || !classId) return;
        const ref = doc(db, 'users', auth.currentUser.uid, 'classes', classId);
        await updateDoc(ref, {
            ...updatedData,
            updatedAt: new Date().toISOString()
        });
    },

    async deleteClass(classId) {
        if (!auth.currentUser || !classId) return;
        const ref = doc(db, 'users', auth.currentUser.uid, 'classes', classId);
        await deleteDoc(ref);
    },

    // Save Task to Cloud
    async addTask(taskData) {
        if (!auth.currentUser) return null;
        const ref = collection(db, 'users', auth.currentUser.uid, 'tasks');
        const docRef = await addDoc(ref, {
            ...taskData,
            userId: auth.currentUser.uid,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    },

    async updateTask(taskId, updatedData) {
        if (!auth.currentUser || !taskId) return;
        const ref = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
        await updateDoc(ref, {
            ...updatedData,
            updatedAt: new Date().toISOString()
        });
    },

    async deleteTask(taskId) {
        if (!auth.currentUser || !taskId) return;
        const ref = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
        await deleteDoc(ref);
    },

    async updateUserProfile(profileData) {
        if (!auth.currentUser) return;
        const ref = doc(db, 'users', auth.currentUser.uid);
        await setDoc(ref, {
            ...profileData,
            updatedAt: new Date().toISOString()
        }, { merge: true });
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
                if (window.ObsidianUI && window.ObsidianUI.refreshUI) {
                    window.ObsidianUI.refreshUI();
                }
            }
        });

        // 2. Subscribe to user's classes collection in real-time
        const classesCol = collection(db, 'users', user.uid, 'classes');
        unsubscribeClasses = onSnapshot(classesCol, (snap) => {
            const classesList = [];
            snap.forEach(doc => {
                classesList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            localStorage.setItem('obsidianClasses', JSON.stringify(classesList));
            window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
        }, (error) => {
            console.error("Firestore Classes sync error:", error);
        });

        // 3. Subscribe to user's tasks collection in real-time
        const tasksCol = collection(db, 'users', user.uid, 'tasks');
        unsubscribeTasks = onSnapshot(tasksCol, (snap) => {
            const tasksList = [];
            snap.forEach(doc => {
                tasksList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            localStorage.setItem('obsidianTasks', JSON.stringify(tasksList));
            window.dispatchEvent(new CustomEvent('obsidian-data-updated'));
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
