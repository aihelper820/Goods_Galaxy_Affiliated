import { NextResponse } from 'next/server';
import { createProduct } from '@/lib/products';

/**
 * POST /api/demo/seed
 * Seed demo products to the database
 */
export async function POST() {
  try {
    console.log('[DEMO] Starting demo data seed...');

    // Use placeholder category IDs - these will be resolved by slug lookup in Appwrite
    // The actual category IDs don't matter if we're just storing the slug
    const categoryMap = {
      'books': 'books',
      'electronics': 'electronics',
      'home-kitchen': 'home-kitchen',
      'fitness': 'fitness',
      'fashion': 'fashion',
    };

    console.log('[DEMO] Categories to use:', Object.keys(categoryMap));

    // Create demo products for each category
    const demoProducts = [
      // Books
      {
        title: 'The Midnight Library',
        slug: 'the-midnight-library',
        category_id: categoryMap.books,
        short_desc: 'A captivating novel about infinite possibilities',
        description: 'Nora Seed finds herself in the Midnight Library where she can explore infinite possibilities of the lives she could have lived.',
        price: '16.99',
        original_price: '18.99',
        image_url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B08PDYP4QN',
        affiliate_url: 'https://amazon.com/dp/B08PDYP4QN?tag=gga-20',
        rating: 4.5,
        review_count: 8234,
        is_published: true,
        is_featured: true,
      },
      {
        title: 'Atomic Habits',
        slug: 'atomic-habits',
        category_id: categoryMap.books,
        short_desc: 'Transform your habits and your life',
        description: 'A proven framework for improving every day through small changes that drive remarkable results.',
        price: '18.99',
        original_price: '20.99',
        image_url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B01N5IRQKH',
        affiliate_url: 'https://amazon.com/dp/B01N5IRQKH?tag=gga-20',
        rating: 4.7,
        review_count: 15432,
        is_published: true,
        is_featured: true,
      },
      // Electronics
      {
        title: 'Sony WH-CH720N Wireless Headphones',
        slug: 'sony-wh-ch720n-headphones',
        category_id: categoryMap.electronics,
        short_desc: 'Noise-cancelling wireless headphones',
        description: 'Experience immersive sound with active noise cancellation and long battery life.',
        price: '89.99',
        original_price: '129.99',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B0BFVXJZNM',
        affiliate_url: 'https://amazon.com/dp/B0BFVXJZNM?tag=gga-20',
        rating: 4.4,
        review_count: 3421,
        is_published: true,
        is_featured: false,
      },
      {
        title: 'Anker 737 Power Bank',
        slug: 'anker-737-power-bank',
        category_id: categoryMap.electronics,
        short_desc: 'Fast-charging portable power bank',
        description: 'With 65W charging capacity and 12000mAh capacity. Compact and reliable.',
        price: '29.99',
        original_price: '39.99',
        image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B09WBHMM81',
        affiliate_url: 'https://amazon.com/dp/B09WBHMM81?tag=gga-20',
        rating: 4.6,
        review_count: 5234,
        is_published: true,
        is_featured: false,
      },
      // Fitness
      {
        title: 'Adjustable Dumbbell Set',
        slug: 'adjustable-dumbbell-set',
        category_id: categoryMap.fitness,
        short_desc: 'Space-saving adjustable dumbbells 5-25 lbs',
        description: 'One pair replaces 11 pairs of dumbbells. Quickly adjust for versatile training.',
        price: '59.99',
        original_price: '89.99',
        image_url: 'https://images.unsplash.com/photo-1517836357463-d25ddfcb3ef5?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B08DZTZ4ZZ',
        affiliate_url: 'https://amazon.com/dp/B08DZTZ4ZZ?tag=gga-20',
        rating: 4.6,
        review_count: 6789,
        is_published: true,
        is_featured: true,
      },
      {
        title: 'Yoga Mat Premium Non-Slip',
        slug: 'yoga-mat-premium',
        category_id: categoryMap.fitness,
        short_desc: '6mm premium non-slip yoga mat',
        description: 'High-quality thick yoga mat with excellent grip. Perfect for yoga and workouts.',
        price: '24.99',
        original_price: '34.99',
        image_url: 'https://images.unsplash.com/photo-1599622730453-aeb9754f7bfa?w=400&h=600&fit=crop',
        amazon_url: 'https://amazon.com/dp/B07RMXGYBH',
        affiliate_url: 'https://amazon.com/dp/B07RMXGYBH?tag=gga-20',
        rating: 4.5,
        review_count: 3456,
        is_published: true,
        is_featured: false,
      },
    ];

    let successCount = 0;
    const productErrors: string[] = [];
    
    for (const product of demoProducts) {
      // Skip products if we don't have the category ID
      if (!product.category_id) {
        console.log(`[DEMO] Skipping product ${product.title} - no category_id`);
        continue;
      }
      
      try {
        const result = await createProduct({
          title: product.title,
          slug: product.slug,
          category_id: product.category_id,
          short_desc: product.short_desc,
          description: product.description,
          price: product.price,
          original_price: product.original_price,
          image_url: product.image_url,
          amazon_url: product.amazon_url,
          affiliate_url: product.affiliate_url,
          rating: product.rating,
          review_count: product.review_count,
          is_published: product.is_published,
          is_featured: product.is_featured,
        });
        
        if (result.success) {
          successCount++;
          console.log(`[DEMO] Created product: ${product.title}`);
        } else {
          const errMsg = `[DEMO] Failed to create product ${product.title}: ${result.error}`;
          console.log(errMsg);
          productErrors.push(errMsg);
        }
      } catch (err) {
        const errMsg = `[DEMO] Exception creating product ${product.title}: ${err}`;
        console.error(errMsg);
        productErrors.push(errMsg);
      }
    }

    console.log(`[DEMO] ${successCount} products created`);

    return NextResponse.json(
      {
        success: true,
        message: `Demo data seeded: ${successCount} products created`,
        productCount: successCount,
        productErrors: productErrors.length > 0 ? productErrors : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[DEMO] Seeding error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to seed demo data' },
      { status: 500 }
    );
  }
}
