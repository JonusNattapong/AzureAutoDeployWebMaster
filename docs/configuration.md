# Azure AutoDeploy WebMaster - Configuration Reference

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ENVIRONMENT` | Yes | Deployment environment | `dev`, `staging`, `production` |
| `APP_NAME` | Yes | Application name | `my-web-app` |
| `RESOURCE_GROUP` | Yes | Azure resource group | `my-resource-group` |
| `APP_INSIGHTS_KEY` | No | Application Insights key | `123e4567-e89b-12d3-a456-426614174000` |

## Pipeline Variables

### Azure DevOps
- `Build.ArtifactStagingDirectory`: Path to store build artifacts
- `System.DefaultWorkingDirectory`: Pipeline working directory
- `Build.SourceBranch`: Source branch being built

### GitHub Actions
- `GITHUB_WORKSPACE`: GitHub Actions workspace path
- `GITHUB_REF`: Branch or tag ref that triggered workflow

## Deployment Slots

Configuration for multi-slot deployments:

```yaml
slots:
  production:
    traffic_percentage: 100
  staging:
    traffic_percentage: 0
    swap_with: production
```

## Rollback Configuration

```yaml
rollback:
  enabled: true
  max_attempts: 3
  health_check_path: /health
  health_check_timeout: 60