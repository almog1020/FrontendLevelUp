import {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { SignIn } from '../SignIn/SignIn';
import { ETLTrigger } from '../ETLTrigger/ETLTrigger';
import { searchGames } from '../../services/apis/games';
import UserPopup from "../UserPopup/UserPopup.tsx";
import {AuthContext} from "../AuthProvider/AuthProvider.tsx";

export const Header = () => {

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const cartItemCount = 0; // Mock cart count
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const auth = useContext(AuthContext);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    
    if (!query) {
      // If empty, trigger normal refresh
      window.dispatchEvent(new CustomEvent('games-refresh'));
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchGames(query);
      
      // Dispatch search results event
      window.dispatchEvent(new CustomEvent('games-search', {
        detail: { results, query }
      }));
    } catch (error) {
      console.error('Search error:', error);
      // Dispatch error event
      window.dispatchEvent(new CustomEvent('games-search-error', {
        detail: { error: error instanceof Error ? error.message : 'Search failed' }
      }));
    } finally {
      setIsSearching(false);
    }
  };

  const handleETLSuccess = () => {
    console.log(refreshTrigger)
    // Trigger a refresh of the homepage data
    setRefreshTrigger((prev) => prev + 1);
    // Dispatch custom event that Homepage can listen to
    window.dispatchEvent(new CustomEvent('games-refresh'));
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        {/* Logo and Branding */}
        <div 
          className={styles.header__logo}
          onClick={() => {
            setSearchQuery(''); // Clear search query
            window.dispatchEvent(new CustomEvent('games-refresh')); // Reset homepage
            navigate('/');
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSearchQuery(''); // Clear search query
              window.dispatchEvent(new CustomEvent('games-refresh')); // Reset homepage
              navigate('/');
            }
          }}
          aria-label="Go to homepage"
        >
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
            placeholder={isSearching ? "Searching..." : "Search for games..."}
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={isSearching}
            aria-label="Search for games"
          />
        </form>

        {/* Navigation */}
        <nav className={styles.header__nav}>
          <button onClick={() => navigate('/')} className={styles.header__navLink}>Home</button>
          <button onClick={() => navigate('/catalog')} className={styles.header__navLink}>Catalog</button>
        </nav>

        {/* Right Side Actions */}
        <div className={styles.header__actions}>
          {auth?.token && (
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
          {auth?.user ? <UserPopup /> : <SignIn />}
        </div>
      </div>
    </header>
  );
};

