import { useState } from 'react';
import { createPortal } from 'react-dom';

const closeBtn = '/images/closeBtn.jpg';
import loginCss from './Login.module.css';
import { loginUser } from '../../../services/api';
import { saveAuthSession } from '../../../hooks/useAuthSession';

let Login = ({ setAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submitLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const session = await loginUser(email, password);
            saveAuthSession(session);
            setAuth({ closed: true, login: false, signup: false });
        } catch (loginError) {
            setError(loginError.message || 'Unable to sign in right now.');
        } finally {
            setLoading(false);
        }
    };

    const loginDiv = <div className={loginCss.outerDiv}>
        <div className={loginCss.modal}>
            <div className={loginCss.header}>
                <span className={loginCss.ttl}>Login</span>
                <span className={loginCss.closeBtn} onClick={() => setAuth({ closed: true, login: false, signup: false })}>
                    <img className={loginCss.closeBtnImg} src={closeBtn} alt="close button" />
                </span>
            </div>
            <form className={loginCss.lgBox} onSubmit={submitLogin}>
                <label className={loginCss.fieldLabel} htmlFor="login-email">Email</label>
                <input id="login-email" className={loginCss.phoneInp} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                <label className={loginCss.fieldLabel} htmlFor="login-password">Password</label>
                <input id="login-password" className={loginCss.phoneInp} type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                {error ? <div className={loginCss.errorText} role="alert">{error}</div> : null}
                <button className={`${loginCss.btn} ${loginCss.Sbtn}`} type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
            </form>
            <hr className={loginCss.break} />
            <div className={loginCss.newToZomato}>New to Tomato? <div className={loginCss.createAcc} onClick={() => setAuth({ closed: false, login: false, signup: true })}>Create Account</div></div>
        </div>
    </div>
    return createPortal(loginDiv, document.getElementById('modal'));
}

export default Login;