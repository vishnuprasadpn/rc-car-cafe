export const BUILD_TIMESTAMP = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || new Date().toISOString()
export const GIT_COMMIT_HASH = process.env.NEXT_PUBLIC_GIT_COMMIT_HASH || 'unknown'
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
export const ENVIRONMENT = process.env.NODE_ENV || 'development'

export const getVersionInfo = () => {
  const buildDate = new Date(BUILD_TIMESTAMP)
  const formattedDate = buildDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })

  return {
    version: APP_VERSION,
    buildTime: formattedDate,
    commitHash: GIT_COMMIT_HASH.substring(0, 7),
    environment: ENVIRONMENT,
    fullInfo: `v${APP_VERSION} | Built: ${formattedDate} | Commit: ${GIT_COMMIT_HASH.substring(0, 7)} | Env: ${ENVIRONMENT}`
  }
}

export const logVersionInfo = () => {
  if (typeof window === 'undefined') return

  const info = getVersionInfo()
  
  // Create a styled console message
  console.log(
    '%c🚀 Fury Road RC Club',
    'color: #FF6B35; font-size: 16px; font-weight: bold; padding: 4px 0;'
  )
  console.log(
    '%cVersion Info:',
    'color: #F7931E; font-size: 12px; font-weight: bold;'
  )
  console.log(`  📦 Version: ${info.version}`)
  console.log(`  🕒 Built: ${info.buildTime}`)
  console.log(`  🔖 Commit: ${info.commitHash}`)
  console.log(`  🌍 Environment: ${info.environment}`)
  console.log(
    '%c─────────────────────────────────────',
    'color: #666;'
  )
  console.log(
    '%c✅ Latest changes are live!',
    'color: #4CAF50; font-size: 11px; font-weight: bold;'
  )
  console.log('')
}

