# Backend Quick Reference - Profile Page Endpoints

## 🔐 CRITICAL: Password Security Rules
1. **NEVER return passwords** in any API response (not hashed, not plain text)
2. **Hash passwords** using bcrypt/argon2 before storing in database
3. **Frontend sends plain text** passwords - backend must hash them
4. **Use compare()** for password verification, NEVER decode hashes

---

## Required Endpoints

### 1. GET `/users/me` (Authenticated)
**Returns:** User data without password
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

### 2. GET `/profile` (Authenticated)
**Returns:** Complete profile with statistics, preferences, activities
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
    }
  ]
}
```

### 3. PUT `/profile` (Authenticated)
**Request Body (all fields optional):**
```json
{
  "name": "Jane Doe",           // Optional
  "email": "jane@example.com",  // Optional
  "password": "newpassword123"   // Optional - plain text, MUST hash before storing
}
```
**Response:** 200 OK or 204 No Content

**Important:** 
- Only update fields that are provided
- If password provided, hash it before storing
- If password NOT provided, don't update password
- Validate email uniqueness if email is changed

### 4. PUT `/profile/preferences` (Authenticated)
**Request Body:**
```json
{
  "favoriteGenre": "RPG",
  "preferredStore": "Steam"
}
```
**Valid Genres:** Action, Adventure, RPG, Strategy, Simulation, Sports, Racing, Puzzle
**Valid Stores:** Steam, Epic Games, GOG, Ubisoft, Origin

---

## Authentication
All endpoints require: `Authorization: Bearer <token>` header

---

## Error Responses
- `400 Bad Request`: Invalid data
- `401 Unauthorized`: Invalid/missing token
- `403 Forbidden`: Insufficient permissions
- `422 Unprocessable Entity`: Validation errors

Error format:
```json
{
  "detail": "Error message here"
}
```

---

## Database Tables Needed

1. **users** - id, name, email, password (hashed), role, status, joined, lastActive, purchase, google_id, avatar
2. **user_preferences** - user_id, favorite_genre, preferred_store
3. **user_statistics** - user_id, wishlist_items, total_saved, games_tracked, price_alerts, reviews_written
4. **user_activities** - id, user_id, type, description, game_name, timestamp

---

## Key Implementation Points

✅ Hash passwords before storing  
✅ NEVER return passwords in responses  
✅ Support partial updates in PUT /profile  
✅ Validate email uniqueness  
✅ Use ISO 8601 datetime format  
✅ Return 200/204 on success  
✅ Include proper error messages  

❌ Don't return password hashes  
❌ Don't store plain text passwords  
❌ Don't decode password hashes (use compare)  
❌ Don't require all fields in PUT requests  

---

**Base URL:** `http://127.0.0.1:8000/`  
**Timeout:** 10 seconds  
**CORS:** Must be enabled
