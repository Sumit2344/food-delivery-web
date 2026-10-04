import { useState, useEffect } from 'react'

import css from './UserProfileNoData.module.css'

import {reviewPage, photosPage, followersPage, recentlyviewedPage, bookmarksPage, blogpostsPage, orderhistoryPage, myaddressPage, favoriteordersPage, bookingsPage} from '../../../../helpers/constants'

const photos = '/icons/nophotos.png';
const blogpost = '/icons/noblogposts.png';
const bookmarks = '/icons/nobookmarks.png';
const favorders = '/icons/nofavorders.png';
const reservations = '/icons/noreservations.png';
const followers = '/icons/nofollowers.png';
const UserProfileNoData = ({hashId}) => {

  let [page, setPage] = useState(photos)

  useEffect(() => {
    switch(hashId){
      case reviewPage: 
        setPage(photos)
        break;
      case photosPage: 
        setPage(photos)
        break;
      case followersPage: 
        setPage(followers)
        break;
      case recentlyviewedPage: 
        setPage(photos)
        break;
      case bookmarksPage: 
        setPage(bookmarks)
        break;
      case blogpostsPage: 
        setPage(blogpost)
        break;
      case orderhistoryPage: 
        setPage(reservations)
        break;
      case myaddressPage: 
        setPage(reservations)
        break;
      case favoriteordersPage: 
        setPage(favorders)
        break;
      default: null
    }
  }, [hashId]);

  return (
    <div className={css.outerDiv}>
        <div className={css.innerDiv}>
          <div className={css.imgBox}>
            <img src={page} className={css.img} />
            <div className={css.txt}>Nothing here yet!</div>
          </div>
        </div>
    </div>
  )
}

export default UserProfileNoData