# Authentication System Documentation

## Overview
This authentication system has been refactored from a middleware-based approach to a **client-side wrapper approach** using Redux for state management. This allows for better control and doesn't rely on cookie-based authentication.

## Architecture

### 1. **Routes Configuration** (`src/app/config/routes.ts`)
Centralized configuration file that defines:
- **PUBLIC_ROUTES**: Routes accessible without authentication (e.g., `/admin-login`)
- **PROTECTED_ROUTES**: Routes that require authentication (e.g., `/dashboard`, `/Add-Product`, etc.)
- **Helper Functions**:
  - `isPublicRoute()`: Check if a path is public
  - `isProtectedRoute()`: Check if a path is protected
  - `getRedirectPath()`: Determine where to redirect based on auth status

### 2. **Authentication Helper** (`src/app/Helpers/authHelper.ts`)
Utility class (`AuthHelper`) for managing authentication state in localStorage:

**Key Methods:**
- `saveAuthState(user, token)`: Save user and token to localStorage
- `isAuthenticated()`: Check if currently authenticated
- `getUser()`: Retrieve logged-in user info
- `getToken()`: Get authentication token
- `clearAuthState()`: Clear all auth data on logout
- `setAuthFromResponse(response)`: Set auth from API response

**Storage Keys:**
- `isAuthenticated`: Boolean flag
- `adminUser`: User object (stored as JSON)
- `adminToken`: Authentication token

### 3. **Protected Route Wrapper** (`src/app/components/ProtectedRouteWrapper.tsx`)
Client-side React component that:
- Checks if user is authenticated (from Redux or localStorage)
- Redirects unauthenticated users trying to access protected routes to `/admin-login`
- Redirects authenticated users trying to access `/admin-login` to `/dashboard`
- Shows a loading state during initial authentication check

**How It Works:**
```
1. Component mounts
2. Checks localStorage for existing auth state
3. Sets loading state to true
4. On next effect, compares auth status with route
5. Redirects if necessary
6. Renders children when ready
```

### 4. **Redux Auth Slice** (`src/app/GlobalRedux/slice/AuthSlice.tsx`)
Updated Redux slice with authentication state management:

**New State Property:**
- `isAuthenticated: boolean` - Current authentication status

**Handled Actions:**
- `AdminLogin.fulfilled`: Sets `isAuthenticated = true`, saves user data, calls `AuthHelper.setAuthFromResponse()`
- `AdminLogin.rejected`: Sets `isAuthenticated = false`
- `Logout.fulfilled`: Sets `isAuthenticated = false`, clears user data, calls `AuthHelper.clearAuthState()`
- `Logout.rejected`: Keeps error message

### 5. **Layout Integration** (`src/app/layout.tsx`)
Root layout now wraps children with:
```tsx
<Providers>
  <ProtectedRouteWrapper>
    {children}
  </ProtectedRouteWrapper>
</Providers>
```

This ensures all routes are protected/routed appropriately.

### 6. **Simplified Middleware** (`src/middleware.ts`)
Middleware is now minimal (essentially a pass-through) because:
- Authentication is handled client-side
- No more cookie-based redirects
- Eliminates the need for server-side route protection

## Authentication Flow

### Login Flow
```
1. User enters email/password on /admin-login
2. Form submission calls AdminLogin thunk
3. API call to backend (auth/login)
4. Backend returns user data + token
5. AdminLogin.fulfilled handler:
   - Sets Redux state: isAuthenticated = true
   - Calls AuthHelper.setAuthFromResponse()
   - Saves user & token to localStorage
6. Navigate to /dashboard
```

### Logout Flow
```
1. User clicks logout in sidebar
2. logOut() function called:
   - Calls AuthHelper.clearAuthState() → clears localStorage
   - Clears token from localStorage & cookies
   - Dispatches Logout thunk
3. Logout.fulfilled handler:
   - Sets Redux state: isAuthenticated = false
   - Clears user data from Redux
4. Redirect to /admin-login
```

### Protected Route Access
```
1. Unauthenticated user tries to access /dashboard
2. ProtectedRouteWrapper checks:
   - localStorage.getItem('isAuthenticated') === 'true'
   - OR Redux state: auth.isAuthenticated
3. If not authenticated: redirect to /admin-login
4. If authenticated: allow access
```

## Files Modified/Created

### Created Files:
- ✅ `src/app/config/routes.ts` - Routes configuration
- ✅ `src/app/Helpers/authHelper.ts` - Auth utilities
- ✅ `src/app/components/ProtectedRouteWrapper.tsx` - Route protection wrapper

### Modified Files:
- ✅ `src/app/GlobalRedux/slice/AuthSlice.tsx` - Added isAuthenticated state & handlers
- ✅ `src/app/layout.tsx` - Added ProtectedRouteWrapper
- ✅ `src/app/admin-login/page.tsx` - Updated to use AuthHelper, redirect to /dashboard
- ✅ `src/app/components/Sidebar.tsx` - Updated logout to use AuthHelper & useRouter
- ✅ `src/middleware.ts` - Simplified to minimal pass-through

## Key Benefits

1. **No Cookie Dependency**: Works without relying on cookies
2. **Client-Side Control**: Better UX with instant redirects
3. **Redux Integration**: Auth state available everywhere via Redux
4. **localStorage Persistence**: Auth state persists across browser refreshes
5. **Clean Separation**: Routes, auth logic, and components clearly separated
6. **Easy to Test**: No complex middleware logic
7. **Protected Routes**: Simple declarative route protection

## Usage Examples

### Check if User is Authenticated
```typescript
import { useSelector } from 'react-redux';

const App = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  
  return isAuthenticated ? <Dashboard /> : <Login />;
};
```

### Get Current User Manually
```typescript
import AuthHelper from '@/app/Helpers/authHelper';

const user = AuthHelper.getUser();
console.log(user); // { id, email, name, role, token }
```

### Logout
```typescript
import { useDispatch } from 'react-redux';
import { Logout } from '@/app/GlobalRedux/slice/AuthSlice';
import AuthHelper from '@/app/Helpers/authHelper';

const logOut = async () => {
  AuthHelper.clearAuthState();
  await dispatch(Logout());
  router.push('/admin-login');
};
```

## LocalStorage Keys Reference

| Key | Type | Description |
|-----|------|-------------|
| `isAuthenticated` | string | 'true' or 'false' |
| `adminUser` | JSON string | User object: `{id, email, name, role, token}` |
| `adminToken` | string | JWT or auth token |

## Adding New Protected Routes

1. Add route to `PROTECTED_ROUTES` array in `src/app/config/routes.ts`
2. Create the route file (e.g., `src/app/my-route/page.tsx`)
3. Component will automatically be protected by ProtectedRouteWrapper

Example:
```typescript
// src/app/config/routes.ts
export const PROTECTED_ROUTES = [
  // ... existing routes
  '/my-new-route',  // ← Add this
];
```

## Adding New Public Routes

1. Add route to `PUBLIC_ROUTES` array in `src/app/config/routes.ts`
2. Users can access this route without authentication

## Troubleshooting

### Users Keep Getting Redirected to Login
- Check if `AdminLogin.fulfilled` is being called
- Verify `AuthHelper.setAuthFromResponse()` is saving to localStorage
- Check localStorage in DevTools → Application → Local Storage

### Auth State Not Persisting After Refresh
- Ensure `AuthHelper.saveAuthState()` is being called during login
- Check if browser allows localStorage
- Verify Redux state is being synced with localStorage

### Routes Not Protecting
- Verify route is in `PROTECTED_ROUTES` array
- Check if ProtectedRouteWrapper is wrapping children in layout
- Ensure no other redirect logic conflicts

## API Integration

Make sure your backend returns token in this format:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin",
    "token": "jwt_token_here"
  }
}
```

The `AdminLogin` thunk expects this structure to work properly.
