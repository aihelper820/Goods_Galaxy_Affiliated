#!/usr/bin/env node
/**
 * Clean up products with invalid slugs
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { Client, Databases, Query } from 'node-appwrite'

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

async function cleanupProducts() {
  console.log('\n' + '='.repeat(60))
  console.log('🧹 CLEANING UP PRODUCTS')
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
    const databases = new Databases(client)
    console.log('✅ Connected')

    const dbId = env.APPWRITE_DATABASE_ID || 'affiliate_db'
    const collectionId = env.APPWRITE_PRODUCTS_COLLECTION_ID || 'products'

    console.log(`\n📋 Fetching all products...`)
    const response = await databases.listDocuments(dbId, collectionId, [Query.limit(100)])

    console.log(`Found ${response.documents.length} products\n`)

    let cleaned = 0
    for (const product of response.documents) {
      const slug = product.slug || ''
      
      // Check if slug looks like a URL (contains https:// or //)
      if (slug.includes('https://') || slug.includes('//') || slug.includes('amazon.com')) {
        console.log(`❌ Found invalid slug: "${slug}"`)
        console.log(`   Product: ${product.title}`)
        console.log(`   ID: ${product.$id}`)
        
        // Generate a proper slug from title
        const newSlug = product.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')

        console.log(`   Fixing with: "${newSlug}"`)
        
        try {
          await databases.updateDocument(dbId, collectionId, product.$id, {
            slug: newSlug,
          })
          console.log(`   ✅ Fixed!\n`)
          cleaned++
        } catch (err) {
          console.log(`   ❌ Error: ${err.message}\n`)
        }
      }
    }

    console.log(`\n✨ Cleanup complete! Fixed ${cleaned} product(s)`)
    console.log('🎉 Products should now be accessible\n')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

cleanupProducts()
