import React, { useState } from 'react';
import { registerUser, loginUser } from './api';
import { useNavigate } from 'react-router-dom';
import './index.css';

function AuthPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegister) {
                await registerUser({ username, email, password });
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => setIsRegister(false), 2000);
            } else {
                const res = await loginUser({ email, password });
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            setMessage('Error: ' + (error.response?.data.message || 'Try again'));
        }
    };

    return (
        <div className="auth-container">
            <h2>Welcome to My E-Commerce Shop</h2>
            <p>To see the products, please login. If you don't have an account, register below.</p>
            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                )}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
            </form>
            <button className="switch-button" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AuthPage;