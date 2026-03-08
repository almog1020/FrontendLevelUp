import React, {useContext, useState} from 'react';
import styles from './PreferencesCard.module.scss';
import type {User} from "../../../interfaces/user.interface.ts";
import {updateUser} from "../../../services/apis/users.ts";
import {toast} from "react-toastify";
import {AuthContext} from "../../AuthProvider/AuthProvider.tsx";

interface PreferencesCardProps {
    profile: User;
    onUpdate: (loading:boolean) => void;
}

export const PreferencesCard: React.FC<PreferencesCardProps> = ({ profile,onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);
    const genres = ['action', 'adventure', 'RPG', 'strategy', 'simulation', 'sports', 'racing', 'puzzle'];
    const stores = ['steam', 'uplay', 'desura', 'amazon', 'origin'];
    const auth = useContext(AuthContext);

    const handleUpdate = async () => {
        try {
            onUpdate(true)
            if (isEditing) await updateUser(formData.email,formData);
            setIsEditing(false);
            auth?.fetchUser()
            await new Promise((resolve) => setTimeout(resolve, 3000));
            toast.success('User update successfully!');
            onUpdate(false)
        }catch (error:unknown) {
            onUpdate(false)
            toast.error((error as Error).message);
        }

    };
    const handleChange = (field: keyof User, value: string) => {
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
                    <select
                        className={styles.select}
                        defaultValue={profile.favorite_genre}
                        onChange={(e) => handleChange('favorite_genre', e.target.value)}
                        disabled={!isEditing}
                    >
                        {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Preferred Store</label>
                    <select
                        className={styles.select}
                        defaultValue={formData.preferred_store}
                        onChange={(e) => handleChange('preferred_store', e.target.value)}
                        disabled={!isEditing}
                    >
                        {stores.map(store => (
                            <option key={store} value={store}>{store}</option>
                        ))}
                    </select>
                </div>
            </div>
            {!isEditing ? (
                <button className={styles.updateButton} onClick={() => setIsEditing(true)}>
                    Update Preferences
                </button>
            ) : (
                <div className={styles.actionButtons}>
                    <button type="button" className={styles.cancelButton} onClick={() => {
                        setFormData(profile);
                        setIsEditing(false);
                    }}>
                        Cancel
                    </button>
                    <button type="button" className={styles.saveButton} onClick={handleUpdate}>
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};
