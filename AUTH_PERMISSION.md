# Authentication and Permissions Documentation

## Table of Contents
- [Setup](#setup)
- [Authentication](#authentication)
- [User Data](#user-data)
- [Permissions](#permissions)
- [Examples](#examples)

## Setup

### 1. Install Dependencies
```bash
npm install @reduxjs/toolkit react-redux axios js-cookie
npm install -D @types/js-cookie
```

### 2. Environment Variables
Create a `.env` file in your project root:
```env
VITE_API_URL_AUTH=your_auth_api_url
VITE_API_URL=your_api_url
VITE_CLIENT_SECRET=your_client_secret
VITE_SCOPE=your_scope
```

## Authentication

### Login
Use the `login` action to authenticate users:

```typescript
import { useAppDispatch } from './redux/hooks';
import { login, fetchUserData } from './redux/slices/authSlice';

const dispatch = useAppDispatch();

// Login and fetch user data
try {
  await dispatch(login({
    username: "user@example.com",
    password: "password123"
  })).unwrap();
  await dispatch(fetchUserData()).unwrap();
} catch (error) {
  console.error('Login failed:', error);
}
```

### Logout
```typescript
import { logout } from './redux/slices/authSlice';

dispatch(logout());
```

### Check Authentication Status
```typescript
import { useAppSelector } from './redux/hooks';

const { isAuthenticated, loading, error } = useAppSelector(state => state.auth);
```

## User Data

### Access User Information
```typescript
import { useAppSelector } from './redux/hooks';

// Using basic selector
const { user } = useAppSelector(state => state.auth);
const username = user?.username;
const credit = user?.credit;

// Using optimized selector
import { selectUserInfo } from './redux/selectors';
const userInfo = useAppSelector(selectUserInfo);
```

### Refresh User Data
```typescript
dispatch(fetchUserData());
```

## Permissions

### Check Single Permission
```typescript
// Basic approach
const { permissions } = useAppSelector(state => state.auth);
const canShowUsers = permissions.includes('users_show');

// Using optimized selector
import { makeSelectHasPermission } from './redux/selectors';
const selectHasPermission = makeSelectHasPermission();
const canShowUsers = useAppSelector(state => 
  selectHasPermission(state, 'users_show')
);
```

### Check Multiple Permissions
```typescript
// Using custom hook
import { usePermissions } from './hooks/usePermissions';

const hasAccess = usePermissions(['users_index', 'users_create', 'users_edit']);
```

## Examples

### Protected Component
```typescript
import { useAppSelector } from './redux/hooks';
import { selectUserInfo, makeSelectHasPermission } from './redux/selectors';

export const ProtectedComponent = () => {
  const userInfo = useAppSelector(selectUserInfo);
  const selectHasPermission = makeSelectHasPermission();
  const canAccessDashboard = useAppSelector(state => 
    selectHasPermission(state, 'dashboard_page')
  );

  if (!userInfo) {
    return <div>Please login to access this page</div>;
  }

  if (!canAccessDashboard) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h1>Welcome {userInfo.username}</h1>
      <p>Your credit: {userInfo.credit}</p>
    </div>
  );
};
```

### Login Form
```typescript
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { login, fetchUserData } from './redux/slices/authSlice';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(credentials)).unwrap();
      await dispatch(fetchUserData()).unwrap();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

## State Management

The auth slice maintains the following state:
```typescript
interface AuthState {
  user: User | null;
  permissions: string[];
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

- `user`: Current user data
- `permissions`: Array of permission strings
- `token`: JWT token stored in cookies
- `isAuthenticated`: Boolean indicating login status
- `loading`: Loading state for async operations
- `error`: Error message if any operation fails

## Best Practices

1. Always handle loading and error states:
```typescript
const { loading, error } = useAppSelector(state => state.auth);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

2. Use optimized selectors for better performance:
```typescript
// Instead of
const { user, permissions } = useAppSelector(state => state.auth);

// Use
const userInfo = useAppSelector(selectUserInfo);
const hasPermission = useAppSelector(state => 
  selectHasPermission(state, 'some_permission')
);
```

3. Always check permissions before rendering protected content:
```typescript
{hasPermission && <ProtectedContent />}
```