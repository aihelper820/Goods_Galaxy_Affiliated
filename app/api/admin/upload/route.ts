import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { updateSetting } from '@/lib/settings';

// Configure Cloudinary (server-side only — never expose API_SECRET to client)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const key = String(formData.get('key') || '');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to base64 data URI for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'gga_products',
    });

    const { secure_url, public_id } = uploadResult;

    // If a settings key was provided, update the setting with the Cloudinary URL
    let settingResult = null;
    if (key) {
      settingResult = await updateSetting(key, secure_url);
      if (!settingResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: settingResult.error || 'Upload succeeded but setting update failed',
            data: { imageUrl: secure_url, publicId: public_id },
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: secure_url,
        publicId: public_id,
        settingUpdated: Boolean(key),
      },
    });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    );
  }
}
