import { getAuth } from 'firebase-admin/auth';
import firebaseApp from './firebaseApp';

const firebaseAdminAuth = getAuth(firebaseApp);

export default firebaseAdminAuth;
