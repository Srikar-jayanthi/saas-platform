import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '', tenantSubdomain: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await authAPI.login(credentials);
            localStorage.setItem('token', res.data.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.data.user));
            navigate('/dashboard');
        } catch (err) {
            alert('Invalid credentials or subdomain');
        }
    };

    return (
        <div className="auth-card">
            <h2>Welcome Back</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Tenant Subdomain</label>
                    <input type="text" placeholder="your-org-subdomain" required 
                           onChange={e => setCredentials({...credentials, tenantSubdomain: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="john@example.com" required 
                           onChange={e => setCredentials({...credentials, email: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="••••••••" required 
                           onChange={e => setCredentials({...credentials, password: e.target.value})} />
                </div>
                <button type="submit">Sign In</button>
            </form>
            <Link to="/register" className="text-link">Need a new organization? Register</Link>
        </div>
    );
};

export default Login;