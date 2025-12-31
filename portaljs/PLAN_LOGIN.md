# PortalJS Login Implementation Plan

## Overview

Implement user authentication in PortalJS using CKAN's API Token system. This plan creates a secure login flow where credentials are validated server-side and sessions are managed via Next.js.

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────┐
│  PortalJS UI    │────▶│  Next.js API Routes  │────▶│  CKAN API   │
│  /user/login    │     │  /api/auth/*         │     │  :5000      │
└─────────────────┘     └──────────────────────┘     └─────────────┘
        │                        │
        │                 ┌──────▼──────┐
        │                 │   Session   │
        └────────────────▶│  (Cookie)   │
                          └─────────────┘
```

## Test Credentials (from .env)

- **Username**: `ckan_admin`
- **Password**: `test1234`
- **CKAN URL**: `http://localhost:5001` (external) / `http://ckan:5000` (internal)

---

## Implementation Steps

### Step 1: Create Auth Context and Types
**Files to create:**
- `lib/auth.ts` - Auth types and utilities
- `contexts/AuthContext.tsx` - React context for auth state

**Verification:**
- Import AuthContext in _app.tsx without errors
- Check browser console for no errors

---

### Step 2: Create API Route - Login
**File:** `pages/api/auth/login.ts`

**Logic:**
1. Receive username/password from POST request
2. Call CKAN API `user_show` with credentials to validate
3. Call CKAN API `api_token_create` to generate token
4. Set HTTP-only cookie with session data
5. Return user info (without sensitive data)

**CKAN API Calls:**
```
POST http://ckan:5000/api/3/action/user_show
Authorization: {api_token}
Body: { "id": "username" }

POST http://ckan:5000/api/3/action/api_token_create
Authorization: {api_token}
Body: { "user": "username", "name": "portaljs-session" }
```

**Verification:**
- Use Chrome Extension to submit login form
- Check Network tab for API response
- Verify cookie is set in browser

---

### Step 3: Create API Route - Logout
**File:** `pages/api/auth/logout.ts`

**Logic:**
1. Clear session cookie
2. Optionally revoke API token via CKAN API

**Verification:**
- Click logout button
- Verify cookie is cleared
- Verify UI shows logged-out state

---

### Step 4: Create API Route - Session Check
**File:** `pages/api/auth/session.ts`

**Logic:**
1. Read session cookie
2. Validate token with CKAN API
3. Return current user info or null

**Verification:**
- Refresh page after login
- User should still be logged in
- Check Network tab for session API call

---

### Step 5: Create Login Page UI
**File:** `pages/user/login.tsx`

**Features:**
- Username/password form
- Error message display
- Loading state
- Redirect after successful login
- Link to CKAN for registration

**UI Design (data.gov.sg style):**
- Centered card layout
- Clean form inputs
- Primary color button

**Verification:**
- Navigate to /user/login
- See login form rendered
- Form validation works

---

### Step 6: Update Layout Header
**File:** `components/Layout.tsx`

**Changes:**
- Show user name when logged in
- Show dropdown menu (Profile, Logout)
- Hide "Log in" link when authenticated

**Verification:**
- Login and see username in header
- Click dropdown to see menu options
- Logout and see "Log in" link again

---

### Step 7: Create User Profile Page
**File:** `pages/user/profile.tsx`

**Features:**
- Display user information
- Show API token management link (to CKAN)
- Logout button

**Verification:**
- Navigate to /user/profile when logged in
- See user information displayed
- Redirect to login if not authenticated

---

### Step 8: Add Protected Route HOC
**File:** `components/auth/ProtectedRoute.tsx`

**Logic:**
- Check auth state
- Redirect to login if not authenticated
- Show loading while checking

**Verification:**
- Access /user/profile without login
- Should redirect to /user/login
- After login, should access profile

---

## File Structure

```
portaljs/
├── contexts/
│   └── AuthContext.tsx       # Auth state management
├── lib/
│   ├── auth.ts               # Auth utilities & types
│   └── ckan.ts               # Existing CKAN API (add auth functions)
├── pages/
│   ├── api/
│   │   └── auth/
│   │       ├── login.ts      # POST: authenticate user
│   │       ├── logout.ts     # POST: clear session
│   │       └── session.ts    # GET: check current session
│   └── user/
│       ├── login.tsx         # Login page UI
│       └── profile.tsx       # User profile page
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   └── Layout.tsx            # Update header
```

---

## Verification Checklist

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open http://localhost:3001/user/login | See login form |
| 2 | Enter wrong credentials, submit | See error message |
| 3 | Enter ckan_admin / test1234, submit | Redirect to homepage |
| 4 | Check header | See "ckan_admin" instead of "Log in" |
| 5 | Click username dropdown | See Profile and Logout options |
| 6 | Click Profile | Navigate to /user/profile |
| 7 | See profile page | Display user info |
| 8 | Click Logout | Return to logged-out state |
| 9 | Refresh page | Still logged out (session cleared) |
| 10 | Login again, refresh page | Still logged in (session persists) |

---

## Security Considerations

1. **Credentials never in browser**: Username/password only sent to Next.js API
2. **HTTP-only cookies**: Session token not accessible via JavaScript
3. **Server-side validation**: All auth checks on server
4. **Token expiration**: Implement token refresh or expiry
5. **CSRF protection**: Next.js API routes have built-in protection

---

## Dependencies

No new npm packages required. Uses:
- Next.js API routes (built-in)
- React Context (built-in)
- cookies (via response headers)

---

## Timeline

1. **Step 1-2**: Auth context + Login API (core functionality)
2. **Step 3-4**: Logout + Session APIs (complete auth flow)
3. **Step 5**: Login page UI (user-facing)
4. **Step 6**: Header update (integration)
5. **Step 7-8**: Profile page + Protected routes (polish)

Each step is independently verifiable via Chrome Extension.
