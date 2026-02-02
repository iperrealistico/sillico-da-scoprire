import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        // Secure comparison happens on the backend eventually, 
        // but for the UI session we'll just check it locally first
        // and let the API verify it on every request.
        if (password) {
            localStorage.setItem('admin_token', password);
            router.push('/admin');
        } else {
            setError('Inserire una password');
        }
    };

    return (
        <div className="login-container">
            <Head>
                <title>Admin Login - Sillico</title>
                <link rel="stylesheet" href="/css/style.css" />
                <style>{`
                    .login-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        background: var(--bg-color);
                        font-family: var(--font-main);
                    }
                    .login-card {
                        background: white;
                        padding: 2.5rem;
                        border-radius: var(--border-radius);
                        box-shadow: var(--shadow-lg);
                        width: 100%;
                        max-width: 400px;
                        text-align: center;
                    }
                    .login-card h1 {
                        font-family: var(--font-header);
                        color: var(--primary);
                        margin-bottom: 1.5rem;
                    }
                    .login-card input {
                        width: 100%;
                        padding: 0.8rem;
                        margin-bottom: 1rem;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    .error {
                        color: #dc3545;
                        margin-bottom: 1rem;
                        font-size: 0.9rem;
                    }
                `}</style>
            </Head>
            <div className="login-card">
                <h1>Area Riservata</h1>
                <p style={{ marginBottom: '1rem' }}>Inserisci la password segreta per accedere</p>
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        autoFocus
                    />
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Entra</button>
                </form>
            </div>
        </div>
    );
}
