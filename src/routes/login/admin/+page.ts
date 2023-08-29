import { collection, getDocs, query } from 'firebase/firestore';
import type { PageLoad } from './$types';
import { db, type UserData } from '$lib/firebase';

export const load = (async (here) => {
    // TODO add server side control if a user is an admin 
    const collectionRef = collection(db, 'users');
    const q = query(
        collectionRef,
    );

    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(user => user.data()) as UserData[];

    console.warn(users);
    return { users };

}) satisfies PageLoad;