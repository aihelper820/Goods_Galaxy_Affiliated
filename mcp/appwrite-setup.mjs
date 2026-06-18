#!/usr/bin/env node
/**
 * Appwrite Backend Setup Script
 * Automates creation of database, collections, storage, and seed data
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { Client, Databases, Users, Storage } from 'node-appwrite'

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

function updateEnv(updates) {
  let content = fs.readFileSync(envPath, 'utf-8')
  Object.entries(updates).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm')
    if (content.match(regex)) {
      content = content.replace(regex, `${key}=${value}`)
    } else {
      content += `\n${key}=${value}`
    }
  })
  fs.writeFileSync(envPath, content, 'utf-8')
}

function initClient(env) {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY)
  return client
}

async function createCollectionWithAttributes(databases, dbId, collectionId, name, attributes) {
  try {
    await databases.createCollection(dbId, collectionId, name)
  } catch (err) {
    if (!err.message.includes('already exists')) throw err
  }

  for (const attr of attributes) {
    try {
      if (attr.type === 'double') {
        await databases.createFloatAttribute(dbId, collectionId, attr.name, attr.required, attr.min || null, attr.max || null, attr.default || null, attr.array || false)
      } else if (attr.type === 'integer') {
        await databases.createIntegerAttribute(dbId, collectionId, attr.name, attr.required, attr.min || null, attr.max || null, attr.default || null, attr.array || false)
      } else if (attr.type === 'boolean') {
        await databases.createBooleanAttribute(dbId, collectionId, attr.name, attr.required, attr.default || false, attr.array || false)
      } else {
        await databases.createStringAttribute(dbId, collectionId, attr.name, attr.size, attr.required, attr.default || null, attr.array || false, attr.encrypt || false)
      }
    } catch {
      // Attribute might exist
    }
  }
}

async function createIndexes(databases, dbId, collectionId, indexes) {
  for (const [indexId, type, attrs] of indexes) {
    try {
      await databases.createIndex(dbId, collectionId, indexId, type, attrs)
    } catch {
      // Index might exist
    }
  }
}

async function setup() {
  console.log('\n' + '='.repeat(60))
  console.log('🚀 APPWRITE BACKEND SETUP')
  console.log('='.repeat(60))

  try {
    console.log('\n📂 Loading environment...')
    const env = loadEnv()
    console.log('✅ Environment loaded')

    console.log('\n🔗 Connecting to Appwrite...')
    const client = initClient(env)
    const databases = new Databases(client)
    const users = new Users(client)
    const storage = new Storage(client)
    console.log(`✅ Connected`)

    // Setup Database
    console.log('\n📦 Creating database...')
    let dbId = env.APPWRITE_DATABASE_ID || 'affiliate_db'
    if (!env.APPWRITE_DATABASE_ID) {
      try {
        const db = await databases.create('affiliate_db', 'Affiliate Database')
        dbId = db.$id
      } catch (err) {
        if (err.message.includes('already exists')) {
          dbId = 'affiliate_db'
        }
      }
    }
    console.log(`✅ Database ready: ${dbId}`)

    // Products Collection
    console.log('\n📚 Creating products collection...')
    await createCollectionWithAttributes(databases, dbId, 'products', 'Products', [
      { name: 'title', type: 'string', size: 255, required: true },
      { name: 'slug', type: 'string', size: 255, required: true },
      { name: 'description', type: 'string', size: 5000, required: false },
      { name: 'short_desc', type: 'string', size: 500, required: false },
      { name: 'price', type: 'string', size: 50, required: false },
      { name: 'original_price', type: 'string', size: 50, required: false },
      { name: 'image_url', type: 'string', size: 1000, required: false },
      { name: 'images', type: 'string', size: 5000, required: false },
      { name: 'amazon_url', type: 'string', size: 2000, required: true },
      { name: 'affiliate_url', type: 'string', size: 2000, required: false },
      { name: 'category_id', type: 'string', size: 50, required: false },
      { name: 'rating', type: 'double', required: false },
      { name: 'review_count', type: 'integer', required: false },
      { name: 'is_published', type: 'boolean', required: true, default: false },
      { name: 'is_featured', type: 'boolean', required: true, default: false },
    ])
    await createIndexes(databases, dbId, 'products', [
      ['slug_index', 'unique', ['slug']],
      ['category_index', 'key', ['category_id']],
      ['published_index', 'key', ['is_published']],
      ['featured_index', 'key', ['is_featured']],
    ])
    console.log(`✅ Products collection created`)

    // Categories Collection
    console.log('\n🏷️  Creating categories collection...')
    await createCollectionWithAttributes(databases, dbId, 'categories', 'Categories', [
      { name: 'name', type: 'string', size: 100, required: true },
      { name: 'slug', type: 'string', size: 100, required: true },
      { name: 'description', type: 'string', size: 500, required: false },
      { name: 'display_order', type: 'integer', required: true, default: 0 },
      { name: 'is_active', type: 'boolean', required: true, default: true },
      { name: 'product_count', type: 'integer', required: true, default: 0 },
    ])
    await createIndexes(databases, dbId, 'categories', [
      ['slug_index', 'unique', ['slug']],
      ['order_index', 'key', ['display_order']],
      ['active_index', 'key', ['is_active']],
    ])
    console.log(`✅ Categories collection created`)

    // Settings Collection
    console.log('\n⚙️  Creating settings collection...')
    await createCollectionWithAttributes(databases, dbId, 'settings', 'Settings', [
      { name: 'key', type: 'string', size: 100, required: true },
      { name: 'value', type: 'string', size: 5000, required: false },
      { name: 'description', type: 'string', size: 255, required: false },
    ])
    await createIndexes(databases, dbId, 'settings', [
      ['key_index', 'unique', ['key']],
    ])
    console.log(`✅ Settings collection created`)

    // Storage Bucket
    console.log('\n📸 Creating storage bucket...')
    let bucketId = env.APPWRITE_BUCKET_ID || 'product_images'
    if (!env.APPWRITE_BUCKET_ID) {
      try {
        const bucket = await storage.createBucket('product_images', 'Product Images')
        bucketId = bucket.$id
      } catch (err) {
        if (!err.message.includes('already exists')) throw err
        bucketId = 'product_images'
      }
    }
    console.log(`✅ Storage bucket ready: ${bucketId}`)

    // Seed Categories
    console.log('\n🌱 Seeding default categories...')
    const categories = [
      { name: 'Electronics', slug: 'electronics', display_order: 1 },
      { name: 'Home & Kitchen', slug: 'home-kitchen', display_order: 2 },
      { name: 'Fitness', slug: 'fitness', display_order: 3 },
      { name: 'Books', slug: 'books', display_order: 4 },
      { name: 'Fashion', slug: 'fashion', display_order: 5 },
    ]
    for (const cat of categories) {
      try {
        await databases.createDocument(dbId, 'categories', 'unique()', {
          name: cat.name,
          slug: cat.slug,
          display_order: cat.display_order,
          is_active: true,
          product_count: 0,
        })
      } catch {
        // May already exist
      }
    }
    console.log(`✅ Categories seeded`)

    // Seed Settings
    console.log('\n⚙️  Seeding default settings...')
    const settings = [
      { key: 'site_name', value: 'The Curator' },
      { key: 'site_tagline', value: 'Curated for the Discerning Eye' },
      { key: 'affiliate_tag', value: '' },
      { key: 'hero_title', value: 'Curated for the Discerning Eye' },
      { key: 'hero_subtitle', value: 'Discover hand-picked products from Amazon' },
      { key: 'hero_image_1', value: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop' },
      { key: 'hero_image_2', value: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop' },
      { key: 'hero_image_3', value: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop' },
      { key: 'products_per_page', value: '12' },
    ]
    for (const set of settings) {
      try {
        await databases.createDocument(dbId, 'settings', 'unique()', {
          key: set.key,
          value: set.value,
        })
      } catch {
        // May already exist
      }
    }
    console.log(`✅ Settings seeded`)

    // Create Admin User
    console.log('\n👤 Creating admin user...')
    const adminEmail = env.ADMIN_EMAIL || 'admin@yourdomain.com'
    const adminPassword = env.ADMIN_PASSWORD || 'ChangeMe123!'
    try {
      await users.create('unique()', adminEmail, adminPassword, 'Admin User')
      console.log(`✅ Admin user created: ${adminEmail}`)
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`✅ Admin user exists: ${adminEmail}`)
      } else {
        console.error('⚠️  Error creating admin user:', err.message)
      }
    }

    // Update .env.local
    console.log('\n📝 Updating .env.local...')
    updateEnv({
      APPWRITE_DATABASE_ID: dbId,
      APPWRITE_PRODUCTS_COLLECTION_ID: 'products',
      APPWRITE_CATEGORIES_COLLECTION_ID: 'categories',
      APPWRITE_SETTINGS_COLLECTION_ID: 'settings',
      APPWRITE_BUCKET_ID: bucketId,
    })

    // Success
    console.log('\n' + '='.repeat(60))
    console.log('✅ APPWRITE SETUP COMPLETE')
    console.log('='.repeat(60))
    console.log('\n📊 Configuration Summary:')
    console.log(`   Database:   ${dbId}`)
    console.log(`   Products:   products`)
    console.log(`   Categories: categories`)
    console.log(`   Settings:   settings`)
    console.log(`   Storage:    ${bucketId}`)
    console.log(`   Admin:      ${adminEmail}`)
    console.log('\n📝 Next steps:')
    console.log('   1. Verify .env.local has been updated')
    console.log('   2. Run: npm run dev')
    console.log('\n' + '='.repeat(60) + '\n')
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

setup()
