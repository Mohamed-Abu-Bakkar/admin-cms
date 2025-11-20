# API Endpoints Documentation

Base URL: `http://localhost:3000/api` (development)

## Public Endpoints (No Authentication Required)

These endpoints can be accessed from your user-facing website:

### Products

- **GET** `/api/products` - Get all products
  - Query params: `?search=keyword`
  - Returns: List of all products

- **GET** `/api/products/[id]` - Get single product
  - Returns: Product details

### Testimonials

- **GET** `/api/testimonials` - Get testimonials
  - Query params: `?status=approved` (default) or `?status=all`
  - Returns: List of testimonials (approved by default)

- **GET** `/api/testimonials/[id]` - Get single testimonial
  - Returns: Testimonial details

### Newsletter

- **POST** `/api/newsletter` - Subscribe to newsletter
  - Body: `{ email: "user@example.com" }`
  - Returns: Subscription confirmation

## Protected Endpoints (Authentication Required)

These endpoints require authentication cookie (admin only):

### Products (Write Operations)

- **POST** `/api/products` - Create new product
  - Body: `{ name, category, price, stock, description, status, image? }`

- **PUT** `/api/products/[id]` - Update product
  - Body: Product fields to update

- **DELETE** `/api/products/[id]` - Delete product

### Users (All Operations Protected)

- **GET** `/api/users` - Get all users (admin only)
  - Query params: `?search=keyword`

- **GET** `/api/users/[id]` - Get single user (admin only)

- **POST** `/api/users` - Create new user (admin only)
  - Body: `{ name, email, password, phone?, role, status }`

- **PUT** `/api/users/[id]` - Update user (admin only)
  - Body: User fields to update

- **DELETE** `/api/users/[id]` - Delete user (admin only)

### Testimonials (Write Operations)

- **POST** `/api/testimonials` - Create testimonial (admin only)
  - Body: `{ name, content, rating, status }`

- **PUT** `/api/testimonials/[id]` - Update testimonial (admin only)

- **DELETE** `/api/testimonials/[id]` - Delete testimonial (admin only)

### Newsletter (Admin Operations)

- **GET** `/api/newsletter` - Get all subscribers (admin only)
  - Query params: `?search=email`

- **GET** `/api/newsletter/[id]` - Get single subscriber (admin only)

- **PUT** `/api/newsletter/[id]` - Update subscriber (admin only)

- **DELETE** `/api/newsletter/[id]` - Delete subscriber (admin only)

### Stats

- **GET** `/api/stats` - Get dashboard statistics (admin only)
  - Returns: `{ totalProducts, totalUsers, totalTestimonials, totalSubscribers }`

## Authentication

- **POST** `/api/auth/login` - Admin login
  - Body: `{ email, password }`
  - Sets HTTP-only cookie with auth token

- **POST** `/api/auth/logout` - Admin logout
  - Clears auth cookie

## CORS Configuration

For your user site to access these APIs, you may need to configure CORS in `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "http://localhost:5173" }, // Your user site URL
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};
```

## Example Usage from User Site

```javascript
// Fetch products
const response = await fetch('http://localhost:3000/api/products');
const { success, data } = await response.json();

// Subscribe to newsletter
const response = await fetch('http://localhost:3000/api/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});

// Get approved testimonials
const response = await fetch('http://localhost:3000/api/testimonials?status=approved');
const { success, data } = await response.json();
```
