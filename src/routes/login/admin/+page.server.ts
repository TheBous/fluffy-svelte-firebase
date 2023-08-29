import { collection, getDocs, query } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import { db, type UserData } from '$lib/firebase';
import { adminAuth, adminDB } from '$lib/server/admin';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals, params }) => {
    // TODO add server side control if a user is an admin 

    const { userID: uid } = locals;

    if (!uid) throw redirect(301, "/login");

    const userDoc = await adminDB.collection('users').doc(uid).get();
    const { isAdmin } = userDoc.data() as UserData;

    if (!isAdmin) return { users: [] }

    const collectionRef = collection(db, 'users');
    const q = query(
        collectionRef,
    );

    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(user => user.data()) as UserData[];

    return { users };

}) satisfies PageServerLoad;