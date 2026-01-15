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

    // Placeholder stats (will connect to backend later)
    const stats = {
        wishlistItems: 12,
        priceDrops: 3,
        totalSaved: 127,
        gamesTracked: 47
    };

    return (
        <div style={{
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: '0 auto',
            background: '#f5f5f5',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#1f2937' }}>
                    Dashboard
                </h1>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                    Welcome back, {user.name}! Here's what's new
                </p>
            </div>

            {/* Stats Overview */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                {/* Wishlist Items Card */}
                <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Wishlist Items</h3>
                        <span style={{ fontSize: '20px' }}>❤️</span>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                        {stats.wishlistItems}
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        +2 from last month
                    </p>
                </div>

                {/* Price Drops Card */}
                <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Price Drops</h3>
                        <span style={{ fontSize: '20px' }}>📉</span>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                        {stats.priceDrops}
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        Active deals now
                    </p>
                </div>

                {/* Total Saved Card */}
                <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Saved</h3>
                        <span style={{ fontSize: '20px' }}>🛒</span>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                        ${stats.totalSaved}
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        This year
                    </p>
                </div>

                {/* Games Tracked Card */}
                <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Games Tracked</h3>
                        <span style={{ fontSize: '20px' }}>⭐</span>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                        {stats.gamesTracked}
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        All time
                    </p>
                </div>
            </div>

            {/* User Info Card */}
            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '30px'
            }}>
                <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#1f2937' }}>
                    Your Profile
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px'
                }}>
                    <div>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Email</p>
                        <p style={{ fontSize: '16px', color: '#1f2937', margin: 0, fontWeight: '500' }}>{user.email}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Role</p>
                        <p style={{ fontSize: '16px', color: '#1f2937', margin: 0, fontWeight: '500' }}>
                            {user.role.toUpperCase()}
                        </p>
                    </div>
                    <div>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Status</p>
                        <p style={{
                            fontSize: '16px',
                            color: user.status === 'active' ? '#10b981' : '#ef4444',
                            margin: 0,
                            fontWeight: '500',
                            textTransform: 'capitalize'
                        }}>
                            {user.status}
                        </p>
                    </div>
                    <div>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Purchases</p>
                        <p style={{ fontSize: '16px', color: '#1f2937', margin: 0, fontWeight: '500' }}>
                            {user.purchase}
                        </p>
                    </div>
                </div>
            </div>

            {/* Placeholder for Future Features */}
            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                color: '#6b7280'
            }}>
                <p style={{ margin: 0 }}>More features coming soon: Price Drops, Recently Viewed, Recommendations</p>
            </div>
        </div>
    );
};
