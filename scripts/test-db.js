#!/usr/bin/env node
/**
 * Quick Product Seed
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { Client, Databases } from 'node-appwrite'

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

async function main() {
  console.log('🚀 Quick Database Test\n')

  try {
    const env = loadEnv()
    const client = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(env.APPWRITE_API_KEY)
    
    const databases = new Databases(client)
    const dbId = env.APPWRITE_DATABASE_ID || 'affiliate_db'

    // List all collections
    console.log('📂 List Collections:')
    const db = await databases.get(dbId)
    console.log(`Database: ${db.name}`)
    
    // Try listing documents from categories collection
    const catColl = env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories'
    try {
      const cats = await databases.listDocuments(dbId, catColl)
      console.log(`✓ Categories collection has ${cats.documents.length} documents`)
      cats.documents.slice(0,3).forEach(doc => {
        console.log(`  - ${doc.name} (${doc.slug})`)
      })
    } catch (err) {
      console.log(`✗ Error listing categories: ${err.message}`)
    }

    // Try creating a test category
    console.log('\n✍️ Attempting to create test category...')
    try {
      const testcat = await databases.createDocument(dbId, catColl, 'unique()', {
        name: 'Test Category',
        slug: 'test-category',
        display_order: 1,
        is_active: true,
        product_count: 0,
      })
      console.log(`✓ Created category: ${testcat.$id}`)
    } catch (err) {
      console.log(`✗ Error creating category:`)
      console.log(`  Message: ${err.message}`)
      console.log(`  Code: ${err.code}`)
      if (err.response) {
        console.log(`  Response: ${JSON.stringify(err.response)}`)
      }
    }

    // Try listing products
    const prodColl = env.APPWRITE_PRODUCTS_COLLECTION_ID || 'products'
    try {
      const prods = await databases.listDocuments(dbId, prodColl)
      console.log(`✓ Products collection has ${prods.documents.length} documents`)
    } catch (err) {
      console.log(`✗ Error listing products: ${err.message}`)
    }

  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()
