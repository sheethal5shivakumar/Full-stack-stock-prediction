// This script checks the OAuth configuration in the environment
require('dotenv').config({ path: '.env.local' });

function checkOAuthConfig() {
  console.log('Checking OAuth configuration...');
  
  // Check required environment variables
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'MONGODB_URI'
  ];
  
  const missingVars = [];
  const configuredVars = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    } else {
      configuredVars.push(varName);
    }
  });
  
  // Print results
  console.log('\n=== OAuth Configuration Status ===');
  
  if (configuredVars.length > 0) {
    console.log('\n✅ Configured Variables:');
    configuredVars.forEach(varName => {
      let value = process.env[varName];
      
      // Mask sensitive values
      if (varName === 'NEXTAUTH_SECRET' || varName === 'GOOGLE_CLIENT_SECRET') {
        value = value.substring(0, 3) + '...' + value.substring(value.length - 3);
      } else if (varName === 'MONGODB_URI') {
        value = value.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:****@');
      }
      
      console.log(`- ${varName}: ${value}`);
    });
  }
  
  if (missingVars.length > 0) {
    console.log('\n❌ Missing Variables:');
    missingVars.forEach(varName => {
      console.log(`- ${varName}`);
    });
  }
  
  // Check NEXTAUTH_URL format
  if (process.env.NEXTAUTH_URL) {
    try {
      const url = new URL(process.env.NEXTAUTH_URL);
      if (!url.protocol.startsWith('http')) {
        console.log('\n⚠️ Warning: NEXTAUTH_URL should start with http:// or https://');
      }
      
      console.log('\n📋 Google OAuth Configuration Guide:');
      console.log('1. Authorized JavaScript origins:');
      console.log(`   - ${url.origin}`);
      console.log('2. Authorized redirect URIs:');
      console.log(`   - ${url.origin}/api/auth/callback/google`);
    } catch (error) {
      console.log('\n⚠️ Error: NEXTAUTH_URL is not a valid URL');
    }
  }
  
  console.log('\n=== Troubleshooting Tips ===');
  console.log('1. Ensure all environment variables are set in your Vercel project settings');
  console.log('2. Update your Google OAuth credentials in Google Cloud Console');
  console.log('3. Check that your MongoDB Atlas IP whitelist includes Vercel deployment IPs');
  console.log('4. Verify that NEXTAUTH_URL matches your deployed application URL');
}

checkOAuthConfig(); 