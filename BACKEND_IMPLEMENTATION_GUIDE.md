# Backend Implementation Guide - Profile Page

## Summary of Frontend Implementation

This guide documents what the frontend expects from the backend for the **Profile Page** functionality. The frontend has been updated to fetch real user data from the database instead of using mock data.

---

## What We've Implemented on the Frontend

### 1. **Profile Page Component** (`/user/profile`)
   - Fetches user profile data on page load
   - Displays user information, statistics, preferences, and activities
   - Allows editing personal information (name, email, password)
   - Allows updating gaming preferences
   - Shows loading and error states
   - Handles authentication automatically

### 2. **API Integration**
   - All API calls use authentication tokens (Bearer token in Authorization header)
   - Automatic token injection via axios interceptors
   - Proper error handling with user-friendly messages
   - Fallback logic if primary endpoint fails

### 3. **Security Implementation**
   - **Passwords are NEVER received from backend** (hashed or plain text)
   - Passwords are only sent TO backend in plain text for updates
   - Backend must hash passwords before storing
   - All user responses exclude password fields

---

## Required API Endpoints

### Base URL
```
http://127.0.0.1:8000
```

### Authentication
All endpoints (except login/register) require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Endpoint 1: GET /users/me

**Purpose:** Get current authenticated user's basic information

**Method:** `GET`

**Headers:**
```
Authorization: Bearer <token>
Accept: application/json
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "status": "active",
  "joined": "2024-01-01T00:00:00.000Z",
  "lastActive": "2024-12-20T10:30:00.000Z",
  "purchase": "premium",
  "google_id": "optional_google_id"
}
```

**Important:**
- ❌ **DO NOT** include `password` field in response
- ✅ Include all other user fields
- `role` must be either `"admin"` or `"user"`
- `status` must be either `"active"` or `"suspended"`
- Dates should be in ISO 8601 format

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Token valid but insufficient permissions
- `500 Internal Server Error` - Server error

---

## Endpoint 2: GET /profile

**Purpose:** Get complete profile data including statistics, preferences, and activities

**Method:** `GET`

**Headers:**
```
Authorization: Bearer <token>
Accept: application/json
```

**Response (200 OK):**
```json
{
  "profile": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "memberSince": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-12-20T10:30:00.000Z"
  },
  "statistics": {
    "wishlistItems": 12,
    "totalSaved": 127.50,
    "gamesTracked": 47,
    "priceAlerts": 8,
    "reviewsWritten": 15
  },
  "preferences": {
    "favoriteGenre": "Action",
    "preferredStore": "Steam"
  },
  "activities": [
    {
      "id": 1,
      "type": "wishlist",
      "description": "Added to wishlist",
      "gameName": "Cyberpunk 2077",
      "timestamp": "2024-12-20T08:30:00.000Z"
    },
    {
      "id": 2,
      "type": "purchase",
      "description": "Purchased from Steam",
      "gameName": "Elden Ring",
      "timestamp": "2024-12-19T14:20:00.000Z"
    }
  ]
}
```

**Field Descriptions:**

**Profile:**
- `id` (number, required) - User ID
- `name` (string, required) - User's full name
- `email` (string, required) - User's email address
- `role` (string, required) - Either `"admin"` or `"user"`
- `avatar` (string, optional) - URL to user's avatar image
- `memberSince` (string, required) - ISO 8601 date when user joined
- `lastLogin` (string, required) - ISO 8601 date of last login

**Statistics:**
- `wishlistItems` (number) - Count of games in wishlist
- `totalSaved` (number) - Total money saved from price drops
- `gamesTracked` (number) - Number of games being tracked
- `priceAlerts` (number) - Number of active price alerts
- `reviewsWritten` (number) - Number of reviews written

**Preferences:**
- `favoriteGenre` (string) - User's favorite game genre
- `preferredStore` (string) - User's preferred game store/platform

**Activities:**
- `id` (number) - Activity ID
- `type` (string) - One of: `"wishlist"`, `"purchase"`, `"review"`, `"price_alert"`
- `description` (string) - Human-readable description
- `gameName` (string) - Name of the game
- `timestamp` (string) - ISO 8601 date/time

**Important:**
- ❌ **DO NOT** include `password` field anywhere in response
- ✅ Return empty arrays/zero values if data doesn't exist yet
- Dates must be in ISO 8601 format

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Token valid but insufficient permissions
- `500 Internal Server Error` - Server error

---

## Endpoint 3: PUT /profile

**Purpose:** Update user's profile information (name, email, password)

**Method:** `PUT`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

**Request Body (Partial - only send fields that changed):**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newPlainTextPassword123"
}
```

**Important Password Handling:**
- ✅ Frontend sends password in **plain text** (this is correct)
- ✅ Backend **MUST** hash the password using bcrypt or argon2 before storing
- ❌ Backend **MUST NEVER** return password (hashed or plain) in response
- ✅ If password is not provided, don't update it (keep existing hashed password)

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully"
}
```

**Or return updated profile (without password):**
```json
{
  "id": 1,
  "name": "John Updated",
  "email": "john.updated@example.com",
  "role": "user",
  "avatar": "https://example.com/avatar.jpg",
  "memberSince": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-12-20T10:30:00.000Z"
}
```

**Validation:**
- Validate email format
- Validate password strength (if provided)
- Ensure user can only update their own profile (unless admin)
- Check that email is not already taken by another user

**Error Responses:**
- `400 Bad Request` - Invalid data (e.g., invalid email format, weak password)
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User trying to update another user's profile
- `409 Conflict` - Email already exists
- `500 Internal Server Error` - Server error

---

## Endpoint 4: PUT /profile/preferences

**Purpose:** Update user's gaming preferences

**Method:** `PUT`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
  "favoriteGenre": "RPG",
  "preferredStore": "Epic Games"
}
```

**Response (200 OK):**
```json
{
  "message": "Preferences updated successfully"
}
```

**Or return updated preferences:**
```json
{
  "favoriteGenre": "RPG",
  "preferredStore": "Epic Games"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid data
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

---

## Data Type Definitions

### UserRole
```typescript
type UserRole = "admin" | "user"
```

### UserStatus
```typescript
type UserStatus = "active" | "suspended"
```

### ActivityType
```typescript
type ActivityType = "wishlist" | "purchase" | "review" | "price_alert"
```

---

## Security Requirements

### 1. Password Handling
- ✅ **NEVER** return password (hashed or plain) in any API response
- ✅ Hash passwords using bcrypt or argon2 before storing
- ✅ Accept plain text passwords from frontend (this is normal and secure)
- ✅ Validate password strength on backend
- ✅ If password field is missing in update request, don't change existing password

### 2. Authentication
- ✅ Verify Bearer token on all protected endpoints
- ✅ Return `401 Unauthorized` if token is invalid or missing
- ✅ Return `403 Forbidden` if user doesn't have permission

### 3. Authorization
- ✅ Users can only update their own profile
- ✅ Admins may have additional permissions (if needed)

### 4. Input Validation
- ✅ Validate email format
- ✅ Validate required fields
- ✅ Sanitize user inputs
- ✅ Check for SQL injection, XSS attacks

---

## Error Response Format

All errors should follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**Example:**
```json
{
  "detail": "Email already registered"
}
```

---

## CORS Configuration

Backend must allow requests from frontend origin:
```
Access-Control-Allow-Origin: *
```
Or specifically:
```
Access-Control-Allow-Origin: http://localhost:5173
```

---

## Testing Checklist

Before marking as complete, verify:

- [ ] `GET /users/me` returns user data without password
- [ ] `GET /profile` returns complete profile data without password
- [ ] `PUT /profile` updates name and email correctly
- [ ] `PUT /profile` hashes password before storing
- [ ] `PUT /profile` doesn't return password in response
- [ ] `PUT /profile/preferences` updates preferences correctly
- [ ] All endpoints require authentication
- [ ] Invalid tokens return 401
- [ ] Users can only update their own profile
- [ ] Email validation works
- [ ] Error messages are user-friendly
- [ ] CORS is properly configured

---

## Example Implementation (FastAPI/Python)

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional
import bcrypt

app = FastAPI()
security = HTTPBearer()

# Models
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str
    joined: str
    lastActive: str
    purchase: str
    google_id: Optional[str] = None

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class PreferencesUpdate(BaseModel):
    favoriteGenre: str
    preferredStore: str

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # Verify token and get user
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

# Endpoints
@app.get("/users/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    # Return user without password
    return UserResponse(**current_user.dict(exclude={"password"}))

@app.get("/profile")
async def get_profile(current_user = Depends(get_current_user)):
    # Fetch and return complete profile data
    profile_data = {
        "profile": {...},
        "statistics": {...},
        "preferences": {...},
        "activities": [...]
    }
    return profile_data

@app.put("/profile")
async def update_profile(
    update_data: ProfileUpdate,
    current_user = Depends(get_current_user)
):
    # Hash password if provided
    if update_data.password:
        hashed = bcrypt.hashpw(update_data.password.encode(), bcrypt.gensalt())
        update_data.password = hashed.decode()
    
    # Update user in database
    # ...
    
    return {"message": "Profile updated successfully"}

@app.put("/profile/preferences")
async def update_preferences(
    preferences: PreferencesUpdate,
    current_user = Depends(get_current_user)
):
    # Update preferences in database
    # ...
    
    return {"message": "Preferences updated successfully"}
```

---

## Notes

1. The frontend will try `/profile` first, then fall back to `/users/me` if `/profile` fails
2. All dates should be in ISO 8601 format (e.g., `"2024-12-20T10:30:00.000Z"`)
3. The frontend handles loading states, so backend can take reasonable time to respond
4. Frontend timeout is set to 10 seconds
5. Backend should return appropriate HTTP status codes for proper error handling

---

## Questions?

If you need clarification on any endpoint or requirement, please refer to:
- Frontend API service files: `src/services/apis/profile.ts` and `src/services/apis/users.ts`
- Frontend interfaces: `src/interfaces/profile.interface.ts` and `src/interfaces/user.interface.ts`
- Frontend component: `src/components/Profile/Profile.tsx`
