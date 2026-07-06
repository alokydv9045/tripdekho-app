#!/usr/bin/env node

/**
 * TripDekho Platform - Unified Startup Script
 * Starts both backend (Node.js) and frontend (Next.js) applications
 * 
 * Usage:
 *   node scripts/start-both.js
 *   node scripts/start-both.js --dev
 *   node scripts/start-both.js --prod
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

// Configuration
const config = {
  backend: {
    name: 'Backend API',
    cwd: path.join(__dirname, '../backend'),
    script: 'server.js',
    devScript: 'npm run dev',
    prodScript: 'npm start',
    port: 5001,
    timeout: 10000, // 10 seconds
  },
  frontend: {
    name: 'Frontend App',
    cwd: path.join(__dirname, '../frontend'),
    script: 'next dev',
    devScript: 'npm run dev',
    prodScript: 'npm start',
    port: 3001,
    timeout: 15000, // 15 seconds
  },
};

// Parse command line arguments
const env = process.argv[2] || '--dev';
const isDev = env === '--dev' || env === 'dev';
const isProd = env === '--prod' || env === 'prod';
const isTest = env === '--test' || env === 'test';

const mode = isDev ? 'development' : isProd ? 'production' : 'test';

// Utility functions
function log(service, type, message) {
  const prefix = `[${service}]`;
  let icon = '';
  let color = colors.reset;

  switch (type) {
    case 'info':
      icon = 'ℹ️';
      color = colors.blue;
      break;
    case 'success':
      icon = '✅';
      color = colors.green;
      break;
    case 'error':
      icon = '❌';
      color = colors.red;
      break;
    case 'warning':
      icon = '⚠️';
      color = colors.yellow;
      break;
    case 'start':
      icon = '▶️';
      color = colors.cyan;
      break;
    case 'stop':
      icon = '⏹️';
      color = colors.red;
      break;
    default:
      icon = '•';
  }

  console.log(`${color}${icon} ${prefix} ${message}${colors.reset}`);
}

function checkEnv() {
  const backendEnvPath = path.join(config.backend.cwd, '.env');
  const frontendEnvPath = path.join(config.frontend.cwd, '.env.local');

  const issues = [];

  if (!fs.existsSync(backendEnvPath)) {
    issues.push('Backend .env file not found');
  }

  if (!fs.existsSync(frontendEnvPath) && !fs.existsSync(path.join(config.frontend.cwd, '.env'))) {
    issues.push('Frontend .env.local or .env file not found');
  }

  return issues;
}

function checkDependencies() {
  const backendNodeModules = path.join(config.backend.cwd, 'node_modules');
  const frontendNodeModules = path.join(config.frontend.cwd, 'node_modules');

  const issues = [];

  if (!fs.existsSync(backendNodeModules)) {
    issues.push('Backend dependencies not installed. Run: cd backend && npm install');
  }

  if (!fs.existsSync(frontendNodeModules)) {
    issues.push('Frontend dependencies not installed. Run: cd frontend && npm install');
  }

  return issues;
}

function startService(service, command) {
  return new Promise((resolve) => {
    log(service.name, 'start', `Starting in ${mode} mode...`);
    log(service.name, 'info', `Command: ${command}`);

    const process = spawn('npm', isDev ? ['run', 'dev'] : isProd ? ['start'] : ['run', 'dev'], {
      cwd: service.cwd,
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
    });

    let startupComplete = false;
    let startupTimeout;

    // Handle stdout
    if (process.stdout) {
      process.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(
          `${colors.cyan}[${service.name}]${colors.reset} ${output.trim()}`
        );

        // Check for startup completion signals
        const successPatterns = [
          'listening on',
          'server running',
          'ready',
          'started',
          'compiled successfully',
          'compiled client and server successfully',
          'started server on',
        ];

        if (!startupComplete && successPatterns.some((p) => output.toLowerCase().includes(p))) {
          if (!startupTimeout) {
            startupComplete = true;
            clearTimeout(startupTimeout);
            log(service.name, 'success', `${service.name} is running on port ${service.port}`);
          }
        }
      });
    }

    // Handle stderr
    if (process.stderr) {
      process.stderr.on('data', (data) => {
        const output = data.toString();
        console.error(
          `${colors.yellow}[${service.name}]${colors.reset} ${output.trim()}`
        );
      });
    }

    // Handle process exit
    process.on('error', (error) => {
      log(service.name, 'error', `Failed to start: ${error.message}`);
    });

    process.on('close', (code) => {
      log(service.name, 'stop', `Process exited with code ${code}`);
    });

    // Set startup timeout
    startupTimeout = setTimeout(() => {
      if (!startupComplete) {
        log(service.name, 'success', `${service.name} started (timeout reached)`);
        startupComplete = true;
      }
    }, service.timeout);

    resolve(process);
  });
}

async function startup() {
  console.log('\n');
  console.log(`${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║     TripDekho Platform - Full Stack Startup Manager         ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('\n');

  // Pre-flight checks
  log('System', 'info', 'Running pre-flight checks...');

  const envIssues = checkEnv();
  const depIssues = checkDependencies();
  const allIssues = [...envIssues, ...depIssues];

  if (allIssues.length > 0) {
    console.log('\n');
    log('System', 'warning', 'Pre-flight checks found issues:');
    allIssues.forEach((issue) => {
      log('System', 'error', issue);
    });
    console.log('\n');
    process.exit(1);
  }

  log('System', 'success', 'All pre-flight checks passed');
  log('System', 'info', `Starting services in ${colors.bright}${mode}${colors.reset} mode`);
  console.log('\n');

  // Start services
  const backendProcess = await startService(
    config.backend,
    isDev ? config.backend.devScript : config.backend.prodScript
  );

  // Add a small delay before starting frontend
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const frontendProcess = await startService(
    config.frontend,
    isDev ? config.frontend.devScript : config.frontend.prodScript
  );

  // Summary
  console.log('\n');
  console.log(`${colors.bright}${colors.green}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║          TripDekho Platform is Ready!                      ║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('\n');

  console.log(`${colors.green}✅ Backend API${colors.reset}    : http://localhost:${config.backend.port}`);
  console.log(`${colors.green}✅ Frontend App${colors.reset}   : http://localhost:${config.frontend.port}`);
  console.log(`${colors.green}✅ API Docs${colors.reset}      : http://localhost:${config.backend.port}/api/v1/docs`);
  console.log('\n');

  if (isDev) {
    console.log(`${colors.yellow}📝 Tips for Development:${colors.reset}`);
    console.log('   - Backend hot-reloads on file changes (via nodemon)');
    console.log('   - Frontend hot-reloads on file changes (via Next.js)');
    console.log('   - Check logs above for any issues');
    console.log('\n');
  }

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n');
    log('System', 'warning', 'Shutting down services...');
    backendProcess.kill();
    frontendProcess.kill();
    log('System', 'stop', 'All services stopped');
    process.exit(0);
  });
}

// Main execution
startup().catch((error) => {
  log('System', 'error', `Fatal error: ${error.message}`);
  process.exit(1);
});
