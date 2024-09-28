import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../../store'
import { Logo } from '../Icons/Logo'
import './Login.css'

export function Login({ login, errorLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const { user, setUser } = useStore(
        useShallow((state) => ({
            user: state.user,
            setUser: state.setUser,
        }))
    );

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const response = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (response.status === 200) {
                setSuccess(true)
                setUser({ username: data.user.username, ...data.user });
                navigate("/")
            } else {
                setError(data.message)
            }
        } catch (err) {
            setError('Error: ' + err)
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
                <button type='submit'>Login</button>
                {error && <p className="error-text">{error}</p>}
            </form>
            <p className="signup-text">Don't have an account? <Link className="signup-link" to="/signup">Sign up</Link></p>
        </div>
    )
}
