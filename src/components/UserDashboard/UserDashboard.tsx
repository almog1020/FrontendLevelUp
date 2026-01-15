import { useEffect, useState, useContext } from 'react';
import { getCurrentUser } from '../../services/apis/users';
import type { UserResponse } from '../../interfaces/user.interface';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider/AuthProvider';

export const UserDashboard = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    useEffect(() => {
        getCurrentUser()
            .then(data => setUserData(data))
            .catch(err => {
                console.error(err);
                // If unauthorized, clear token and redirect to login
                if (err.message.includes('Unauthorized')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            });
    }, []);

    if (loading) {
        return (
            <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                fontSize: '18px' 
            }}>
                Loading your dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                color: '#ef4444',
                fontSize: '16px'
            }}>
                Error: {error}
            </div>
        );
    }

    if (!user) return <div style={{padding: '20px'}}>No user found</div>;

    // Format the joined date
    const joinedDate = new Date(user.joined).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div>
            {/* Navigation Bar */}
            <nav style={{
                background: '#1f2937',
                padding: '15px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold'
                }}>
                    LevelUp
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#374151'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => navigate('/user')}
                        style={{
                            background: '#3b82f6',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontWeight: '500'
                        }}
                    >
                        Dashboard
                    </button>
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => navigate('/admin/management')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '16px',
                                padding: '8px 16px',
                                borderRadius: '6px'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#374151'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            Admin Panel
                        </button>
                    )}
                    <button
                        onClick={() => auth?.logOut()}
                        style={{
                            background: '#ef4444',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontWeight: '500'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div style={{
                padding: '40px',
                fontFamily: 'Arial, sans-serif',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
            <h1 style={{ 
                fontSize: '32px', 
                marginBottom: '30px',
                color: '#1f2937'
            }}>
                Welcome, {user.name}! 👋
            </h1>

            {/* Main Info Card */}
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}>
                <h2 style={{ 
                    fontSize: '20px', 
                    marginBottom: '20px',
                    color: '#374151',
                    borderBottom: '2px solid #e5e7eb',
                    paddingBottom: '10px'
                }}>
                    Profile Information
                </h2>
                
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px'
                }}>
                    <InfoItem label="User ID" value={`#${user.id}`} />
                    <InfoItem label="Full Name" value={user.name} />
                    <InfoItem label="Email Address" value={user.email} />
                    <InfoItem 
                        label="Account Type" 
                        value={user.role.toUpperCase()}
                        badge={true}
                        badgeColor={user.role === 'admin' ? '#fbbf24' : '#3b82f6'}
                    />
                </div>
            </div>

            {/* Account Status & Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
            }}>
                {/* Status Card */}
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ 
                        fontSize: '16px', 
                        color: '#6b7280',
                        marginBottom: '10px'
                    }}>
                        Account Status
                    </h3>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: user.status === 'active' ? '#10b981' : '#ef4444'
                        }} />
                        <span style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: user.status === 'active' ? '#10b981' : '#ef4444',
                            textTransform: 'capitalize'
                        }}>
                            {user.status}
                        </span>
                    </div>
                </div>

                {/* Purchases Card */}
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ 
                        fontSize: '16px', 
                        color: '#6b7280',
                        marginBottom: '10px'
                    }}>
                        Total Purchases
                    </h3>
                    <p style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        margin: 0
                    }}>
                        {user.purchase}
                    </p>
                </div>

                {/* Member Since Card */}
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ 
                        fontSize: '16px', 
                        color: '#6b7280',
                        marginBottom: '10px'
                    }}>
                        Member Since
                    </h3>
                    <p style={{
                        fontSize: '16px',
                        color: '#1f2937',
                        margin: 0,
                        fontWeight: '500'
                    }}>
                        {joinedDate}
                    </p>
                </div>
            </div>

            {/* Google Account Info */}
            {user.google_id && (
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <span style={{ fontSize: '24px' }}>🔗</span>
                    <div>
                        <h3 style={{ 
                            fontSize: '16px', 
                            margin: '0 0 5px 0',
                            color: '#374151'
                        }}>
                            Google Account Connected
                        </h3>
                        <p style={{ 
                            fontSize: '14px', 
                            color: '#6b7280',
                            margin: 0 
                        }}>
                            Your account is linked with Google Sign-In
                        </p>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

// Helper component for info items
const InfoItem = ({ 
    label, 
    value, 
    badge = false, 
    badgeColor = '#3b82f6' 
}: { 
    label: string; 
    value: string | number; 
    badge?: boolean;
    badgeColor?: string;
}) => (
    <div>
        <div style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '5px'
        }}>
            {label}
        </div>
        {badge ? (
            <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                background: badgeColor
            }}>
                {value}
            </span>
        ) : (
            <div style={{
                fontSize: '18px',
                color: '#1f2937',
                fontWeight: '500'
            }}>
                {value}
            </div>
        )}
    </div>
);
