// This script generates instructions for configuring Vercel deployment
console.log('=== Vercel Deployment Configuration Guide ===');
console.log('\nRequired Environment Variables for Vercel:');
console.log('1. NEXTAUTH_URL=https://nextjs-auth-weld-eta.vercel.app');
console.log('2. NEXTAUTH_SECRET=[your-secret-key]');
console.log('3. GOOGLE_CLIENT_ID=[your-google-client-id]');
console.log('4. GOOGLE_CLIENT_SECRET=[your-google-client-secret]');
console.log('5. MONGODB_URI=[your-mongodb-connection-string]');

console.log('\nGoogle OAuth Configuration:');
console.log('1. Authorized JavaScript origins:');
console.log('   - https://nextjs-auth-weld-eta.vercel.app');
console.log('2. Authorized redirect URIs:');
console.log('   - https://nextjs-auth-weld-eta.vercel.app/api/auth/callback/google');

console.log('\nCommon Issues:');
console.log('1. NEXTAUTH_URL must match your Vercel deployment URL exactly');
console.log('2. Google OAuth credentials must be configured for your Vercel domain');
console.log('3. MongoDB connection might be failing (check IP whitelist)');
console.log('4. Session cookies might not be setting properly (check for secure cookie issues)');

console.log('\nTo fix the redirect loop:');
console.log('1. Check Vercel logs for authentication errors');
console.log('2. Verify MongoDB connection is working from Vercel');
console.log('3. Make sure your Google OAuth configuration includes the correct redirect URI');
console.log('4. Try setting NEXTAUTH_URL to use https:// protocol'); 