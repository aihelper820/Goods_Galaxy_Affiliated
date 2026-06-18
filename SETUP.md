# Environment Setup Guide

## Initial Setup

### Step 1: Create Appwrite Cloud Account
1. Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up for a free account
3. Create a new project
4. Copy your **Project ID** and keep it safe

### Step 2: Create API Key
1. In Appwrite dashboard, go to **Settings** → **API Keys**
2. Create a new API key with permissions for:
   - `databases.*`
   - `collections.*`
   - `documents.*`
   - `users.*`
   - `files.*`
   - `buckets.*`
3. Copy the API key to your `.env.local`:
   ```
   APPWRITE_API_KEY=your_api_key_here
   ```

### Step 3: Initial Environment File
Create `.env.local` in project root:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key

# These will be auto-populated after setup:appwrite
APPWRITE_DATABASE_ID=
APPWRITE_PRODUCTS_COLLECTION_ID=
APPWRITE_CATEGORIES_COLLECTION_ID=
APPWRITE_SETTINGS_COLLECTION_ID=
APPWRITE_BUCKET_ID=

# Admin user (create via Appwrite dashboard)
ADMIN_EMAIL=admin@gga.com
ADMIN_PASSWORD=Password@123

# Optional
RAINFOREST_API_KEY=
NEXT_PUBLIC_SITE_URL=https://localhost:3000
```

### Step 4: Run Setup Script
```bash
npm run setup:appwrite
```

This creates:
- Database: `affiliate_db`
- Collections: `products`, `categories`, `settings`
- Storage bucket: `product_images`
- Default data seeding

### Step 5: Create Admin User
In Appwrite dashboard:
1. Go to **Auth** → **Users**
2. Create user with email: `admin@gga.com`
3. Set password: `Password@123` (or change in `.env.local`)

---

## Environment Variables Reference

### Required (Auto-populated by setup script)
- `NEXT_PUBLIC_APPWRITE_ENDPOINT` - Appwrite API endpoint
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Your Appwrite project ID
- `APPWRITE_API_KEY` - Secret API key for server operations
- `APPWRITE_DATABASE_ID` - Database ID
- `APPWRITE_PRODUCTS_COLLECTION_ID` - Products collection
- `APPWRITE_CATEGORIES_COLLECTION_ID` - Categories collection
- `APPWRITE_SETTINGS_COLLECTION_ID` - Settings collection
- `APPWRITE_BUCKET_ID` - Storage bucket for images

### Required (Manual Configuration)
- `ADMIN_EMAIL` - Admin login email
- `ADMIN_PASSWORD` - Admin login password

### Optional
- `NEXT_PUBLIC_SITE_URL` - Your site URL (for metadata, default: localhost:3000)
- `RAINFOREST_API_KEY` - For Amazon product API integration
- `AMAZON_AFFILIATE_TAG` - Amazon Associate tag for affiliate links

---

## Appwrite Database Setup (Manual Reference)

If `npm run setup:appwrite` fails, set up manually:

### Create Collections

#### `products`
Attributes:
- `title` (String, required)
- `slug` (String, required, unique)
- `description` (String)
- `short_desc` (String)
- `price` (Float, required)
- `original_price` (Float)
- `image_url` (String)
- `images` (String)
- `amazon_url` (String, required)
- `affiliate_url` (String)
- `category_id` (String)
- `rating` (Float, min: 0, max: 5)
- `review_count` (Integer)
- `is_published` (Boolean, default: false)
- `is_featured` (Boolean, default: false)

Indexes:
- `slug` (unique)
- `is_published`
- `is_featured`
- `category_id`

#### `categories`
Attributes:
- `name` (String, required)
- `slug` (String, required, unique)
- `description` (String)
- `display_order` (Integer, default: 0)
- `is_active` (Boolean, default: true)
- `product_count` (Integer, default: 0)

Indexes:
- `slug` (unique)
- `display_order`
- `is_active`

#### `settings`
Attributes:
- `key` (String, required, unique)
- `value` (String, required)
- `description` (String)

Indexes:
- `key` (unique)

### Create Storage Bucket

- **Name**: `product_images`
- **Max File Size**: 5MB
- **Allowed Extensions**: `jpg, jpeg, png, webp`

---

## Troubleshooting Setup

### Error: "Cannot connect to Appwrite"
- Check `NEXT_PUBLIC_APPWRITE_ENDPOINT` is correct
- Network access to cloud.appwrite.io?
- API key has correct permissions?

### Error: "Collection already exists"
- This is normal if re-running setup script
- Script handles existing collections gracefully

### Admin user not created
- Appwrite API has phone field validation
- Create manually via Appwrite Dashboard
- Or adjust MCP setup script

### Database ID not populated in .env.local
- Re-run: `npm run setup:appwrite`
- Check script output for errors
- Manually add IDs from Appwrite Dashboard

---

## Production Deployment

### Environment Variables on Vercel

1. Go to project **Settings** → **Environment Variables**
2. Add all variables from `.env.local`
3. Set `NEXT_PUBLIC_SITE_URL` to your domain
4. Deploy

```bash
vercel env add NEXT_PUBLIC_APPWRITE_ENDPOINT
vercel env add NEXT_PUBLIC_APPWRITE_PROJECT_ID
vercel env add APPWRITE_API_KEY
# ... add all others
```

### Security Checklist
- [ ] Change default admin password
- [ ] Update Appwrite API key
- [ ] Set strong `RAINFOREST_API_KEY`
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure CORS in Appwrite
- [ ] Set `NEXT_PUBLIC_SITE_URL` to actual domain
- [ ] Review Appwrite backup settings
- [ ] Enable 2FA on Appwrite account

---

## Development Tips

### Hot Reload
Changes to `.env.local` require server restart:
```bash
npm run dev
```

### Test Appwrite Connection
```bash
curl -X GET https://cloud.appwrite.io/v1/health \
  -H "X-Appwrite-Project: YOUR_PROJECT_ID"
```

### Check Database
Use Appwrite Dashboard to browse:
- Collections data
- User sessions
- Storage files
- Logs

### Reset Everything
```bash
# Delete Appwrite project and recreate
npm run setup:appwrite
```

---

**Setup completed! Next steps:**
1. Run `npm run dev`
2. Visit http://localhost:3000
3. Go to /admin/login with admin credentials
4. Start adding products!
