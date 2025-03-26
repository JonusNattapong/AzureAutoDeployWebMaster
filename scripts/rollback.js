const axios = require('axios');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const { validateEnv } = require('./validate-env');

class RollbackManager {
  constructor() {
    validateEnv();
    
    this.config = {
      appName: process.env.APP_NAME,
      resourceGroup: process.env.RESOURCE_GROUP,
      subscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
      tenantId: process.env.AZURE_TENANT_ID,
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET
    };
    
    logger.info('Initializing rollback manager');
  }

  async getAccessToken() {
    try {
      logger.info('Obtaining Azure access token...');
      const url = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/token`;
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.config.clientId);
      params.append('client_secret', this.config.clientSecret);
      params.append('resource', 'https://management.azure.com/');

      const response = await axios.post(url, params);
      logger.success('Successfully obtained access token');
      return response.data.access_token;
    } catch (error) {
      logger.error(`Failed to obtain access token: ${error.message}`);
      throw error;
    }
  }

  async getDeploymentHistory() {
    try {
      logger.info('Fetching deployment history...');
      const token = await this.getAccessToken();
      const url = `https://management.azure.com/subscriptions/${this.config.subscriptionId}` +
        `/resourceGroups/${this.config.resourceGroup}/providers/Microsoft.Web/sites/` +
        `${this.config.appName}/deployments?api-version=2022-03-01`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logger.success(`Found ${response.data.value.length} previous deployments`);
      return response.data.value;
    } catch (error) {
      logger.error(`Failed to fetch deployment history: ${error.message}`);
      throw error;
    }
  }

  async rollbackTo(commitId) {
    try {
      logger.info(`Initiating rollback to commit ${commitId}...`);
      const token = await this.getAccessToken();
      const url = `https://management.azure.com/subscriptions/${this.config.subscriptionId}` +
        `/resourceGroups/${this.config.resourceGroup}/providers/Microsoft.Web/sites/` +
        `${this.config.appName}/deployments/${commitId}/rollback?api-version=2022-03-01`;

      await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logger.success(`Successfully rolled back to ${commitId}`);
    } catch (error) {
      logger.error(`Rollback failed: ${error.message}`);
      throw error;
    }
  }
}

// Main execution
if (require.main === module) {
  const commitId = process.argv[2];
  
  if (!commitId) {
    logger.error('Missing commit ID');
    logger.info('Usage: node rollback.js <commit-id>');
    process.exit(1);
  }

  (async () => {
    const rollback = new RollbackManager();
    try {
      logger.info(`Starting rollback process to commit ${commitId}...`);
      
      // Get deployment history first to validate commit exists
      const history = await rollback.getDeploymentHistory();
      const validCommit = history.some(d => d.id.includes(commitId));
      
      if (!validCommit) {
        logger.error(`Commit ${commitId} not found in deployment history`);
        process.exit(1);
      }

      await rollback.rollbackTo(commitId);
      logger.success('🔄 Rollback completed successfully');
    } catch (error) {
      logger.error('💥 Rollback process failed');
      process.exit(1);
    }
  })();
}

module.exports = RollbackManager;