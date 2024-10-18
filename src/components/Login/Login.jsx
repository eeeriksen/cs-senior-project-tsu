import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../../store'
import { Logo } from '../Icons/Logo'
import { collegeByEmail } from '../../consts/collegeByEmail'
import './Login.css'

const apiUrl = import.meta.env.VITE_API_URL;

export function Login({ login, errorLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setUser, setSearchSelectedItem } = useStore(
        useShallow((state) => ({
            setUser: state.setUser,
            searchSelectedItem: state.searchSelectedItem,
            setSearchSelectedItem: state.setSearchSelectedItem,
        }))
    );

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const response = await fetch(`${apiUrl}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (response.status === 200) {
                const { domain } = data.user
                const selectedEmailDomain = collegeByEmail[domain]

                if (selectedEmailDomain !== "") {
                    setSearchSelectedItem(selectedEmailDomain)
                }
                setSuccess(true)
                setUser(data.user);
                navigate("/")
            } else {
                setError(data.message)
            }
        } catch (err) {
            setError('Error: ' + err)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e)
        }
    }

    return (
        <div className="login-box">
            <Logo />
            <form className="login-form" onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={(e) => handleKeyUp(e)}
                />
                <button disabled={loading} type='submit'>Login</button>
                {error && <p className="error-text">{error}</p>}
            </form>
            <p className="signup-text">Don't have an account? <Link className="signup-link" to="/signup">Sign up</Link></p>
        </div>
    )
}
