/**
 * Server-side Appwrite Client
 * Uses secret API key - NEVER import in client components
 * Only use in Server Components and API routes
 */

import { Client, Databases, Users, Storage } from 'node-appwrite'

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '')

export const databases = new Databases(client)
export const users = new Users(client)
export const storage = new Storage(client)

export default client
