import * as fs from 'fs'
import https from 'https'

const env = (() => {
  const content = fs.readFileSync('.env.local', 'utf-8')
  const env = {}
  content.split('\n').forEach(line => {
    const [k, v] = line.split('=').map(s => s.trim())
    if (k && !k.startsWith('#')) env[k] = v
  })
  return env
})()

function req(method, pathname, body = null) {
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
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }))
    })
    r.on('error', reject)
    if (body) r.write(JSON.stringify(body))
    r.end()
  })
}

(async () => {
  const dbId = env.APPWRITE_DATABASE_ID || 'affiliate_db'
  const res = await req('GET', `/v1/databases/${dbId}/collections/categories`)
  console.log('Categories collection attributes:')
  if (res.data.attributes) {
    res.data.attributes.forEach(a => console.log(`  - ${a.key} (${a.type})`))
  } else {
    console.log('  None found')
  }
})()
