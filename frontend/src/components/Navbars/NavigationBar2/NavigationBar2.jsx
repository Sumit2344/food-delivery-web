import { useState } from 'react';
import { Link } from 'react-router-dom'

const mobileHand = '/icons/smartphone.png';
const menuBar = '/icons/menu.png';
const downArrow = '/icons/down-arrow.png';
const profilePic = '/images/profilepic.jpg';
import SearchBar from '../../../utils/SearchBar/SearchBar'
import Login from '../../Auth/Login/Login'
import Signup from '../../Auth/Signup/Signup'
import useAuthSession from '../../../hooks/useAuthSession'

import css from './NavigationBar2.module.css';

let NavigationBar = ({ toogleMenu, setToggleMenu }) => {
    let [menuDisplay, setMenuDisplay] = useState(false);
    const [auth, setAuth] = useState({ closed: true, login: false, signup: false });
    const { loggedIn, logout } = useAuthSession();

    const logoutHandler = () => {
        logout();
    }

    return <div className={css.navbar}>
        <img className={css.menuBar} src={menuBar} alt='menu bar' onClick={() => setToggleMenu(val => !val)} />
        <div className={css.navbarInner}>
            <div className={css.leftSide}>
                <Link to='/' className={css.appTxt}>Tomato</Link>
            </div>
            <div className={css.searchBar}>
                <SearchBar />
            </div>
            <div className={css.rightSide}>
                {loggedIn ? (<div className={css.menuItem}>
                    <div className={css.profile} onClick={() => setMenuDisplay(val => !val)}>
                        <img src={profilePic} alt="profile pic" className={css.profilePic} />
                        <div className={css.profileName}>Profile</div>
                        <img src={downArrow} alt="arrow" className={css.arrow} />
                    </div>
                    <div className={css.menu} style={{display: menuDisplay ? "block" : ""}}>
                    <Link to='/user/ll/reviews' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Profile
                            </div>
                        </Link>
                        <Link to='/user/ll/notifications' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Notifications
                            </div>
                        </Link>
                        <Link to='/user/ll/bookmarks' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Bookmarks
                            </div>
                        </Link>
                        <Link to='/user/ll/reviews' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Reviews
                            </div>
                        </Link>
                        <Link to='/user/ll/network' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Network
                            </div>
                        </Link>
                        <Link to='/user/ll/find-friends' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Find Friends
                            </div>
                        </Link>
                        <Link to='/user/ll/settings' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Settings
                            </div>
                        </Link>
                        <div className={css.menuItemLinkTxt} onClick={logoutHandler}>
                            <div className={css.menuItemLink}>
                                Logout
                            </div>
                        </div>
                    </div>
                </div>) : (<>
                    <div className={css.menuItem} onClick={() => setAuth({ closed: false, login: true, signup: false })}>Log in</div>
                    <div className={css.menuItem} onClick={() => setAuth({ closed: false, login: false, signup: true })}>Sign up</div>
                </>)}
            </div>
        </div>
        {auth.login ? <Login setAuth={setAuth} /> : null}
        {auth.signup ? <Signup setAuth={setAuth} /> : null}
    </div>
}

export default NavigationBar;