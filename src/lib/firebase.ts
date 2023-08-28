// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable, type Readable, derived } from "svelte/store";
import {
    PUBLIC_FB_APIKEY, PUBLIC_FB_AUTHDOMAIN,
    PUBLIC_FB_PROJECTID,
    PUBLIC_FB_STORAGEBUCKET,
    PUBLIC_FB_MESSAGINGSENDERID,
    PUBLIC_FB_APPID
} from "$env/static/public";

const firebaseConfig = {
    apiKey: PUBLIC_FB_APIKEY,
    authDomain: PUBLIC_FB_AUTHDOMAIN,
    projectId: PUBLIC_FB_PROJECTID,
    storageBucket: PUBLIC_FB_STORAGEBUCKET,
    messagingSenderId: PUBLIC_FB_MESSAGINGSENDERID,
    appId: PUBLIC_FB_APPID,
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

const userStore = () => {
    let unsubscribe: () => void;
    if (!auth || !globalThis.window) {
        console.warn("Firebase auth not initialized")
        const { subscribe } = writable<User | null>(null);
        return {
            subscribe,
        }
    }
    const { subscribe } = writable(auth?.currentUser, (set) => {
        unsubscribe = onAuthStateChanged(auth, (user) => set(user));
        return () => unsubscribe();
    });

    return {
        subscribe,
    };
};

export const user = userStore();

/**
 * @param  {string} path document path or reference
 * @param  {any} startWith optional default data
 * @returns a store with realtime updates on document data
 */
export function docStore<T>(
    path: string,
) {
    let unsubscribe: () => void;

    const docRef = doc(db, path);

    const { subscribe } = writable<T | null>(null, (set) => {
        unsubscribe = onSnapshot(docRef, (snapshot) => {
            set((snapshot.data() as T) ?? null);
        });

        return () => unsubscribe();
    });

    return {
        subscribe,
        ref: docRef,
        id: docRef.id,
    };
}

interface UserData {
    username: string;
    bio: string;
    photoURL: string;
    published: boolean;
    links: any[];
}

export const userData: Readable<UserData | null> = derived(user, ($user, set) => {
    if ($user) {
        return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
        set(null);
    }
});  