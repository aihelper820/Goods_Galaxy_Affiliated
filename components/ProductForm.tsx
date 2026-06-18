'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { createProductAction, updateProductAction, fetchCategoriesAction } from '@/app/admin/(protected)/admin-actions';
import { ProductFormData, Category } from '@/lib/types';
import { ChevronLeft, Star, Trash2, Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface ProductFormProps {
  productId?: string;
  initialData?: {
    title: string;
    slug: string;
    description: string;
    short_desc: string;
    price: string;
    original_price: string;
    image_url: string;
    images: string;
    amazon_url: string;
    category_id: string;
    rating: string;
    review_count: string;
    is_published: boolean;
    is_featured: boolean;
  };
}

export function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Parse initial images: primary is image_url, additional from images JSON string
  const getInitialImageList = (): string[] => {
    const list: string[] = [];
    if (initialData?.image_url?.trim()) {
      list.push(initialData.image_url.trim());
    }
    if (initialData?.images) {
      try {
        const parsed = JSON.parse(initialData.images);
        if (Array.isArray(parsed)) {
          parsed.forEach((url: string) => {
            const trimmed = url.trim();
            if (trimmed && !list.includes(trimmed)) {
              list.push(trimmed);
            }
          });
        }
      } catch {
        // ignore parse errors
      }
    }
    return list;
  };

  const [imageList, setImageList] = useState<string[]>(getInitialImageList);

  const [formData, setFormData] = useState<ProductFormData>(
    initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description,
          short_desc: initialData.short_desc,
          price: initialData.price,
          original_price: initialData.original_price,
          image_url: initialData.image_url,
          images: initialData.images || '',
          amazon_url: initialData.amazon_url,
          category_id: initialData.category_id,
          rating: initialData.rating ? parseFloat(initialData.rating) : 0,
          review_count: initialData.review_count ? parseInt(initialData.review_count, 10) : 0,
          is_published: initialData.is_published,
          is_featured: initialData.is_featured,
        }
      : {
          title: '',
          slug: '',
          description: '',
          short_desc: '',
          price: '',
          original_price: '',
          image_url: '',
          images: '',
          amazon_url: '',
          category_id: '',
          rating: 0,
          review_count: 0,
          is_published: false,
          is_featured: false,
        }
  );

  // Sync imageList changes back to formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      image_url: imageList[0] || '',
      images: imageList.length > 0 ? JSON.stringify(imageList) : '',
    }));
  }, [imageList]);

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategoriesAction();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      const nextData = { ...prev } as ProductFormData & { slug?: string };

      if (type === 'checkbox') {
        nextData[name as 'is_published' | 'is_featured'] = (e.target as HTMLInputElement).checked as never;
      } else if (name === 'rating') {
        nextData.rating = (parseFloat(value) || 0) as never;
      } else if (name === 'review_count') {
        nextData.review_count = (parseInt(value, 10) || 0) as never;
      } else if (name !== 'image_url' && name !== 'images') {
        nextData[name as keyof ProductFormData] = value as never;
      }

      // Auto-generate slug from title if title changes and slug wasn't manually edited
      if (name === 'title' && (!prev.slug || prev.slug === '')) {
        const newSlug = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        nextData.slug = newSlug;
      }

      return nextData;
    });
  };

  const addImageUrl = () => {
    const url = manualUrl.trim();
    if (!url) {
      toast.error('Please enter a valid image URL');
      return;
    }
    if (imageList.includes(url)) {
      toast.error('This image is already in the list');
      return;
    }
    setImageList((prev) => [...prev, url]);
    setManualUrl('');
    toast.success('Image added');
  };

  const handleManualUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImageUrl();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        const uploadedUrl = result.data.imageUrl;
        setImageList((prev) => [...prev, uploadedUrl]);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImageList((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.unshift(moved);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Ensure formData is up to date with imageList before submitting
    const submitData = {
      ...formData,
      image_url: imageList[0] || '',
      images: imageList.length > 0 ? JSON.stringify(imageList) : '',
    };

    try {
      const result = productId
        ? await updateProductAction(productId, submitData)
        : await createProductAction(submitData);

      if (result.success) {
        toast.success(
          productId ? 'Product updated successfully' : 'Product created successfully'
        );
        router.push('/admin/products');
      } else {
        toast.error(result.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="panel flex items-center gap-4 p-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ChevronLeft size={18} />
          </Button>
        </Link>
        <div>
          <div className="section-kicker mb-3">Product editor</div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-on-surface">
            {productId ? 'Edit Product' : 'New Product'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-on-surface-muted">
            {productId ? 'Update product details' : 'Add a new product to your catalog'}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Input
              label="Product Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter product title"
              required
            />
            <div>
              <Input
                label="URL Slug (auto-generated from title)"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="auto-generated"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from title. Edit if needed.</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed product description"
              rows={5}
              className="w-full rounded-2xl border border-outline/70 bg-surface-elevated px-3 py-2.5 text-on-surface placeholder:text-on-surface-muted focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>

          {/* Short Description */}
          <Input
            label="Short Description"
            name="short_desc"
            value={formData.short_desc}
            onChange={handleChange}
            placeholder="Brief product summary"
          />

          {/* Price and Original Price */}
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Price (USD) *"
              name="price"
              type="number"
              step="0.01"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="99.99"
              required
            />
            <Input
              label="Original Price (USD)"
              name="original_price"
              type="number"
              step="0.01"
              value={formData.original_price || ''}
              onChange={handleChange}
              placeholder="Original price"
            />
          </div>

          {/* ── Multiple Image Section ── */}
          <div className="space-y-4">
            <div>
              <label className="mb-3 block text-sm font-medium text-on-surface">
                Product Images
              </label>

              {/* Image Previews Grid */}
              {imageList.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                  {imageList.map((url, index) => (
                    <div
                      key={`img-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-outline/15 bg-surface-container-low"
                    >
                      <Image
                        src={url}
                        alt={`Product image ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover"
                      />

                      {/* Primary badge */}
                      {index === 0 && (
                        <div className="absolute top-1.5 left-1.5 rounded-full bg-yellow-400/90 px-2 py-0.5 text-[10px] font-bold text-yellow-900 shadow-sm backdrop-blur-sm flex items-center gap-1">
                          <Star size={10} fill="currentColor" />
                          Primary
                        </div>
                      )}

                      {/* Hover overlay with actions */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-on-surface shadow-sm hover:bg-white transition-colors"
                            title="Set as primary image"
                            aria-label={`Set image ${index + 1} as primary`}
                          >
                            <Star size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-red-600 shadow-sm hover:bg-white transition-colors"
                          title="Remove image"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-4 flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-outline/30 bg-surface-container-low text-sm text-on-surface-muted">
                  No images added yet. Upload or add a URL below.
                </div>
              )}

              {/* Upload + Manual URL row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* File upload button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isUploadingImage}
                    onClick={(e) => {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }}
                    className="w-full sm:w-auto"
                  >
                    <Upload size={16} className="mr-1.5" />
                    {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>

                {/* Manual URL input */}
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    onKeyDown={handleManualUrlKeyDown}
                    placeholder="Paste image URL and press Enter or Add..."
                    className="flex-1 min-w-0 rounded-xl border border-outline/70 bg-surface-elevated px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-muted focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    onClick={addImageUrl}
                    className="shrink-0"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <p className="mt-2 text-xs text-on-surface-muted">
                The first image is the primary/cover. Drag or use the star button to reorder.
              </p>
            </div>
          </div>

          {/* Amazon URL */}
          <Input
            label="Amazon URL *"
            name="amazon_url"
            value={formData.amazon_url}
            onChange={handleChange}
            placeholder="https://amazon.com/dp/ASIN"
            required
          />

          {/* Category Select */}
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">
              Category *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              disabled={isLoadingCategories}
              className="w-full rounded-2xl border border-outline/70 bg-surface-elevated px-3 py-2.5 text-on-surface focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus disabled:bg-surface-container-low"
              required
            >
              <option value="">
                {isLoadingCategories ? 'Loading categories...' : 'Select a category'}
              </option>
              {categories.map((category) => (
                <option key={category.$id} value={category.$id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Checkboxes */}
          <div className="space-y-3 rounded-2xl border border-outline/15 bg-surface-container-low p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-on-surface">Publish this product</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-on-surface">Featured product</span>
            </label>
          </div>

          <div className="flex gap-3 border-t border-outline/15 pt-4">
            <Link href="/admin/products">
              <Button variant="ghost">Cancel</Button>
            </Link>
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {productId ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
