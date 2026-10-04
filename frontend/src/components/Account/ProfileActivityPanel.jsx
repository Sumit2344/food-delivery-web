import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthSession from '../../hooks/useAuthSession'
import { addProfileBookmark, getProfileData, getRestaurants, removeProfileBookmark, submitRestaurantReview } from '../../services/api'
import css from './AccountFeaturePage.module.css'

export default function ProfileActivityPanel({ kind }) {
  const { user, loggedIn } = useAuthSession()
  const [profile, setProfile] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [restaurantId, setRestaurantId] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loggedIn) return
    getProfileData().then(({ profile: data }) => setProfile(data)).catch((requestError) => setError(requestError.message))
    if (kind === 'reviews') {
      getRestaurants().then(setRestaurants).catch((requestError) => setError(requestError.message))
    }
  }, [loggedIn, kind])

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await submitRestaurantReview({ restaurantId, rating: Number(rating), text })
      setProfile((current) => ({ ...current, reviews: result.reviews }))
      setText('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const removeBookmark = async (id) => {
    try {
      const result = await removeProfileBookmark(id)
      setProfile((current) => ({ ...current, bookmarks: result.bookmarks }))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (!loggedIn) return <div className={css.card}>Sign in to view your {kind}. <Link to="/">Go to sign in</Link></div>
  if (!profile) return <div className={css.card}>{error || 'Loading your account activity…'}</div>

  return <section className={css.list}>
    {error && <p className={css.error} role="alert">{error}</p>}
    {kind === 'reviews' && <form className={css.card} onSubmit={submit}>
      <strong>Write a restaurant review</strong>
      <label className={css.field}>Restaurant
        <select required value={restaurantId} onChange={(event) => setRestaurantId(event.target.value)}>
          <option value="">Choose a restaurant</option>
          {restaurants.map((restaurant) => <option key={restaurant.id} value={restaurant.id}>{restaurant.name} · {restaurant.city}</option>)}
        </select>
      </label>
      <label className={css.field}>Rating
        <select value={rating} onChange={(event) => setRating(event.target.value)}>
          {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} star{value === 1 ? '' : 's'}</option>)}
        </select>
      </label>
      <label className={css.field}>Your review
        <textarea required minLength={5} maxLength={1000} value={text} onChange={(event) => setText(event.target.value)} placeholder="Share what you liked (or what could be better)." />
      </label>
      <button className={css.button} disabled={busy || !restaurantId}>{busy ? 'Submitting…' : 'Submit review'}</button>
    </form>}
    {kind === 'reviews' && (profile.reviews || []).map((review) => <article className={css.card} key={review.id}>
      <div className={css.cardTop}><strong>{review.restaurantName}</strong><time>{new Date(review.createdAt).toLocaleDateString()}</time></div>
      <p>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} · {review.city}</p>
      <p>{review.text}</p>
    </article>)}
    {kind === 'bookmarks' && (profile.bookmarks || []).map((bookmark) => <article className={`${css.card} ${css.person}`} key={bookmark.id}>
      <div><strong>{bookmark.name}</strong><p>{[bookmark.cuisine, bookmark.city].filter(Boolean).join(' · ')}</p></div>
      <div className={css.actions}><a className={css.link} href={bookmark.url}>Open restaurant</a><button className={css.textButton} onClick={() => removeBookmark(bookmark.id)}>Remove</button></div>
    </article>)}
    {kind === 'reviews' && !profile.reviews?.length && <div className={css.card}>No reviews yet. Add your first review above.</div>}
    {kind === 'bookmarks' && !profile.bookmarks?.length && <div className={css.card}>No saved restaurants yet. Use “Save restaurant” on a restaurant page to add one.</div>}
  </section>
}
