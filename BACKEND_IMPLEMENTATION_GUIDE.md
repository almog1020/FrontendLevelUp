# Backend Implementation Guide for Profile Page

## Overview
This guide provides detailed specifications for implementing the backend API endpoints required by the frontend profile page. The frontend expects specific endpoints, request/response formats, and security requirements.

**Base URL:** `http://127.0.0.1:8000/`

**Authentication:** All profile endpoints require Bearer token authentication via `Authorization: Bearer <token>` header.

---

## 🔐 Critical Security Requirements

### Password Handling (MANDATORY)
1. **NEVER return passwords in API responses** - Not hashed, not plain text, not in any form
2. **Hash passwords before storing** - Use bcrypt, argon2, or similar secure hashing library
3. **Frontend sends plain text passwords** - Backend must hash them before database storage
4. **Password verification** - Use `compare(plain_password, hashed_password)` for login, NEVER decode hashes
5. **Password updates** - If password field is provided in update request, hash it before storing

---

## 📋 Required API Endpoints

### 1. GET `/users/me`
**Purpose:** Fetch current authenticated user's basic information

**Authentication:** Required (Bearer token)

**Request:**
```
GET /users/me
Headers:
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
  "joined": "2024-01-15T10:30:00Z",
  "lastActive": "2024-01-20T14:22:00Z",
  "purchase": "",
  "google_id": ""
}
```

**Response Fields:**
- `id` (number): User ID
- `name` (string): User's full name
- `email` (string): User's email address
- `role` (string): "admin" | "user"
- `status` (string): "active" | "suspended"
- `joined` (string): ISO 8601 datetime string
- `lastActive` (string): ISO 8601 datetime string
- `purchase` (string): Purchase information
- `google_id` (string): Google OAuth ID if applicable

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Token valid but insufficient permissions

**Important:** Response MUST NOT include `password` field (even hashed).

---

### 2. GET `/profile`
**Purpose:** Fetch complete profile data including statistics, preferences, and activities

**Authentication:** Required (Bearer token)

**Request:**
```
GET /profile
Headers:
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
    "memberSince": "2024-01-15T10:30:00Z",
    "lastLogin": "2024-01-20T14:22:00Z"
  },
  "statistics": {
    "wishlistItems": 12,
    "totalSaved": 245.50,
    "gamesTracked": 8,
    "priceAlerts": 5,
    "reviewsWritten": 3
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
      "timestamp": "2024-01-20T10:15:00Z"
    },
    {
      "id": 2,
      "type": "purchase",
      "description": "Purchased game",
      "gameName": "The Witcher 3",
      "timestamp": "2024-01-19T16:30:00Z"
    }
  ]
}
```

**Response Structure:**

**Profile Object:**
- `id` (number): User ID
- `name` (string): User's full name
- `email` (string): User's email address
- `role` (string): "admin" | "user"
- `avatar` (string, optional): URL to user's avatar image
- `memberSince` (string): ISO 8601 datetime when user joined
- `lastLogin` (string): ISO 8601 datetime of last login

**Statistics Object:**
- `wishlistItems` (number): Count of items in wishlist
- `totalSaved` (number): Total money saved from price drops (decimal)
- `gamesTracked` (number): Number of games being tracked
- `priceAlerts` (number): Number of active price alerts
- `reviewsWritten` (number): Number of reviews written

**Preferences Object:**
- `favoriteGenre` (string): User's favorite game genre
- `preferredStore` (string): User's preferred game store/platform

**Activities Array:**
- Each activity has:
  - `id` (number): Activity ID
  - `type` (string): "wishlist" | "purchase" | "review" | "price_alert"
  - `description` (string): Human-readable description
  - `gameName` (string): Name of associated game
  - `timestamp` (string): ISO 8601 datetime

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Token valid but insufficient permissions
- `404 Not Found`: Profile not found (shouldn't happen for authenticated user)

**Important:** Response MUST NOT include `password` field anywhere.

---

### 3. PUT `/profile`
**Purpose:** Update user's profile information (name, email, password)

**Authentication:** Required (Bearer token)

**Request:**
```
PUT /profile
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
  Accept: application/json

Body (all fields optional, only send fields to update):
{
  "name": "Jane Doe",           // Optional: New name
  "email": "jane@example.com",  // Optional: New email
  "password": "newpassword123"   // Optional: New password (plain text)
}
```

**Request Body Rules:**
- All fields are optional
- Only include fields that should be updated
- If `password` is provided, it will be in **plain text** - backend MUST hash it before storing
- If `password` is NOT provided or is empty string, do NOT update password
- Email should be validated for format
- Email should be checked for uniqueness if changed

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully"
}
```

**Or (204 No Content):** Empty response body

**Error Responses:**
- `400 Bad Request`: Invalid data (e.g., invalid email format, email already in use)
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Token valid but insufficient permissions
- `422 Unprocessable Entity`: Validation errors

**Password Update Logic:**
```python
# Pseudocode example
if "password" in request_data and request_data["password"]:
    # Hash the password before storing
    hashed_password = hash_password(request_data["password"])
    user.password = hashed_password
```

**Important:** 
- Hash password using bcrypt/argon2 before storing
- NEVER return password (hashed or plain) in response
- Validate email uniqueness if email is being changed

---

### 4. PUT `/profile/preferences`
**Purpose:** Update user's gaming preferences

**Authentication:** Required (Bearer token)

**Request:**
```
PUT /profile/preferences
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
  Accept: application/json

Body:
{
  "favoriteGenre": "RPG",
  "preferredStore": "Epic Games"
}
```

**Request Body:**
- `favoriteGenre` (string, required): User's favorite game genre
- `preferredStore` (string, required): User's preferred game store/platform

**Valid Genre Options:**
- "Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", "Racing", "Puzzle"

**Valid Store Options:**
- "Steam", "Epic Games", "GOG", "Ubisoft", "Origin"

**Response (200 OK):**
```json
{
  "message": "Preferences updated successfully"
}
```

**Or (204 No Content):** Empty response body

**Error Responses:**
- `400 Bad Request`: Invalid preference values
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Token valid but insufficient permissions
- `422 Unprocessable Entity`: Validation errors

---

## 🔑 Authentication Endpoint (Reference)

### POST `/auth/token`
**Purpose:** Authenticate user and get access token

**Request:**
```
POST /auth/token
Headers:
  Content-Type: application/json

Body:
{
  "username": "john@example.com",
  "password": "plaintextpassword"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses:**
- `422 Unprocessable Entity`: Invalid credentials (password incorrect)
- `401 Unauthorized`: Authentication failed

**Important:**
- Password is sent in **plain text** from frontend
- Backend must compare plain password with stored hash using `compare(plain, hash)`
- NEVER decode or decrypt the hash
- Return token and user data WITHOUT password

---

## 📊 Database Schema Requirements

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Hashed password only
    role VARCHAR(20) DEFAULT 'user',  -- 'admin' or 'user'
    status VARCHAR(20) DEFAULT 'active',  -- 'active' or 'suspended'
    joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastActive TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    purchase TEXT,
    google_id VARCHAR(255),
    avatar VARCHAR(500)  -- Optional avatar URL
);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
    user_id INTEGER PRIMARY KEY,
    favorite_genre VARCHAR(50) DEFAULT 'Action',
    preferred_store VARCHAR(50) DEFAULT 'Steam',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### User Statistics Table (or computed from other tables)
```sql
-- Statistics can be computed from other tables or stored separately
-- Example: wishlist_items, tracked_games, price_alerts, reviews tables

CREATE TABLE user_statistics (
    user_id INTEGER PRIMARY KEY,
    wishlist_items INTEGER DEFAULT 0,
    total_saved DECIMAL(10, 2) DEFAULT 0.00,
    games_tracked INTEGER DEFAULT 0,
    price_alerts INTEGER DEFAULT 0,
    reviews_written INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### User Activities Table
```sql
CREATE TABLE user_activities (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL,  -- 'wishlist', 'purchase', 'review', 'price_alert'
    description TEXT NOT NULL,
    game_name VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## ✅ Implementation Checklist

### Security
- [ ] Passwords are NEVER returned in any API response
- [ ] Passwords are hashed using bcrypt/argon2 before database storage
- [ ] Password verification uses `compare()` function, never decryption
- [ ] All profile endpoints require Bearer token authentication
- [ ] Token validation is performed on every authenticated request
- [ ] Email uniqueness is validated when updating email

### Endpoints
- [ ] `GET /users/me` - Returns user data without password
- [ ] `GET /profile` - Returns complete profile data (profile, statistics, preferences, activities)
- [ ] `PUT /profile` - Updates profile fields (name, email, password)
- [ ] `PUT /profile/preferences` - Updates user preferences

### Data Validation
- [ ] Email format validation
- [ ] Email uniqueness check
- [ ] Password strength requirements (if applicable)
- [ ] Genre and store validation for preferences
- [ ] Required fields validation

### Error Handling
- [ ] Proper HTTP status codes (200, 204, 400, 401, 403, 404, 422)
- [ ] Error messages in response body with `detail` field
- [ ] CORS headers configured correctly
- [ ] Timeout handling (frontend expects 10 second timeout)

### Database
- [ ] Users table with all required fields
- [ ] User preferences table
- [ ] User statistics table or computed statistics
- [ ] User activities table
- [ ] Proper foreign key relationships
- [ ] Indexes on frequently queried fields (email, user_id)

### Testing
- [ ] Test authentication with valid/invalid tokens
- [ ] Test password hashing and verification
- [ ] Test profile retrieval
- [ ] Test profile updates (name, email, password separately)
- [ ] Test preferences update
- [ ] Test error cases (401, 403, 404, 422)
- [ ] Verify passwords are never in responses

---

## 🧪 Example Test Cases

### Test 1: Get Current User
```bash
curl -X GET http://127.0.0.1:8000/users/me \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

**Expected:** User data without password field

### Test 2: Get Full Profile
```bash
curl -X GET http://127.0.0.1:8000/profile \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

**Expected:** Complete profile data with statistics, preferences, and activities

### Test 3: Update Profile Name
```bash
curl -X PUT http://127.0.0.1:8000/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name"}'
```

**Expected:** Success response, name updated in database

### Test 4: Update Password
```bash
curl -X PUT http://127.0.0.1:8000/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"password": "newpassword123"}'
```

**Expected:** Success response, password hashed and stored (verify hash in database, not plain text)

### Test 5: Update Preferences
```bash
curl -X PUT http://127.0.0.1:8000/profile/preferences \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"favoriteGenre": "RPG", "preferredStore": "Steam"}'
```

**Expected:** Success response, preferences updated

### Test 6: Verify No Password in Response
```bash
# Get profile and verify password field is NOT present
curl -X GET http://127.0.0.1:8000/profile \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json" | jq .
```

**Expected:** No `password` field in any part of the response

---

## 📝 Notes for Backend Developer

1. **Password Security is Critical**: The frontend explicitly expects that passwords are NEVER returned. This is a security requirement, not optional.

2. **Partial Updates**: The `PUT /profile` endpoint should support partial updates - only update fields that are provided in the request.

3. **Fallback Behavior**: The frontend tries `/profile` first, then falls back to `/users/me` if `/profile` fails. Both endpoints should work, but `/profile` is preferred as it contains more complete data.

4. **Statistics Calculation**: Statistics can be computed from other tables (wishlist, purchases, reviews, etc.) or stored separately and updated when relevant actions occur.

5. **Activities**: Activities should be populated from user actions (adding to wishlist, making purchases, writing reviews, setting price alerts).

6. **Default Values**: If user preferences don't exist, return sensible defaults:
   - `favoriteGenre`: "Action"
   - `preferredStore`: "Steam"

7. **Date Formats**: All datetime fields should be in ISO 8601 format (e.g., "2024-01-20T14:22:00Z").

8. **CORS**: Ensure CORS is configured to allow requests from the frontend origin.

9. **Timeout**: Frontend has a 10-second timeout, so ensure backend responds within this time.

10. **Error Messages**: Use consistent error message format with `detail` field:
    ```json
    {
      "detail": "Error message here"
    }
    ```

---

## 🚨 Common Mistakes to Avoid

1. ❌ **Returning password hashes in API responses** - NEVER do this
2. ❌ **Storing plain text passwords** - Always hash before storing
3. ❌ **Trying to decode/decrypt password hashes** - Use compare() function instead
4. ❌ **Missing authentication checks** - All profile endpoints must verify token
5. ❌ **Not validating email uniqueness** - Check when email is updated
6. ❌ **Returning wrong data structure** - Match the exact interface structure
7. ❌ **Missing fields in responses** - All required fields must be present
8. ❌ **Wrong HTTP status codes** - Use appropriate codes (200, 204, 400, 401, 403, 422)

---

## 📞 Frontend Contact Points

If you need clarification on any endpoint or data structure, refer to:
- `src/services/apis/profile.ts` - Profile API service
- `src/services/apis/users.ts` - Users API service  
- `src/interfaces/profile.interface.ts` - Profile data interfaces
- `src/interfaces/user.interface.ts` - User data interfaces
- `src/components/Profile/Profile.tsx` - Main profile component

---

**Last Updated:** Based on frontend code as of profile page implementation
**Frontend Base URL:** `http://127.0.0.1:8000/`
**Frontend Timeout:** 10 seconds
