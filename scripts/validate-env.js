const fs = require('fs');
const path = require('path');

const requiredEnvVars = [
  'ENVIRONMENT',
  'APP_NAME',
  'RESOURCE_GROUP',
  'AZURE_SUBSCRIPTION_ID',
  'AZURE_TENANT_ID',
  'AZURE_CLIENT_ID',
  'AZURE_CLIENT_SECRET'
];

function validateEnv() {
  const missingVars = [];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env file and set all required variables.');
    process.exit(1);
  }

  console.log('✅ Environment validation passed');
  return true;
}

// Validate environment values
function validateValues() {
  const env = process.env.ENVIRONMENT;
  const validEnvs = ['dev', 'staging', 'production'];
  
  if (!validEnvs.includes(env)) {
    console.error(`❌ Invalid ENVIRONMENT value: ${env}`);
    console.error(`   Must be one of: ${validEnvs.join(', ')}`);
    process.exit(1);
  }

  return true;
}

if (require.main === module) {
  validateEnv();
  validateValues();
}

module.exports = {
  validateEnv,
  validateValues
};