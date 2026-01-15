import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/apis/users';
import type { UserResponse } from '../../interfaces/user.interface';

export const UserDashboard = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const navigate = useNavigate();

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

    // Placeholder data for price drops
    const priceDrops = [
        { id: '1', title: 'Cyberpunk 2077', oldPrice: 59.99, newPrice: 29.99, discount: 50, image: 'https://via.placeholder.com/80', timeAgo: '2 hours ago' },
        { id: '2', title: 'Elden Ring', oldPrice: 59.99, newPrice: 19.99, discount: 67, image: 'https://via.placeholder.com/80', timeAgo: '5 hours ago' },
        { id: '3', title: 'The Witcher 3', oldPrice: 39.99, newPrice: 9.99, discount: 75, image: 'https://via.placeholder.com/80', timeAgo: '1 day ago' },
    ];

    // Placeholder data for recently viewed
    const recentlyViewed = [
        { id: '1', title: 'Baldur\'s Gate 3', genre: ['RPG', 'Fantasy'], image: 'https://via.placeholder.com/300x169' },
        { id: '2', title: 'Starfield', genre: ['RPG', 'Sci-Fi'], image: 'https://via.placeholder.com/300x169' },
        { id: '3', title: 'Hogwarts Legacy', genre: ['Action', 'Adventure'], image: 'https://via.placeholder.com/300x169' },
    ];

    // Placeholder data for recommendations
    const recommendedGames = [
        { id: '1', title: 'Red Dead Redemption 2', rating: 4.5, price: 24.99, image: 'https://via.placeholder.com/300x169' },
        { id: '2', title: 'God of War', rating: 5, price: 19.99, image: 'https://via.placeholder.com/300x169' },
        { id: '3', title: 'Horizon Zero Dawn', rating: 4.5, price: 14.99, image: 'https://via.placeholder.com/300x169' },
    ];

    return (
        <div style={{
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: '0 auto',
            background: '#f5f5f5',
            minHeight: '100vh'
        }}>
            {/* Header with Back Button */}
            <div style={{ 
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
            }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#1f2937' }}>
                        Dashboard
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '16px' }}>
                        Welcome back, {user.name}! Here's what's new
                    </p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '10px 20px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                >
                    <span>←</span> Back to Home
                </button>
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

            {/* Two Column Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px',
                marginBottom: '30px'
            }}>
                {/* Recent Price Drops */}
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
                        marginBottom: '20px'
                    }}>
                        <h2 style={{ fontSize: '20px', color: '#1f2937', margin: 0 }}>Recent Price Drops</h2>
                        <button
                            style={{
                                padding: '6px 12px',
                                background: 'transparent',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                color: '#6b7280'
                            }}
                        >
                            View All
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {priceDrops.map((drop) => (
                            <div
                                key={drop.id}
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: '#f9fafb',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#f9fafb'}
                            >
                                <img
                                    src={drop.image}
                                    alt={drop.title}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '8px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        color: '#1f2937',
                                        margin: '0 0 8px 0',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {drop.title}
                                    </h4>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '4px'
                                    }}>
                                        <span style={{
                                            fontSize: '14px',
                                            color: '#9ca3af',
                                            textDecoration: 'line-through'
                                        }}>
                                            ${drop.oldPrice}
                                        </span>
                                        <span style={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#10b981'
                                        }}>
                                            ${drop.newPrice}
                                        </span>
                                        <span style={{
                                            padding: '2px 8px',
                                            background: '#dcfce7',
                                            color: '#16a34a',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                        }}>
                                            -{drop.discount}%
                                        </span>
                                    </div>
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#9ca3af',
                                        margin: 0
                                    }}>
                                        {drop.timeAgo}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Favorite Store Performance */}
                <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '20px', color: '#1f2937', margin: '0 0 8px 0' }}>
                        Favorite Store Performance
                    </h2>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 20px 0' }}>
                        Steam - Your preferred store
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Progress Bar 1 */}
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '8px'
                            }}>
                                <span style={{ fontSize: '14px', color: '#1f2937' }}>Best deals this month</span>
                                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>87%</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: '#e5e7eb',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '87%',
                                    height: '100%',
                                    background: '#3b82f6',
                                    borderRadius: '4px'
                                }} />
                            </div>
                        </div>
                        {/* Progress Bar 2 */}
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '8px'
                            }}>
                                <span style={{ fontSize: '14px', color: '#1f2937' }}>Price competitiveness</span>
                                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>72%</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: '#e5e7eb',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '72%',
                                    height: '100%',
                                    background: '#10b981',
                                    borderRadius: '4px'
                                }} />
                            </div>
                        </div>
                        {/* Progress Bar 3 */}
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '8px'
                            }}>
                                <span style={{ fontSize: '14px', color: '#1f2937' }}>Games availability</span>
                                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>95%</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: '#e5e7eb',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '95%',
                                    height: '100%',
                                    background: '#f59e0b',
                                    borderRadius: '4px'
                                }} />
                            </div>
                        </div>
                    </div>
                    <button
                        style={{
                            width: '100%',
                            marginTop: '20px',
                            padding: '10px',
                            background: 'transparent',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#1f2937'
                        }}
                    >
                        Change Favorite Store
                    </button>
                </div>
            </div>

            {/* Recently Viewed */}
            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '30px'
            }}>
                <h2 style={{ fontSize: '20px', color: '#1f2937', margin: '0 0 20px 0' }}>
                    Recently Viewed
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px'
                }}>
                    {recentlyViewed.map((game) => (
                        <div
                            key={game.id}
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                marginBottom: '12px',
                                background: '#e5e7eb'
                            }}>
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                            <h4 style={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#1f2937',
                                margin: '0 0 8px 0'
                            }}>
                                {game.title}
                            </h4>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {game.genre.slice(0, 2).map((genre, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            padding: '4px 8px',
                                            background: '#f3f4f6',
                                            color: '#6b7280',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommended for You */}
            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '30px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '20px'
                }}>
                    <div>
                        <h2 style={{ fontSize: '20px', color: '#1f2937', margin: '0 0 4px 0' }}>
                            Recommended for You
                        </h2>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            Based on your purchase history and wishlist
                        </p>
                    </div>
                    <button
                        style={{
                            padding: '6px 12px',
                            background: 'transparent',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: '#6b7280'
                        }}
                    >
                        Refresh
                    </button>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px'
                }}>
                    {recommendedGames.map((game) => (
                        <div
                            key={game.id}
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                marginBottom: '12px',
                                background: '#e5e7eb'
                            }}>
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                            <h4 style={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#1f2937',
                                margin: '0 0 8px 0'
                            }}>
                                {game.title}
                            </h4>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                fontSize: '14px',
                                                color: i < Math.floor(game.rating) ? '#f59e0b' : '#d1d5db'
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#10b981'
                                }}>
                                    ${game.price}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Info Card */}
            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
        </div>
    );
};
