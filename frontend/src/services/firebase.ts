// frontend/src/services/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";

export const firebaseConfig = {
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "brightloop-billing",
	appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:387841426735:web:644555e2646859ab790dda",
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "brightloop-billing.firebasestorage.app",
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "brightloop-billing.firebaseapp.com",
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "387841426735",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export async function loginWithEmail(email: string, password: string): Promise<User> {
	const userCredential = await signInWithEmailAndPassword(auth, email, password);
	return userCredential.user;
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	return userCredential.user;
}

export async function sendVerificationEmail(user: User): Promise<void> {
	await sendEmailVerification(user);
}

export async function logoutUser(): Promise<void> {
	await signOut(auth);
}

export async function getCurrentUserToken(): Promise<string | null> {
	const user = auth.currentUser;
	if (user) {
		return await user.getIdToken();
	}

	return new Promise((resolve) => {
		const timeout = setTimeout(() => {
			unsubscribe();
			resolve(null);
		}, 2500);

		const unsubscribe = onAuthStateChanged(auth, async (u) => {
			clearTimeout(timeout);
			unsubscribe();
			if (u) {
				const token = await u.getIdToken();
				resolve(token);
			} else {
				resolve(null);
			}
		});
	});
}
