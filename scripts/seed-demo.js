#!/usr/bin/env node
/**
 * Seed Demo Products & Categories
 * Usage: node scripts/seed-demo.js
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

async function seedDemo() {
  console.log('\n' + '='.repeat(60))
  console.log('🌱 SEEDING DEMO PRODUCTS')
  console.log('='.repeat(60))

  try {
    const env = loadEnv()
    const client = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(env.APPWRITE_API_KEY)
    
    const databases = new Databases(client)
    const DATABASE_ID = env.APPWRITE_DATABASE_ID || 'affiliate_db'
    const PRODUCTS_COLLECTION = env.APPWRITE_PRODUCTS_COLLECTION_ID || 'products'
    const CATEGORIES_COLLECTION = env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories'

    // Get or create categories
    console.log('\n📂 Fetching categories...')
    const categoryMap = {}
    const categoryDefs = [
      { name: 'Books', slug: 'books', display_order: 1 },
      { name: 'Electronics', slug: 'electronics', display_order: 2 },
      { name: 'Home & Kitchen', slug: 'home-kitchen', display_order: 3 },
      { name: 'Fitness', slug: 'fitness', display_order: 4 },
      { name: 'Fashion', slug: 'fashion', display_order: 5 },
    ]
    
    try {
      const response = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION)
      response.documents.forEach(doc => {
        categoryMap[doc.slug] = doc.$id
      })
      console.log(`✓ Found ${response.documents.length} existing categories`)
    } catch (err) {
      console.log(`Error fetching categories: ${err.message}`)
    }

    // Create missing categories
    for (const catDef of categoryDefs) {
      if (!categoryMap[catDef.slug]) {
        try {
          const newCat = await databases.createDocument(
            DATABASE_ID, 
            CATEGORIES_COLLECTION, 
            'unique()',
            {
              name: catDef.name,
              slug: catDef.slug,
              display_order: catDef.display_order,
              is_active: true,
              product_count: 0,
            }
          )
          categoryMap[catDef.slug] = newCat.$id
          console.log(`✓ Created category: ${catDef.name}`)
        } catch (err) {
          console.log(`✗ Failed to create ${catDef.name}: ${err.message?.substring(0, 50)}`)
        }
      }
    }

    // Demo products
    const demoProducts = [
      {
        title: 'The Midnight Library',
        slug: 'the-midnight-library',
        category_id: categoryMap.books,
        short_desc: 'A captivating novel about infinite possibilities',
        description: 'Nora Seed finds herself exploring infinite possibilities',
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
        category_id: categoryMap.electronics,
        short_desc: 'Noise-cancelling wireless headphones',
        description: 'Experience immersive sound with active noise cancellation',
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
        category_id: categoryMap.electronics,
        short_desc: 'Fast-charging portable power bank',
        description: 'With 65W charging capacity and 12000mAh',
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
        category_id: categoryMap.fitness,
        short_desc: 'Space-saving adjustable dumbbells 5-25 lbs',
        description: 'One pair replaces multiple pairs',
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
        category_id: categoryMap.fitness,
        short_desc: '6mm premium non-slip yoga mat',
        description: 'High-quality thick yoga mat with excellent grip',
        price: '24.99',
        original_price: '34.99',
        image_url: 'https://images.unsplash.com/photo-1599622730453-aeb9754f7bfa?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B07RMXGYBH',
        is_published: true,
        is_featured: false,
      },
    ]

    // Create products
    console.log('\n📦 Creating demo products...')
    let successCount = 0
    for (const product of demoProducts) {
      if (!product.category_id) {
        console.log(`⊘ Skipping ${product.title} - no category ID`)
        continue
      }
      try {
        await databases.createDocument(DATABASE_ID, PRODUCTS_COLLECTION, 'unique()', {
          ...product,
          rating: 4.5,
          review_count: 1000,
        })
        successCount++
        console.log(`✓ Created: ${product.title}`)
      } catch (err) {
        console.log(`✗ Failed: ${product.title} - ${err.message?.substring(0, 50)}`)
      }
    }

    console.log(`\n✅ Seeded ${successCount}/${demoProducts.length} products`)
    console.log('='.repeat(60) + '\n')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

seedDemo()
