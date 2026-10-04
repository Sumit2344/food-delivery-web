import { useState } from 'react';
import { createPortal } from 'react-dom';

const closeBtn = '/images/closeBtn.jpg';
import signupCss from './Signup.module.css';
import { registerUser } from '../../../services/api';
import { saveAuthSession } from '../../../hooks/useAuthSession';

let Signup = ({ setAuth }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submitSignup = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const session = await registerUser({ name, email, password });
            saveAuthSession(session);
            setAuth({ closed: true, login: false, signup: false });
        } catch (signupError) {
            setError(signupError.message || 'Unable to create your account right now.');
        } finally {
            setLoading(false);
        }
    };

    const loginDiv = <div className={signupCss.outerDiv}>
        <div className={signupCss.modal}>
            <div className={signupCss.header}>
                <span className={signupCss.ttl}>Create account</span>
                <span className={signupCss.closeBtn} onClick={() => setAuth({ closed: true, login: false, signup: false })}>
                    <img className={signupCss.closeBtnImg} src={closeBtn} alt="close button" />
                </span>
            </div>
            <form className={signupCss.lgBox} onSubmit={submitSignup}>
                <label className={signupCss.fieldLabel} htmlFor="signup-name">Full name</label>
                <input id="signup-name" className={signupCss.inpBox} type="text" autoComplete="name" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} minLength="2" maxLength="100" required />
                <label className={signupCss.fieldLabel} htmlFor="signup-email">Email</label>
                <input id="signup-email" className={signupCss.inpBox} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                <label className={signupCss.fieldLabel} htmlFor="signup-password">Password</label>
                <input id="signup-password" className={signupCss.inpBox} type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} minLength="8" maxLength="128" required />
                <span className={signupCss.termsTxt}>
                    <input type="checkbox" name="acceptTerms" id="acceptTerms" className={signupCss.checkBox} checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required />
                    <span>
                        I agree to the Terms of Service and Privacy Policy.
                    </span>
                </span>
                {error ? <div className={signupCss.errorText} role="alert">{error}</div> : null}
                <button className={signupCss.btn} type="submit" disabled={loading || !acceptedTerms}>{loading ? 'Creating account...' : 'Create account'}</button>
            </form>
            <hr className={signupCss.break} />
            <div className={signupCss.newToZomato}>Already have an account? <div className={signupCss.createAcc} onClick={() => setAuth({ closed: false, login: true, signup: false })} >Sign in</div></div>
        </div>
    </div>
    return createPortal(loginDiv, document.getElementById('modal'));
}

export default Signup;