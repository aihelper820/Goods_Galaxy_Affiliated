/**
 * Settings Module
 * Site configuration management
 */

import 'server-only'
import { databases } from './appwrite-server'
import { Setting, ApiResponse } from './types'
import { Query } from 'node-appwrite'

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'affiliate_db'
const COLLECTION_ID = process.env.APPWRITE_SETTINGS_COLLECTION_ID || 'settings'

interface SettingDocument {
  $id: string
  key: string
  value?: string
}

/**
 * Get a single setting by key
 */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('key', key),
    ])

    if (response.documents.length === 0) return null

    return (response.documents[0] as unknown as SettingDocument).value || null
  } catch {
    return null
  }
}

/**
 * Get all settings as key-value object
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [])

    const settings: Record<string, string> = {}

    response.documents.forEach((doc) => {
      const settingDoc = doc as unknown as SettingDocument
      settings[settingDoc.key] = settingDoc.value || ''
    })

    return settings
  } catch {
    return {}
  }
}

/**
 * Update setting by key (admin only)
 */
export async function updateSetting(key: string, value: string): Promise<ApiResponse<Setting>> {
  try {
    // Find setting by key
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('key', key),
    ])

    let setting: SettingDocument

    if (response.documents.length === 0) {
      // Create if doesn't exist
      setting = (await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', {
        key,
        value,
      })) as unknown as SettingDocument
    } else {
      // Update existing
      const docId = response.documents[0].$id
      setting = (await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, {
        value,
      })) as unknown as SettingDocument
    }

    return {
      success: true,
      data: {
        $id: setting.$id,
        key: setting.key,
        value: setting.value,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update setting',
    }
  }
}
