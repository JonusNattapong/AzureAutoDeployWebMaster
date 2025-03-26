# Azure AutoDeploy WebMaster

A comprehensive automated web deployment system leveraging Azure technologies.

## Features
- CI/CD pipelines using Azure DevOps and GitHub Actions
- Automated deployments to Azure App Service
- Environment-specific configurations
- Rollback mechanisms
- Monitoring and logging integration
- Scalable and secure architecture

## Getting Started

### Prerequisites
- Azure account
- Azure DevOps organization
- GitHub account (if using GitHub Actions)
- Node.js (for sample web app)

### Setup

1. Clone this repository:
```bash
git clone https://github.com/your-org/azure-autodeploy-webmaster.git
cd azure-autodeploy-webmaster
```

2. Configure Azure resources (see `docs/setup.md`)

3. Set up GitHub Secrets:
```bash
# Create Azure service principal for GitHub Actions
az ad sp create-for-rbac --name "GitHubActions" --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
  --sdk-auth
```
Copy the JSON output and add as GitHub secret named `AZURE_CREDENTIALS`

4. Add additional secrets:
- `APP_NAME`: Your Azure Web App name
- `APP_PORT`: Port your app runs on (default: 3000)

5. Run initial deployment by pushing to main branch

## Documentation
- [Setup Guide](./docs/setup.md)
- [Configuration Reference](./docs/configuration.md)
- [Pipeline Architecture](./docs/architecture.md)