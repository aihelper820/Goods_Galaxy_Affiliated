import { NextRequest, NextResponse } from 'next/server';
import { extractAsin, validateAmazonUrl } from '@/lib/amazon';
import { Review } from '@/lib/types';

interface AmazonProductResponse {
  success: boolean;
  data?: {
    asin: string;
    title: string;
    price: number;
    image_url: string;
    rating: number;
    review_count: number;
    reviews?: string; // JSON stringified array of reviews
  };
  error?: string;
}

interface RainforestReview {
  reviewer?: { name?: string };
  rating?: number;
  title?: string;
  body?: string;
  review_date?: string;
}

interface RainforestApiPayload {
  product?: {
    title?: string;
    price?: { value?: string | number };
    main_image?: { link?: string };
    rating?: string | number;
    review_count?: number;
  };
  reviews?: RainforestReview[];
}

export async function POST(request: NextRequest): Promise<NextResponse<AmazonProductResponse>> {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL is required',
        },
        { status: 400 }
      );
    }

    // Validate Amazon URL
    if (!validateAmazonUrl(url)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Amazon URL',
        },
        { status: 400 }
      );
    }

    // Extract ASIN
    const asin = extractAsin(url);
    if (!asin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Could not extract ASIN from URL',
        },
        { status: 400 }
      );
    }

    // Fetch from RainforestAPI
    const rainforestApiKey = process.env.RAINFOREST_API_KEY;
    if (!rainforestApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Amazon API integration not configured',
        },
        { status: 500 }
      );
    }

    const rainforestUrl = `https://api.rainforestapi.com/request?api_key=${rainforestApiKey}&type=product&amazon_domain=amazon.com&asin=${asin}`;

    const response = await fetch(rainforestUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch product from Amazon',
        },
        { status: 500 }
      );
    }

    const data = (await response.json()) as RainforestApiPayload;

    // Extract product data
    const productData: NonNullable<AmazonProductResponse['data']> = {
      asin,
      title: data.product?.title || 'Unknown Product',
      price: Number(data.product?.price?.value ?? 0),
      image_url: data.product?.main_image?.link || '',
      rating: Number(data.product?.rating ?? 0),
      review_count: data.product?.review_count || 0,
    };

    // Fetch and parse reviews if available
    if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
      const reviews: Review[] = data.reviews.slice(0, 5).map((review) => ({
        author: review.reviewer?.name || 'Anonymous',
        rating: review.rating || 0,
        title: review.title || '',
        body: review.body || '',
        date: review.review_date || new Date().toLocaleDateString(),
      }));

      // Store reviews as JSON string
      productData.reviews = JSON.stringify(reviews);
    }

    return NextResponse.json(
      {
        success: true,
        data: productData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Amazon API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
