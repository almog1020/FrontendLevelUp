import { useState, useEffect } from 'react';
import styles from './Header.module.scss';
import { SignIn } from '../SignIn/SignIn';
import { ETLTrigger } from '../ETLTrigger/ETLTrigger';

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const cartItemCount = 0; // Mock cart count
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('authToken'));
    };

    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // Future: Implement search functionality - could trigger ETL with search term
  };

  const handleETLSuccess = () => {
    // Trigger a refresh of the homepage data
    setRefreshTrigger((prev) => prev + 1);
    // Dispatch custom event that Homepage can listen to
    window.dispatchEvent(new CustomEvent('games-refresh'));
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        {/* Logo and Branding */}
        <div className={styles.header__logo}>
          <div className={styles.header__logoIcon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div className={styles.header__branding}>
            <h1 className={styles.header__title}>LevelUp</h1>
            <p className={styles.header__tagline}>Compare & Save</p>
          </div>
        </div>

        {/* Search Bar */}
        <form className={styles.header__search} onSubmit={handleSearchSubmit}>
          <div className={styles.header__searchIcon}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <input
            type="text"
            className={styles.header__searchInput}
            placeholder="Search for games..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search for games"
          />
        </form>

        {/* Right Side Actions */}
        <div className={styles.header__actions}>
          {isAuthenticated && (
            <ETLTrigger 
              searchTerm={searchQuery || undefined}
              onSuccess={handleETLSuccess}
            />
          )}
          <button className={styles.header__cartButton} aria-label="Shopping cart">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartItemCount > 0 && (
              <span className={styles.header__cartBadge}>{cartItemCount}</span>
            )}
          </button>
          <SignIn />
        </div>
      </div>
    </header>
  );
};

