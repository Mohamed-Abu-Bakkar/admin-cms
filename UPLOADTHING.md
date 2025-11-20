# UploadThing Integration for Product Images

## Setup Complete ✅

UploadThing has been integrated into the admin CMS for handling product image uploads.

## Configuration

### Environment Variables
Added to `.env.local`:

### Files Created/Modified

1. **UploadThing Core Configuration** (`app/api/uploadthing/core.ts`)
   - Defines file upload rules: single image, max 4MB
   - Requires authentication (admin login)
   - Handles upload completion callbacks

2. **UploadThing API Route** (`app/api/uploadthing/route.ts`)
   - Next.js App Router endpoint for UploadThing
   - Handles GET and POST requests for file uploads

3. **UploadThing Client Helper** (`lib/uploadthing.ts`)
   - React hooks for client-side uploads
   - Type-safe integration with the file router

4. **ImageUpload Component** (`components/ImageUpload.tsx`)
   - Reusable upload component
   - Shows image preview
   - Upload progress indicator
   - Remove image functionality
   - Green-themed to match your design

5. **Updated Product Forms**
   - `app/products/add/page.tsx` - Add product with image upload
   - `app/products/[id]/edit/page.tsx` - Edit product with image upload

## Features

### Image Upload Component
- **File Selection**: Clean file input with green styling
- **Preview**: Shows uploaded image with 2:3 aspect ratio
- **Progress**: "Uploading..." indicator during upload
- **Remove**: Button to clear the uploaded image
- **Validation**: Accepts only image files, max 4MB

### Security
- **Authentication Required**: Only logged-in admins can upload
- **File Type Restrictions**: Only image files allowed
- **Size Limit**: Maximum 4MB per image
- **Automatic Tracking**: Records which user uploaded each image

## Usage

### For Admins
1. Go to Products → Add Product or edit an existing product
2. Find the "Product Image" card in the right column
3. Click "Choose File" and select an image (max 4MB)
4. The image uploads automatically and shows a preview
5. Click "Remove" to delete and choose a different image
6. Save the product to persist the image URL

### Image Storage
- Images are stored on UploadThing's CDN
- URLs are automatically generated and saved to the database
- Images persist even if the original file is deleted locally

## API Endpoint

**UploadThing API**: `/api/uploadthing`
- Handles file uploads securely
- Protected by authentication middleware
- Returns secure CDN URLs

## Product Model

The `Product` model already includes an `image` field:
```typescript
image?: string; // Optional URL to product image
```

## Next Steps (Optional Enhancements)

1. **Multiple Images**: Extend to support image galleries
2. **Image Optimization**: Add automatic resizing/compression
3. **Alt Text**: Add alt text field for accessibility
4. **Image Cropping**: Implement client-side cropping tool
5. **Category Images**: Use UploadThing for category images too

## Troubleshooting

### Upload Fails
- Check that user is logged in
- Verify file is under 4MB
- Ensure file is an image type (jpg, png, gif, webp)

### Image Not Showing
- Check browser console for CORS errors
- Verify the URL is saved to the database
- Ensure UploadThing secret is correct in `.env.local`

### Authentication Error
- Clear cookies and log in again
- Verify JWT_SECRET is set in environment variables

## Testing

1. **Login** as admin (admin@example.com / admin123)
2. **Create Product** with image upload
3. **Verify** image appears in product list
4. **Edit Product** and change image
5. **Check** public API returns image URL

---

*UploadThing integration completed on November 19, 2025*
