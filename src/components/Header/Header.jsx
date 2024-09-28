import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../../store'
import { Logo } from '../Icons/Logo'
import { Search } from '../Search'
import './Header.css'

export function Header() {
    const location = useLocation()
    const { user, setUser } = useStore(
        useShallow((state) => ({
            user: state.user,
            setUser: state.setUser,
        }))
    );

    const handleLogout = () => {
        setUser(null)
    }

    const isSignup = location.pathname !== '/signup'
    const isLogin = location.pathname !== '/login'

    const buttons = !user && !isSignup ? (
        <Link to='/login'>
            <button tabIndex="-1" className="login-button">Log in</button>
        </Link>
    ) : (
        <>
            <Link to='/signup'>
                <button tabIndex="-1" className="signup-button">Sign up</button>
            </Link>
        </>
    )

    return (
        <header>
            <div className="header-box">
                <Link
                    className="logo-link"
                    style={{ textDecoration: 'none', color: '#000' }}
                    to='/'
                >
                    <div className="logo">
                        <Logo />
                        <span className="campus-text">campus</span>
                        <span className="voices-text">voices</span>
                    </div>
                </Link>
                <nav className="nav">
                    <Link to='/'>Home</Link>
                    {user && <Link to={`/user/${user.username}/posts`}>My Posts</Link>}
                </nav>
                <Search />
                {user ? (
                    <button className="signup-button" onClick={handleLogout}>Log out</button>
                ) : (
                    <div className="buttons">
                        {isLogin && (
                            <Link to='/login'>
                                <button tabIndex="-1" className="login-button">Log in</button>
                            </Link>
                        )}
                        {isSignup && (
                            <Link to='/signup'>
                                <button tabIndex="-1" className="signup-button">Sign up</button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </header>
    )
}
