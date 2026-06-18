#!/usr/bin/env node
/**
 * Fix Appwrite bucket permissions to allow public read access
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { Client, Storage } from 'node-appwrite'
import { Permission, Role } from 'node-appwrite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '../.env.local')

function loadEnv() {
  const content = fs.readFileSync(envPath, 'utf-8')
  const env = {}
  content.split('\n').forEach((line) => {
    const [key, value] = line.split('=').map((s) => s.trim())
    if (key && !key.startsWith('#')) env[key] = value
  })
  return env
}

async function fixBucketPermissions() {
  console.log('\n' + '='.repeat(60))
  console.log('🔒 FIXING APPWRITE BUCKET PERMISSIONS')
  console.log('='.repeat(60))

  try {
    console.log('\n📂 Loading environment...')
    const env = loadEnv()
    console.log('✅ Environment loaded')

    console.log('\n🔗 Connecting to Appwrite...')
    const client = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(env.APPWRITE_API_KEY)
    const storage = new Storage(client)
    console.log('✅ Connected')

    const bucketId = env.APPWRITE_BUCKET_ID || 'product_images'
    console.log(`\n🔄 Updating permissions for bucket: ${bucketId}`)

    // Update bucket to allow public read access
    const permissions = [
      Permission.read(Role.guests()), // Allow guest users to read files
      Permission.read(Role.any()), // Allow any user to read files
    ]

    await storage.updateBucket(bucketId, 'Product Images', permissions)
    console.log('✅ Bucket permissions updated!')
    console.log(`   - Allow guests to read: ✓`)
    console.log(`   - Allow any users to read: ✓`)

    console.log('\n✨ Bucket is now publicly readable!')
    console.log('🎉 Images should now display correctly\n')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

fixBucketPermissions()
