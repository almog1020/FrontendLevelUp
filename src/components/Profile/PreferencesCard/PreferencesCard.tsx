/**
 * PreferencesCard Component
 * Allows users to view and edit their gaming preferences
 * Includes favorite genre and preferred game store/platform
 * Uses dropdown selects for easy preference selection
 */

import React, { useState } from 'react';
import type { UserPreferences } from '../../../interfaces/profile.interface';
import styles from './PreferencesCard.module.scss';

interface PreferencesCardProps {
    preferences: UserPreferences; // Current user preferences
    onUpdate?: (preferences: UserPreferences) => void; // Callback called when preferences are saved
}

export const PreferencesCard: React.FC<PreferencesCardProps> = ({ preferences, onUpdate }) => {
    // State to track if card is in edit mode
    const [isEditing, setIsEditing] = useState(false);
    
    // Local form state for editing preferences before saving
    const [formData, setFormData] = useState(preferences);

    // Available game genres for selection
    const genres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing', 'Puzzle'];
    
    // Available game stores/platforms for selection
    const stores = ['Steam', 'Epic Games', 'GOG', 'Ubisoft', 'Origin'];

    /**
     * Saves the updated preferences and exits edit mode
     * Calls onUpdate callback if provided
     */
    const handleUpdate = () => {
        if (onUpdate) {
            onUpdate(formData);
        }
        setIsEditing(false);
    };

    /**
     * Updates form data when user selects a different option
     * @param field - The preference field being updated ('favoriteGenre' or 'preferredStore')
     * @param value - The new selected value
     */
    const handleChange = (field: keyof UserPreferences, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Preferences</h3>
                    <p className={styles.subtitle}>Manage your gaming preferences</p>
                </div>
            </div>
            <div className={styles.fields}>
                <div className={styles.field}>
                    <label className={styles.label}>Favorite Genre</label>
                    {isEditing ? (
                        <select
                            className={styles.select}
                            value={formData.favoriteGenre}
                            onChange={(e) => handleChange('favoriteGenre', e.target.value)}
                        >
                            {genres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    ) : (
                        <div className={styles.value}>{preferences.favoriteGenre}</div>
                    )}
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Preferred Store</label>
                    {isEditing ? (
                        <select
                            className={styles.select}
                            value={formData.preferredStore}
                            onChange={(e) => handleChange('preferredStore', e.target.value)}
                        >
                            {stores.map(store => (
                                <option key={store} value={store}>{store}</option>
                            ))}
                        </select>
                    ) : (
                        <div className={styles.value}>{preferences.preferredStore}</div>
                    )}
                </div>
            </div>
            {!isEditing ? (
                <button className={styles.updateButton} onClick={() => setIsEditing(true)}>
                    Update Preferences
                </button>
            ) : (
                <div className={styles.actionButtons}>
                    <button className={styles.cancelButton} onClick={() => {
                        setFormData(preferences);
                        setIsEditing(false);
                    }}>
                        Cancel
                    </button>
                    <button className={styles.saveButton} onClick={handleUpdate}>
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};
