import { useState } from 'react';
import { Link } from 'react-router-dom'

const close = '/icons/close.png';
import css from './MobileNavbar.module.css';

import Login from '../../Auth/Login/Login'
import Signup from '../../Auth/Signup/Signup'
import useAuthSession from '../../../hooks/useAuthSession'

let MobileNavbar = ({ toogleMenu, setToggleMenu }) => {
    const { loggedIn, user, logout } = useAuthSession();
    let [auth, setAuth] = useState({
        closed: true,
        login: false,
        signup: false
    });

    return <>
    <div className={css.mobileMenu}>
        <div className={css.menu}>
            <img className={css.menuBar} src={close} alt='menu bar' onClick={() => setToggleMenu(val => !val)} />
            <Link className={css.title} to='/'>Tomato</Link>
        </div>
        <div className={css.navbar}>
            <Link to='/add-restaurant' className={css.menuItem} >Add restuarant</Link>
            {loggedIn ? (
                <>
                    <div className={css.menuItem}>{user?.name || 'Profile'}</div>
                    <div className={css.menuItem} onClick={logout}>Log out</div>
                </>
            ) : (
                <>
                    <div className={css.menuItem} onClick={() => setAuth({ closed: false, login: true, signup: false })}>Log in</div>
                    <div className={css.menuItem} onClick={() => setAuth({ closed: false, login: false, signup: true })}>Sign up</div>
                </>
            )}
        </div>
    </div>
    <div className={css.modals}>
        {auth?.login ? <Login setAuth={setAuth} /> : null}
        {auth?.signup ? <Signup setAuth={setAuth} /> : null}
    </div>
    </>
}

export default MobileNavbar;