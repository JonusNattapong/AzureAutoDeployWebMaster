const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const logger = require('./logger');
const { validateEnv, validateValues } = require('./validate-env');

class DeploymentManager {
  constructor(environment) {
    this.environment = environment || 'dev';
    validateEnv();
    validateValues();
    
    this.config = {
      appName: process.env.APP_NAME,
      resourceGroup: process.env.RESOURCE_GROUP,
      location: process.env.LOCATION || 'eastus'
    };
    
    logger.info(`Initializing deployment for ${this.environment} environment`);
  }

  async buildProject() {
    try {
      logger.info('Starting build process...');
      execSync('npm run build', { stdio: 'inherit' });
      logger.success('Build completed successfully');
    } catch (error) {
      logger.error(`Build failed: ${error.message}`);
      throw error;
    }
  }

  async runTests() {
    try {
      logger.info('Running test suite...');
      execSync('npm test', { stdio: 'inherit' });
      logger.success('Tests passed successfully');
    } catch (error) {
      logger.error(`Tests failed: ${error.message}`);
      throw error;
    }
  }

  async deploy() {
    try {
      logger.info(`Deploying to ${this.environment} environment...`);
      const deployCmd = `az webapp up --name ${this.config.appName}-${this.environment} ` +
        `--resource-group ${this.config.resourceGroup} ` +
        `--location ${this.config.location} ` +
        `--html --runtime "NODE|18-lts"`;
      execSync(deployCmd, { stdio: 'inherit' });
      logger.success(`Deployment to ${this.environment} completed`);
    } catch (error) {
      logger.error(`Deployment failed: ${error.message}`);
      throw error;
    }
  }

  async verifyDeployment() {
    try {
      logger.info('Running deployment verification...');
      execSync('npm run health-check', { stdio: 'inherit' });
      logger.success('Deployment verification passed');
    } catch (error) {
      logger.error(`Deployment verification failed: ${error.message}`);
      throw error;
    }
  }
}

// Main execution
if (require.main === module) {
  const environment = process.argv[2] || 'dev';
  const deployer = new DeploymentManager(environment);

  (async () => {
    try {
      logger.info('Starting deployment process...');
      await deployer.buildProject();
      await deployer.runTests();
      await deployer.deploy();
      await deployer.verifyDeployment();
      logger.success('🚀 Deployment pipeline completed successfully');
    } catch (error) {
      logger.error('💥 Deployment pipeline failed');
      process.exit(1);
    }
  })();
}

module.exports = DeploymentManager;