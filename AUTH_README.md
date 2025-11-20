# Admin CMS Authentication

This application now includes a complete authentication system with login, logout, and session management.

## Demo Credentials

Use these credentials to test the authentication:

### Admin User
- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Role:** admin

### Regular User
- **Email:** `user@example.com`
- **Password:** `user123`
- **Role:** user

## Features

✅ **Secure Login** - Form-based authentication with validation
✅ **Session Management** - HTTP-only cookies for security
✅ **Protected Routes** - Middleware-based route protection
✅ **Auto-redirect** - Redirects to login if not authenticated
✅ **Logout** - Secure session termination
✅ **User Context** - Access current user data throughout the app

## File Structure

```
admin-cms/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts       # Login API endpoint
│   │       ├── logout/route.ts      # Logout API endpoint
│   │       └── me/route.ts          # Get current user endpoint
│   ├── login/
│   │   └── page.tsx                 # Login page component
│   └── page.tsx                     # Protected home page
├── components/
│   └── LogoutButton.tsx             # Client-side logout button
├── lib/
│   ├── auth.ts                      # Server-side auth utilities
│   └── auth-client.ts               # Client-side auth utilities
└── middleware.ts                    # Route protection middleware
```

## How It Works

### 1. Login Flow
- User submits credentials on `/login`
- Client calls `/api/auth/login`
- Server verifies credentials
- Server sets HTTP-only cookie with auth token
- User is redirected to home page

### 2. Protected Routes
- Middleware checks for auth token on every request
- Unauthenticated users are redirected to `/login`
- Authenticated users cannot access `/login`

### 3. Logout Flow
- User clicks logout button
- Client calls `/api/auth/logout`
- Server clears the auth cookie
- User is redirected to login page

## Security Notes

⚠️ **This is a demo implementation**

For production, you should:

1. **Use a real database** - Replace the in-memory user array
2. **Hash passwords** - Use bcrypt or similar
3. **Use proper JWT** - Implement token signing and verification
4. **Add refresh tokens** - For better security
5. **Implement rate limiting** - Prevent brute force attacks
6. **Add CSRF protection** - Protect against cross-site attacks
7. **Use HTTPS** - In production environments
8. **Add email verification** - For user registration
9. **Implement password reset** - Via email
10. **Add 2FA** - For enhanced security

## Next Steps

1. Replace demo users with database integration
2. Implement proper password hashing (bcrypt)
3. Add user registration functionality
4. Implement password reset flow
5. Add role-based access control (RBAC)
6. Set up email notifications
7. Add audit logging
8. Implement OAuth providers (Google, GitHub)

## API Endpoints

### POST `/api/auth/login`
Login with email and password

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### POST `/api/auth/logout`
Logout and clear session

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET `/api/auth/me`
Get current authenticated user

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```
