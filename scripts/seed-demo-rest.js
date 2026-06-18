#!/usr/bin/env node
/**
 * Seed Demo Products & Categories via REST API
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

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

function makeRequest(method, pathname, body = null, env) {
  return new Promise((resolve, reject) => {
    const url = new URL(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    
    const options = {
      hostname: url.hostname,
      path: pathname,
      method: method,
      headers: {
        'X-Appwrite-Project': env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
        'X-Appwrite-Key': env.APPWRITE_API_KEY,
        'Content-Type': 'application/json',
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve({ status: res.statusCode, data: parsed })
        } catch {
          resolve({ status: res.statusCode, data: data })
        }
      })
    })

    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function seedDemo() {
  console.log('\n' + '='.repeat(60))
  console.log('🌱 SEEDING DEMO DATA')
  console.log('='.repeat(60))

  try {
    const env = loadEnv()
    const dbId = env.APPWRITE_DATABASE_ID || 'affiliate_db'
    const catsColl = env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories'
    const prodsColl = env.APPWRITE_PRODUCTS_COLLECTION_ID || 'products'

    // Demo categories
    const categories = [
      { name: 'Books', slug: 'books', description: 'Bestselling books and literature', display_order: 1 },
      { name: 'Electronics', slug: 'electronics', description: 'Tech gadgets and devices', display_order: 2 },
      { name: 'Fitness', slug: 'fitness', description: 'Fitness equipment and wellness', display_order: 3 },
    ]

    console.log('\n📂 Creating categories...')
    const categoryIds = {}
    for (const cat of categories) {
      const pathname = `/v1/databases/${dbId}/collections/${catsColl}/documents`
      const body = {
        documentId: 'unique()',
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          display_order: cat.display_order,
          is_active: true,
          product_count: 0,
        }
      }
      
      const res = await makeRequest('POST', pathname, body, env)
      if (res.status === 201 && res.data.$id) {
        categoryIds[cat.slug] = res.data.$id
        console.log(`✓ ${cat.name} (${res.data.$id})`)
      } else {
        console.log(`✗ ${cat.name}: ${res.data.message || res.status}`)
      }
    }

    // Demo products
    const products = [
      {
        title: 'The Midnight Library',
        slug: 'the-midnight-library',
        category_id: categoryIds.books,
        short_desc: 'A captivating novel about infinite possibilities',
        description: 'Nora Seed finds herself in the Midnight Library where she can explore infinite possibilities.',
        price: '16.99',
        original_price: '18.99',
        image_url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B08PDYP4QN',
        is_published: true,
        is_featured: true,
      },
      {
        title: 'Atomic Habits',
        slug: 'atomic-habits',
        category_id: categoryMap.books,
        short_desc: 'Transform your habits and your life',
        description: 'A proven framework for improving every day',
        price: '18.99',
        original_price: '20.99',
        image_url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B01N5IRQKH',
        is_published: true,
        is_featured: true,
      },
      {
        title: 'Sony WH-CH720N Wireless Headphones',
        slug: 'sony-wh-ch720n-headphones',
        category_id: categoryIds.electronics,
        short_desc: 'Noise-cancelling wireless headphones',
        description: 'Experience immersive sound with active noise cancellation.',
        price: '89.99',
        original_price: '129.99',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B0BFVXJZNM',
        is_published: true,
        is_featured: false,
      },
      {
        title: 'Anker 737 Power Bank',
        slug: 'anker-737-power-bank',
        category_id: categoryIds.electronics,
        short_desc: 'Fast-charging portable power bank 65W',
        description: 'With 65W charging capacity and 12000mAh.',
        price: '29.99',
        original_price: '39.99',
        image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B09WBHMM81',
        is_published: true,
        is_featured: false,
      },
      {
        title: 'Adjustable Dumbbell Set',
        slug: 'adjustable-dumbbell-set',
        category_id: categoryIds.fitness,
        short_desc: 'Space-saving adjustable dumbbells 5-25 lbs',
        description: 'One pair replaces 11 pairs for versatile training.',
        price: '59.99',
        original_price: '89.99',
        image_url: 'https://images.unsplash.com/photo-1517836357463-d25ddfcb3ef5?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B08DZTZ4ZZ',
        is_published: true,
        is_featured: true,
      },
      {
        title: 'Yoga Mat Premium Non-Slip',
        slug: 'yoga-mat-premium',
        category_id: categoryIds.fitness,
        short_desc: '6mm premium non-slip yoga mat',
        description: 'High-quality thick yoga mat with excellent grip.',
        price: '24.99',
        original_price: '34.99',
        image_url: 'https://images.unsplash.com/photo-1599622730453-aeb9754f7bfa?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B07RMXGYBH',
        is_published: true,
        is_featured: false,
      },
    ]

    console.log('\n📦 Creating products...')
    let createdCount = 0
    for (const prod of products) {
      if (!prod.category_id) {
        console.log(`⊘ ${prod.title} (missing category)`)
        continue
      }

      const pathname = `/v1/databases/${dbId}/collections/${prodsColl}/documents`
      const body = {
        documentId: 'unique()',
        data: {
          ...prod,
        }
      }

      const res = await makeRequest('POST', pathname, body, env)
      if (res.status === 201 && res.data.$id) {
        createdCount++
        console.log(`✓ ${prod.title}`)
      } else {
        console.log(`✗ ${prod.title}: ${res.data.message || res.status}`)
      }
    }

    console.log(`\n✅ Seeded ${Object.keys(categoryIds).length} categories and ${createdCount}/${products.length} products`)
    console.log('='.repeat(60) + '\n')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

seedDemo()
