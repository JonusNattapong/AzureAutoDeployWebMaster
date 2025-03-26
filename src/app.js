// Detect environment from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const environment = urlParams.get('env') || 'dev';
document.body.classList.add(environment);

// Set version from package.json or default
fetch('/package.json')
    .then(response => response.json())
    .then(pkg => {
        document.getElementById('version').textContent = pkg.version;
    })
    .catch(() => {
        document.getElementById('version').textContent = '1.0.0';
    });

// Deployment status indicators
const statusElement = document.getElementById('deployment-status');
const statusMessages = {
    dev: 'Running in development environment',
    staging: 'Running in staging environment (pre-production)',
    production: 'Running in production environment'
};

// Check deployment health
async function checkDeploymentHealth() {
    try {
        const response = await fetch('/health');
        if (response.ok) {
            statusElement.innerHTML = `
                <strong>✅ Operational</strong><br>
                ${statusMessages[environment] || ''}
            `;
        } else {
            statusElement.innerHTML = `
                <strong>⚠️ Degraded Performance</strong><br>
                ${statusMessages[environment] || ''}
            `;
        }
    } catch (error) {
        statusElement.innerHTML = `
            <strong>❌ Service Unavailable</strong><br>
            ${error.message}
        `;
    }
}

// Initialize deployment status
checkDeploymentHealth();
setInterval(checkDeploymentHealth, 30000); // Check every 30 seconds