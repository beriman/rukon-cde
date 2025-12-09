# Directive: Frontend Development with Next.js

**ID**: DIR-007  
**Layer**: Directive (What to do)  
**Trigger**: User requests new UI pages, components, atau frontend features

## 1. Objective
Implement Next.js pages dan React components dengan proper state management, API integration, error handling, dan responsive design.

## 2. Input
- UI/UX requirements dari story
- Design mockups (jika ada)
- API endpoints untuk integration  
- User flows dan interactions

## 3. Tools & Scripts
- **Next.js App Router**: Page routing
- **React**: Component framework
- **TailwindCSS**: Styling
- **React Hook Form**: Form handling
- **React Query / SWR**: Data fetching
- **Zod**: Client-side validation

## 4. Workflow

### 4.1 Planning
1. Review UI requirements
2. Identify pages needed (routes)
3. Break down into reusable components
4. Plan state management approach
5. Identify API calls needed

### 4.2 Create Page Structure
```typescript
// app/users/page.tsx
import { Metadata } from 'next';
import UserList from '@/components/users/UserList';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Manage organization users',
};

export default function UsersPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <UserList />
    </div>
  );
}
```

### 4.3 Create Components
```typescript
// components/users/UserList.tsx
'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { UserTable } from './UserTable';
import { SearchBar } from '../common/SearchBar';
import { Pagination } from '../common/Pagination';

export default function UserList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data, isLoading, error } = useUsers({ page, search });
  
  if (error) return <ErrorState error={error} />;
  if (isLoading) return <LoadingState />;
  
  return (
    <div className="space-y-4">
      <SearchBar value={search} onChange={setSearch} />
      <UserTable users={data.data} />
      <Pagination
        currentPage={page}
        totalPages={data.meta.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### 4.4 API Integration dengan Custom Hook
```typescript
// hooks/useUsers.ts
import useSWR from 'swr';
import { api } from '@/lib/api';

export function useUsers(params: { page: number; search?: string }) {
  const { data, error, mutate } = useSWR(
    [`/api/users`, params],
    ([url, params]) => api.get(url, { params }).then(res => res.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
  };
}
```

### 4.5 Form Handling
```typescript
// components/users/EditUserForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['VIEWER', 'INFORMATION_MANAGER', 'ORG_ADMIN']),
});

type UserFormData = z.infer<typeof userSchema>;

export function EditUserForm({ user, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user,
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      await api.patch(`/api/users/${user.id}`, data);
      onSuccess();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input
          {...register('name')}
          className="input"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

## 5. Best Practices

✅ **DO**:
- Use TypeScript untuk type safety
- Implement loading states
- Implement error states
- Use server components when possible
- Client components only when needed (interactivity)
- Validate forms client-side
- Show user feedback (toast, alerts)
- Make UI responsive (mobile-first)
- Use semantic HTML
- Implement accessibility (ARIA labels)

❌ **DON'T**:
- Put API calls directly in components (use custom hooks)
- Ignore loading/error states
- Use inline styles (use Tailwind)
- Skip form validation
- Expose sensitive data
- Create overly complex components
- Forget to handle edge cases (empty states, etc.)

## 6. Component Structure

```
components/
├── users/
│   ├── UserList.tsx
│   ├── UserTable.tsx
│   ├── UserRow.tsx
│   ├── EditUserModal.tsx
│   └── EditUserForm.tsx
├── common/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── SearchBar.tsx
│   ├── Pagination.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorState.tsx
└── layout/
    ├── Header.tsx
    ├── Sidebar.tsx
    └── Footer.tsx
```

## 7. Error Handling

```typescript
// lib/api.ts
import axios from 'axios';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);
```

## 8. Responsive Design

Use Tailwind breakpoints:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>

<button className="w-full sm:w-auto px-4 py-2">
  Click me
</button>
```

## 9. Accessibility

```typescript
<button
  aria-label="Close modal"
  onClick={onClose}
>
  <X className="h-5 w-5" />
</button>

<input
  type="text"
  id="search"
  aria-describedby="search-hint"
  placeholder="Search users..."
/>
<p id="search-hint" className="text-sm text-gray-500">
  Search by name or email
</p>
```
