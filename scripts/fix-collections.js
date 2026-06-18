#!/usr/bin/env node
/**
 * Fix Collections - Create missing attributes using REST API
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

function makeRequest(method, path, body = null, env) {
  return new Promise((resolve, reject) => {
    const url = new URL(env.NEXT_PUBLIC_APPWRITE_ENDPOINT + path)
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
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
          resolve(JSON.parse(data))
        } catch {
          resolve(data)
        }
      })
    })

    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function createAttribute(env, dbId, collId, attrDef) {
  const path = `/v1/databases/${dbId}/collections/${collId}/attributes/${attrDef.type}`
  
  const body = {
    key: attrDef.name,
    required: attrDef.required || false,
    ...((attrDef.type === 'string' || attrDef.type === 'email' || attrDef.type === 'url') && { size: attrDef.size || 256 }),
    ...((attrDef.type !== 'string' && attrDef.type !== 'email' && attrDef.type !== 'url') && { default: attrDef.default }),
  }

  console.log(`  Creating ${attrDef.type} attribute: ${attrDef.name}`)
  try {
    const response = await makeRequest('POST', path, body, env)
    if (response.$id) {
      console.log(`    ✓ ${attrDef.name}`)
    } else if (response.message) {
      console.log(`    ✗ ${response.message}`)
    }
  } catch (err) {
    console.log(`    ✗ Error: ${err.message}`)
  }
}

async function main() {
  console.log('\n🔧 Fixing Collection Attributes\n')

  try {
    const env = loadEnv()
    const dbId = env.APPWRITE_DATABASE_ID || 'affiliate_db'

    // Categories attributes
    console.log('📂 Creating categories collection attributes:')
    const catAttrs = [
      { name: 'name', type: 'string', size: 100, required: true },
      { name: 'slug', type: 'string', size: 100, required: true },
      { name: 'description', type: 'string', size: 500, required: false },
      { name: 'display_order', type: 'integer', required: true, default: 0 },
      { name: 'is_active', type: 'boolean', required: true, default: true },
      { name: 'product_count', type: 'integer', required: true, default: 0 },
    ]
    for (const attr of catAttrs) {
      await createAttribute(env, dbId, 'categories', attr)
    }

    // Products attributes  
    console.log('\n📦 Creating products collection attributes:')
    const prodAttrs = [
      { name: 'title', type: 'string', size: 255, required: true },
      { name: 'slug', type: 'string', size: 255, required: true },
      { name: 'description', type: 'string', size: 5000, required: false },
      { name: 'short_desc', type: 'string', size: 500, required: false },
      { name: 'price', type: 'string', size: 50, required: false },
      { name: 'original_price', type: 'string', size: 50, required: false },
      { name: 'image_url', type: 'string', size: 1000, required: false },
      { name: 'amazon_url', type: 'string', size: 2000, required: true },
      { name: 'affiliate_url', type: 'string', size: 2000, required: false },
      { name: 'category_id', type: 'string', size: 50, required: false },
      { name: 'rating', type: 'double', required: false },
      { name: 'review_count', type: 'integer', required: false },
      { name: 'is_published', type: 'boolean', required: true, default: false },
      { name: 'is_featured', type: 'boolean', required: true, default: false },
    ]
    for (const attr of prodAttrs) {
      await createAttribute(env, dbId, 'products', attr)
    }

    console.log('\n✅ Done!\n')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()
