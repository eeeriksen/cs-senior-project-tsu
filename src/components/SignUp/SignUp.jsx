import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Logo } from '../Icons/Logo'
import { Eye } from '../Icons/Eye'
import { EyeOff } from '../Icons/EyeOff'
import { collegeByEmail } from '../../consts/collegeByEmail';
import './SignUp.css'

export function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!username || !email || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        const domain = email.split('@')[1];

        if (!Object.keys(collegeByEmail).includes(domain)) {
            setError('Sign up with a valid academic email.');
            setLoading(false);
            return;
        }

        if (password.length < 8 || !password.match(/[a-zA-Z]/) || !password.match(/[0-9]/)) {
            setError('Password does not match the required format.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.status === 201) {
                setSuccess(true);
                setUsername('');
                setEmail('');
                setPassword('');
                setLoading(false);
                toast(data.message);
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }
    };

    return (
        <div className="signup-box">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h1>Create your account</h1>
                <p className="aknowledge">By clicking “Sign up”, you agree to our <Link to="/term-of-service">terms of service</Link> and acknowledge you have read our <Link to="/privacy-policy">privacy policy</Link>.
                </p>
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <div className="password-input-container">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={toggleShowPassword}
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                </div>
                <p className="password-rules">Must contain 8+ characters, including at least 1 letter and 1 number.</p>
                <button className="signup-submit-button" disable={`${loading}`} type="submit">Sign Up</button>
                {error && <p className="error-text">{error}</p>}
                {success && <p>Registration successful! Please log in.</p>}
            </form>
            <p className="login-text">Already have an account? <Link className="login-link" to="/login">Log in</Link></p>
        </div>
    );
}
