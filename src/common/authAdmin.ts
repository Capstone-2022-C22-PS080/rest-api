import { auth, initializeApp } from 'firebase-admin';

initializeApp();

const authAdmin = auth();

export default authAdmin;
