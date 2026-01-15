import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../services/apis/users';
import type { UserResponse } from '../../interfaces/user.interface';

export const UserDashboard = () => {
    const [user, setUser] = useState<UserResponse | null>(null);

    useEffect(() => {
        getCurrentUser()
            .then(data => setUser(data))
            .catch(err => {
                if (err.message.includes('Unauthorized')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            });
    }, []);

    if (!user) return <div style={{padding: '20px'}}>Loading...</div>;

    return (
        <div style={{padding: '40px', fontFamily: 'Arial'}}>
            <h1>Welcome, {user.name}!</h1>
            <div style={{background: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px'}}>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Status:</strong> {user.status}</p>
                <p><strong>Purchases:</strong> {user.purchase}</p>
            </div>
        </div>
    );
};
