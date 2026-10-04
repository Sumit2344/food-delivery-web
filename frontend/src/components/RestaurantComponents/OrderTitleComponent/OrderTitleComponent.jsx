import React, { useEffect, useState } from 'react'

import css from './OrderTitleComponent.module.css'

import RatingUtil from '../../../utils/RestaurantUtils/RatingUtil/RatingUtil'
import { addProfileBookmark, getProfileData } from '../../../services/api'

const infoIcon = '/icons/info.png';
const OrderTitleComponent = ({ restaurant, fallbackName }) => {
  const restaurantName = restaurant?.name || fallbackName?.replace(/-/g, ' ') || 'Restaurant'
  const [saved, setSaved] = useState(false)
  const [bookmarkMessage, setBookmarkMessage] = useState('')

  useEffect(() => {
    if (!restaurant?.id || !localStorage.getItem('tomato_token')) return
    getProfileData()
      .then(({ profile }) => setSaved(profile.bookmarks.some((item) => item.id === String(restaurant.id))))
      .catch((error) => console.error('Unable to check saved restaurants', error))
  }, [restaurant?.id])

  const toggleBookmark = async () => {
    if (!localStorage.getItem('tomato_token')) {
      setBookmarkMessage('Sign in to save restaurants.')
      return
    }
    const city = String(restaurant?.city || 'hyderabad').toLowerCase().replace(/\s+/g, '-')
    const slug = restaurant?.slug || restaurant?.id
    try {
      await addProfileBookmark({
        id: restaurant.id,
        name: restaurantName,
        city: restaurant?.city,
        cuisine: restaurant?.cuisine,
        url: `/${city}/${slug}/order`
      })
      setSaved(true)
      setBookmarkMessage('Restaurant saved to your bookmarks.')
    } catch (error) {
      setBookmarkMessage(error.message)
    }
  }

  return <div className={css.outerDiv}>
    <div className={css.innerDiv}>
        <div className={css.left}>
            <div className={css.title}>{restaurantName}</div>
            <div className={css.specials}>{restaurant?.cuisine || 'Fresh food, made to order'}</div>
            <div className={css.address}>{restaurant?.city || fallbackName?.replace(/-/g, ' ')}</div>
            <div className={css.timings}>
                <span className={css.opORclo}>Delivery -</span>
                <span className={css.time}>{restaurant?.deliveryTime || '30 min'}</span>
                <span className={css.infoIconBox}>
                    <img className={css.infoIcon} src={infoIcon} />
                    <div className={css.infoTooltip}>
                        <div className={css.ttil}>Delivery estimate</div>
                        <div className={css.ttim}>Estimated time:<span className={css.ctim}>{restaurant?.deliveryTime || '30 min'}</span></div>
                    </div>
                </span>
            </div>
        </div>
        <div className={css.right}>
            {restaurant?.id && <div className={css.bookmarkBox}>
                <button className={css.bookmarkButton} type="button" onClick={toggleBookmark} aria-pressed={saved}>
                    {saved ? '♥ Saved' : '♡ Save restaurant'}
                </button>
                {bookmarkMessage && <span className={css.bookmarkMessage} role="status">{bookmarkMessage}</span>}
            </div>}
            {restaurant?.rating ? <RatingUtil rating={restaurant.rating} count={restaurant.reviewCount || ''} txt="Restaurant rating" /> : null}
        </div>
    </div>
  </div>
}

export default OrderTitleComponent