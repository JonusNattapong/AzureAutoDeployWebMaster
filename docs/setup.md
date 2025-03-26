# Azure AutoDeploy WebMaster - Setup Guide

## Initial Azure Configuration

1. **Create Azure Resources**:
   - Create an Azure App Service for each environment (dev, staging, production)
   - Create an Azure DevOps project or GitHub repository
   - Set up Application Insights for monitoring

2. **Service Principal Setup**:
```bash
az ad sp create-for-rbac --name "AutoDeployWebMaster" --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/<resource-group>
```
Store these credentials securely:
- ARM_CLIENT_ID (Application ID)
- ARM_CLIENT_SECRET (Password)
- ARM_SUBSCRIPTION_ID
- ARM_TENANT_ID

3. **Pipeline Configuration**:
- Add service connection in Azure DevOps
- Set up GitHub secrets if using GitHub Actions

## Local Development Setup
1. **Clone Repository**:
```bash
git clone https://github.com/your-org/azure-autodeploy-webmaster.git
cd azure-autodeploy-webmaster
```

2. **Install Dependencies**:
```bash
npm install
```

3. **Configure Environment Variables**:
Copy `.env.example` to `.env` and fill in values:
```bash
cp .env.example .env
```

## First Deployment
1. Run initial pipeline manually from Azure DevOps/GitHub
2. Verify deployment in Azure portal
3. Check monitoring in Application Insights