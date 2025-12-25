#!/usr/bin/env node

/**
 * Script to set build version information as environment variables
 * This runs before the build to inject version info
 * Auto-increments patch version on each build
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Get package.json version
const packageJsonPath = path.join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
let currentVersion = packageJson.version || '1.0.0'

// Auto-increment patch version (e.g., 1.0.0 -> 1.0.1)
const versionParts = currentVersion.split('.')
if (versionParts.length === 3) {
  const major = parseInt(versionParts[0]) || 1
  const minor = parseInt(versionParts[1]) || 0
  const patch = parseInt(versionParts[2]) || 0
  const newVersion = `${major}.${minor}.${patch + 1}`
  
  // Update package.json with new version
  packageJson.version = newVersion
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
  
  console.log(`📦 Version updated: ${currentVersion} → ${newVersion}`)
  currentVersion = newVersion
}

const appVersion = currentVersion

// Get git commit hash (if available)
// Check Vercel environment variables first, then fall back to git
let gitCommitHash = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_HASH || 'unknown'
if (gitCommitHash === 'unknown') {
  try {
    gitCommitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
  } catch (error) {
    console.warn('⚠️  Could not get git commit hash:', error.message)
  }
}

// Get build timestamp
const buildTimestamp = new Date().toISOString()

// Create .env.local file with version info
const envPath = path.join(__dirname, '..', '.env.local')
let envContent = ''

// Read existing .env.local if it exists
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8')
  // Remove old version variables if they exist
  envContent = envContent.replace(/NEXT_PUBLIC_BUILD_TIMESTAMP=.*\n/g, '')
  envContent = envContent.replace(/NEXT_PUBLIC_GIT_COMMIT_HASH=.*\n/g, '')
  envContent = envContent.replace(/NEXT_PUBLIC_APP_VERSION=.*\n/g, '')
}

// Add version info
envContent += `\n# Build version info (auto-generated)\n`
envContent += `NEXT_PUBLIC_APP_VERSION=${appVersion}\n`
envContent += `NEXT_PUBLIC_BUILD_TIMESTAMP=${buildTimestamp}\n`
envContent += `NEXT_PUBLIC_GIT_COMMIT_HASH=${gitCommitHash}\n`

// Write to .env.local
fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8')

console.log('✅ Build version info set:')
console.log(`   Version: ${appVersion}`)
console.log(`   Build Time: ${buildTimestamp}`)
console.log(`   Commit: ${gitCommitHash.substring(0, 7)}`)

