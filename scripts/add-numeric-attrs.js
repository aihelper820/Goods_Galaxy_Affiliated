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

(async () => {
  const dbId = env.APPWRITE_DATABASE_ID || 'affiliate_db'
  
  console.log('Creating rating attribute...')
  let res = await makeReq('POST', `/v1/databases/${dbId}/collections/products/attributes/double`, { key: 'rating', required: false })
  console.log(`  ${res.data.key}: ${res.data.status}`)
  
  console.log('Creating review_count attribute...')
  res = await makeReq('POST', `/v1/databases/${dbId}/collections/products/attributes/integer`, { key: 'review_count', required: false })
  console.log(`  ${res.data.key}: ${res.data.status}`)
})()
