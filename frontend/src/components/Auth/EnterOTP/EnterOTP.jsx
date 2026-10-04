import { createPortal } from 'react-dom'

const closeBtn = '/images/closeBtn.jpg';
import css from './EnterOTP.module.css'

let EnterOTP = ({ setModal }) => {
    const domObj = <div className={css.outerDiv}>
        <div className={css.innerDiv}>
            <div className={css.header}>
                <div className={css.title}>Phone verification unavailable</div>
                <span className={css.closeBtn} onClick={() => setModal(false)}>
                    <img className={css.closeBtnImg} src={closeBtn} alt="close button" />
                </span>
            </div>
            <div className={css.body}>
                <div className={css.txt1}>SMS sign-in is not configured for this app. Use your email and password to sign in.</div>
                <button type="button" onClick={() => setModal(false)} className={css.okBtn}>Close</button>
            </div>
        </div>
    </div>

    return createPortal(domObj, document.getElementById('modal'));
}

export default EnterOTP;