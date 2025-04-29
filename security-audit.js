const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runSecurityAudit() {
  console.log('Starting security audit...\n');

  try {
    // 1. npm audit
    const { stdout: npmAuditOutput } = await execAsync('npm audit');
    fs.writeFileSync(
      path.join(__dirname, 'audit-reports', `npm-audit-${Date.now()}.txt`),
      npmAuditOutput
    );

    // 2. Check for outdated packages
    const { stdout: outdatedOutput } = await execAsync('npm outdated');
    fs.writeFileSync(
      path.join(__dirname, 'audit-reports', `outdated-packages-${Date.now()}.txt`),
      outdatedOutput
    );

    // 3. Check for known vulnerabilities in dependencies
    const { stdout: auditFixOutput } = await execAsync('npm audit fix --dry-run');
    fs.writeFileSync(
      path.join(__dirname, 'audit-reports', `vulnerability-report-${Date.now()}.txt`),
      auditFixOutput
    );

    // 4. Check environment variables
    const envExample = fs.readFileSync('.env.example', 'utf8').split('\n');
    const envFile = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8').split('\n') : [];
    
    const missingEnvVars = envExample
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => line.split('=')[0])
      .filter(variable => !envFile.some(line => line.startsWith(variable)));

    if (missingEnvVars.length > 0) {
      console.log('Missing environment variables:', missingEnvVars);
    }

    // 5. Check security headers
    const serverFile = fs.readFileSync('server.js', 'utf8');
    const securityChecks = {
      helmet: serverFile.includes('helmet('),
      cors: serverFile.includes('cors('),
      rateLimit: serverFile.includes('rateLimit('),
      contentSecurityPolicy: serverFile.includes('contentSecurityPolicy'),
    };

    fs.writeFileSync(
      path.join(__dirname, 'audit-reports', `security-headers-${Date.now()}.json`),
      JSON.stringify(securityChecks, null, 2)
    );

    // 6. Check for sensitive data in git history
    const { stdout: gitGrepOutput } = await execAsync(
      'git log -p | grep -i "password\\|secret\\|key\\|token"'
    ).catch(() => ({ stdout: 'No sensitive data found in git history' }));

    fs.writeFileSync(
      path.join(__dirname, 'audit-reports', `git-sensitive-data-${Date.now()}.txt`),
      gitGrepOutput
    );

    console.log('\nSecurity audit completed. Check the audit-reports directory for detailed results.');

  } catch (error) {
    console.error('Error during security audit:', error);
    process.exit(1);
  }
}

// Create audit-reports directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'audit-reports'))) {
  fs.mkdirSync(path.join(__dirname, 'audit-reports'));
}

// Run the audit
runSecurityAudit();
