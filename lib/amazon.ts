/**
 * Amazon Integration Module
 * URL parsing, validation, and affiliate URL building
 */

import { AmazonProductData } from './types'

/**
 * Validate if URL is a real Amazon URL
 */
export function validateAmazonUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname

    // Check if it's from amazon.com or regional Amazon domains
    return (
      hostname.includes('amazon.') ||
      hostname.includes('amazon-') ||
      hostname === 'amazon.com'
    )
  } catch {
    return false
  }
}

/**
 * Extract ASIN from Amazon URL
 * ASIN format: 10 alphanumeric characters starting with B
 */
export function extractAsin(url: string): string | null {
  try {
    // Common Amazon URL patterns:
    // https://amazon.com/dp/B0ABC123XYZ
    // https://amazon.com/gp/product/B0ABC123XYZ
    // https://amazon.com/s?k=product_name&dp=B0ABC123XYZ

    const patterns = [
      /\/dp\/([A-Z0-9]{10})/,
      /\/gp\/product\/([A-Z0-9]{10})/,
      /[?&]dp=([A-Z0-9]{10})/,
      /\/B[A-Z0-9]{9}/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1] || match[0].replace(/[^A-Z0-9]/g, '')
      }
    }

    // Try direct ASIN pattern
    const asinMatch = url.match(/B[A-Z0-9]{9}/)
    if (asinMatch) {
      return asinMatch[0]
    }

    return null
  } catch {
    return null
  }
}

/**
 * Build affiliate URL with Amazon Associate tag
 */
export function buildAffiliateUrl(
  amazonUrl: string,
  affiliateTag: string
): string {
  if (!affiliateTag) {
    return amazonUrl
  }

  try {
    const url = new URL(amazonUrl)

    // Remove old affiliate tag if exists
    url.searchParams.delete('tag')
    url.searchParams.delete('linkCode')
    url.searchParams.delete('linkId')

    // Add new affiliate tag
    url.searchParams.set('tag', affiliateTag)

    return url.toString()
  } catch {
    return amazonUrl
  }
}

/**
 * Fetch product data from Amazon via RainforestAPI
 * This function calls the server-side API endpoint: /api/amazon/fetch
 */
export async function fetchAmazonProduct(amazonUrl: string): Promise<AmazonProductData | null> {
  try {
    const response = await fetch('/api/amazon/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: amazonUrl }),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Unknown error')
    }

    return data.data as AmazonProductData
  } catch (error) {
    console.error('Error fetching Amazon product:', error)
    return null
  }
}
