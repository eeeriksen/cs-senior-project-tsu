import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Logo } from '../Icons/Logo'
import { Eye } from '../Icons/Eye'
import { EyeOff } from '../Icons/EyeOff'
import { collegeByEmail } from '../../consts/collegeByEmail';
import './SignUp.css'

const apiUrl = import.meta.env.VITE_API_URL;

export function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);

    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleVerifyEmail = async () => {
        setLoading(true);
        setError(null);
        // const domain = email.split('@')[1];

        // if (!Object.keys(collegeByEmail).includes(domain)) {
        //     setError('Please enter a valid academic email.');
        //     setLoading(false);
        //     return;
        // }

        try {
            const response = await fetch(`${apiUrl}/user/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Error sending verification email');
            }

            toast('Verification email sent. Please check your inbox.');
            setStep(2);
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/user/verify-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (data.success) {
                toast('Email verified successfully');
                setStep(3);
            } else {
                setError('Invalid verification code');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!username || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        if (password.length < 8 || !password.match(/[a-zA-Z]/) || !password.match(/[0-9]/)) {
            setError('Password does not match the required format.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/user/signup`, {
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
                toast(data.message);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Error: ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="signup-box">
            <form className="signup-form">
                <h1>Create your account</h1>
                <p className="email-verify">Your email is used solely to verify your university affiliation. It is not stored in our database.</p>

                {step === 1 && (
                    <>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="verify-button" type="button" onClick={handleVerifyEmail} disabled={loading}>
                            Verify Email
                        </button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <label>Verification Code</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button className="verify-button" type="button" onClick={handleVerifyCode} disabled={loading}>
                            Verify Code
                        </button>
                    </>
                )}
                {step === 3 && (
                    <>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        <p className="password-rules">Password must contain 8+ characters, including at least 1 letter and 1 number.</p>
                        <button className="signup-submit-button" disable={`${loading}`} onClick={handleSubmit}>Sign Up</button>
                        <p className="aknowledge">By clicking “Sign up”, you agree to our <Link to="/term-of-service">terms of service</Link> and acknowledge you have read our <Link to="/privacy-policy">privacy policy</Link>.
                        </p>
                    </>
                )}
                {error && <p className="error-text">{error}</p>}
                {success && <p>Registration successful! Please log in.</p>}
            </form>
            <p className="login-text">Already have an account? <Link className="login-link" to="/login">Log in</Link></p>
        </div>
    );
}
