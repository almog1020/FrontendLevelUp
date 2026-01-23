import './App.css'
import {SignIn} from "./components/SignIn/SignIn.tsx";

function App() {
    /**
     * Development-only function to test Profile page without backend
     * Sets mock authentication data and navigates to profile page
     */
    const handleTestProfile = () => {
        localStorage.setItem("token", "test-token-for-profile-testing");
        localStorage.setItem("user", "Admin User");
        window.location.href = "/profile";
    };

    return (
        <>
            <SignIn/>
            {/* Development testing button - only visible when not logged in */}
            {!localStorage.getItem("token") && import.meta.env.DEV && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999
                }}>
                    <button 
                        onClick={handleTestProfile}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                    >
                        🧪 Test Profile Page
                    </button>
                </div>
            )}
        </>
    )
}

export default App
