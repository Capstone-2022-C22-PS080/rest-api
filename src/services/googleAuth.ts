import { GoogleAuth } from 'google-auth-library';

const googleAuth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

export default googleAuth;
