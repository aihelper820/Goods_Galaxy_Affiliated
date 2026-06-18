#!/usr/bin/env node
import * as fs from 'fs'
import https from 'https'

const env = (() => {
  const content = fs.readFileSync('.env.local', 'utf-8')
  const obj = {}
  content.split('\n').forEach(line => {
    const [k, v] = line.split('=').map(s => s.trim())
    if (k && !k.startsWith('#')) obj[k] = v
  })
  return obj
})()

function makeReq(method, pathname, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    const options = {
      hostname: url.hostname,
      path: pathname,
      method,
      headers: {
        'X-Appwrite-Project': env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
        'X-Appwrite-Key': env.APPWRITE_API_KEY,
        'Content-Type': 'application/json',
      },
    }
    const r = https.request(options, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) })
        } catch {
          resolve({ status: res.statusCode, data })
        }
      })
    })
    r.on('error', reject)
    if (body) r.write(JSON.stringify(body))
    r.end()
  })
}

async function createStringAttr(dbId, collId, key, size = 256) {
  const pathname = `/v1/databases/${dbId}/collections/${collId}/attributes/string`
  const body = { key, size, required: false }
  const res = await makeReq('POST', pathname, body)
  if (res.status === 201) {
    console.log(`✓ Created string attr: ${key}`)
  } else {
    console.log(`✗ ${key}: ${res.data.message || JSON.stringify(res.data).substring(0, 60)}`)
  }
}

async function createBoolAttr(dbId, collId, key, def = false) {
  const pathname = `/v1/databases/${dbId}/collections/${collId}/attributes/boolean`
  const body = { key, required: false, default: def }
  const res = await makeReq('POST', pathname, body)
  if (res.status === 201) {
    console.log(`✓ Created bool attr: ${key}`)
  } else {
    console.log(`✗ ${key}: ${res.data.message || 'error'}`)
  }
}

async function createIntAttr(dbId, collId, key, def = 0) {
  const pathname = `/v1/databases/${dbId}/collections/${collId}/attributes/integer`
  const body = { key, required: false, default: def }
  const res = await makeReq('POST', pathname, body)
  if (res.status === 201) {
    console.log(`✓ Created int attr: ${key}`)
  } else {
    console.log(`✗ ${key}: ${res.data.message || 'error'}`)
  }
}

(async () => {
  const dbId = env.APPWRITE_DATABASE_ID || 'affiliate_db'
  
  console.log('\n📂 Creating category attributes...')
  await createStringAttr(dbId, 'categories', 'name', 100)
  await createStringAttr(dbId, 'categories', 'slug', 100)
  await createStringAttr(dbId, 'categories', 'description', 500)
  await createIntAttr(dbId, 'categories', 'display_order', 0)
  await createBoolAttr(dbId, 'categories', 'is_active', true)
  await createIntAttr(dbId, 'categories', 'product_count', 0)
  
  console.log('\n📦 Creating product attributes...')
  await createStringAttr(dbId, 'products', 'title', 255)
  await createStringAttr(dbId, 'products', 'slug', 255)
  await createStringAttr(dbId, 'products', 'description', 5000)
  await createStringAttr(dbId, 'products', 'short_desc', 500)
  await createStringAttr(dbId, 'products', 'price', 50)
  await createStringAttr(dbId, 'products', 'original_price', 50)
  await createStringAttr(dbId, 'products', 'image_url', 1000)
  await createStringAttr(dbId, 'products', 'amazon_url', 2000)
  await createStringAttr(dbId, 'products', 'affiliate_url', 2000)
  await createStringAttr(dbId, 'products', 'category_id', 50)
  await createBoolAttr(dbId, 'products', 'is_published', false)
  await createBoolAttr(dbId, 'products', 'is_featured', false)
  
  console.log('\n✅ Done')
})()
