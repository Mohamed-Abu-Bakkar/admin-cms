# Sidebar Layout Guide

## Overview

A complete Next.js admin dashboard layout with sidebar navigation has been created, featuring:

✅ **Responsive Sidebar** - Collapsible on mobile, sticky on desktop
✅ **Top Navbar** - With user profile and menu toggle
✅ **Navigation Links** - Active state highlighting
✅ **Logout Integration** - Seamless authentication flow
✅ **dark Mode Support** - Full theming support
✅ **Icon Library** - Using Lucide React icons

## Components Created

### Layout Components

1. **`components/AppLayout.tsx`** - Main layout wrapper
2. **`components/Sidebar.tsx`** - Navigation sidebar with menu items
3. **`components/Navbar.tsx`** - Top navigation bar
4. **`components/NavLink.tsx`** - Active link component for Next.js

### UI Components

5. **`components/ui/button.tsx`** - Reusable button component with variants
6. **`lib/utils.ts`** - Utility functions (cn helper)

### Pages

7. **`app/page.tsx`** - Dashboard home page with stats
8. **`app/products/page.tsx`** - Products page
9. **`app/users/page.tsx`** - Users page
10. **`app/settings/page.tsx`** - Settings page

## Menu Items

The sidebar includes the following navigation items:

- 🏠 **Dashboard** - `/` - Overview and stats
- 📦 **Products** - `/products` - Product catalog
- 👥 **Users** - `/users` - User management
- 💬 **Testimonials** - `/testimonials` - Customer testimonials
- 📧 **Newsletter** - `/newsletter` - Newsletter subscribers
- 📁 **Categories** - `/categories` - Category management
- ⚙️ **Settings** - `/settings` - App settings
- 🚪 **Logout** - Authentication logout

## Usage

### Wrap Pages with AppLayout

```tsx
import { AppLayout } from "@/components/AppLayout";

export default function YourPage() {
  return (
    <AppLayout>
      <div>
        {/* Your page content */}
      </div>
    </AppLayout>
  );
}
```

### Features

#### Mobile Responsiveness
- Sidebar hidden on mobile by default
- Hamburger menu in navbar toggles sidebar
- Overlay backdrop when sidebar is open
- Swipe to close on mobile

#### Desktop Behavior
- Sidebar always visible and sticky
- No overlay needed
- Smooth transitions

#### Active Link Highlighting
The `NavLink` component automatically highlights the active route:
- Black background with gray text for active links
- Hover effects for inactive links
- Supports exact matching with `end` prop

## Customization

### Change Menu Items

Edit `components/Sidebar.tsx`:

```tsx
const menuItems = [
  { icon: YourIcon, label: "Your Page", path: "/your-path" },
  // ... add more items
];
```

### Change Colors

The components use Tailwind classes. Modify colors in:
- `components/Sidebar.tsx` - Sidebar styling
- `components/Navbar.tsx` - Navbar styling
- `components/ui/button.tsx` - Button variants

### Add More Pages

Create new pages following this pattern:

```tsx
// app/your-page/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";

export default async function YourPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Your Page Title
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Description
          </p>
        </div>

        {/* Your content */}
      </div>
    </AppLayout>
  );
}
```

## Dependencies Installed

```json
{
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0",
  "class-variance-authority": "^0.7.1",
  "@radix-ui/react-slot": "^1.2.4",
  "lucide-react": "^0.554.0"
}
```

## Run the Application

```bash
cd admin-cms
pnpm dev
```

Visit `http://localhost:3000` and log in with:
- Email: `admin@example.com`
- Password: `admin123`

## Next Steps

1. **Add Remaining Pages** - Create testimonials, newsletter, and categories pages
2. **Add Data Tables** - Implement tables for product/user listings
3. **Add Forms** - Create/edit forms for entities
4. **Add Search** - Global search in navbar
5. **Add Notifications** - Toast notifications for actions
6. **Add Filters** - Filter and sort functionality
7. **Add Pagination** - For large datasets

## Design System

The layout follows a consistent design pattern:

- **Spacing**: Consistent padding and margins
- **Colors**: Zinc color palette for neutral UI
- **Typography**: Clear hierarchy with font sizes
- **Shadows**: Subtle shadows for depth
- **Borders**: Light borders for separation
- **Rounded Corners**: Consistent border radius

All components support dark mode out of the box!
