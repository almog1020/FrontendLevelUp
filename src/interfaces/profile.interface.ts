import type { UserRole } from "./user.interface";


/**
 * Profile Interface
 * Defines the structure for user profile information
 * @property id - Unique identifier for the user
 * @property name - User's full name
 * @property email - User's email address
 * @property role - User's role (admin or user)
 * @property avatar - Optional URL or path to user's avatar image
 * @property memberSince - Date when user joined the platform (ISO string format)
 * @property lastLogin - Date of user's last login (ISO string format)
 */
export interface Profile {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    memberSince?: string | null;
    lastLogin?: string | null;
}

/**
 * Profile Statistics Interface
 * Contains user's gaming statistics and activity metrics
 * @property wishlistItems - Number of games in user's wishlist
 * @property totalSaved - Total amount saved from price drops (in dollars)
 * @property gamesTracked - Number of games being tracked by the user
 * @property priceAlerts - Number of active price alerts set by the user
 * @property reviewsWritten - Number of game reviews written by the user
 */
export interface ProfileStatistics {
    wishlistItems: number;
    totalSaved: number;
    gamesTracked: number;
    priceAlerts: number;
    reviewsWritten: number;
}

/**
 * User Preferences Interface
 * Stores user's gaming preferences and settings
 * @property favoriteGenre - User's preferred game genre
 * @property preferredStore - User's preferred game store/platform (e.g., Steam, Epic Games)
 */
export interface UserPreferences {
    favoriteGenre: string;
    preferredStore: string;
}

/**
 * Activity Item Interface
 * Represents a single activity/action performed by the user
 * @property id - Unique identifier for the activity
 * @property type - Type of activity (wishlist, purchase, review, or price_alert)
 * @property description - Human-readable description of the activity
 * @property gameName - Name of the game associated with this activity
 * @property timestamp - When the activity occurred (ISO string format)
 */
export interface ActivityItem {
    id: number;
    type: 'wishlist' | 'purchase' | 'review' | 'price_alert';
    description: string;
    gameName: string;
    timestamp: string;
}

/**
 * Profile Data Interface
 * Complete profile data structure containing all profile-related information
 * This is the main data structure returned by the profile API endpoint
 * @property profile - User's basic profile information
 * @property statistics - User's gaming statistics
 * @property preferences - User's gaming preferences
 * @property activities - Array of recent user activities
 */
export interface ProfileData {
    profile: Profile;
    statistics: ProfileStatistics;
    preferences: UserPreferences;
    activities: ActivityItem[];
}
