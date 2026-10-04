import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../Navbars/NavigationBar2/NavigationBar2'
import Footer from '../Footer/Footer'
import useAuthSession from '../../hooks/useAuthSession'
import { followProfileUser, getProfileData, getProfileUsers, markProfileNotificationRead, saveNotificationSettings } from '../../services/api'
import css from './AccountFeaturePage.module.css'

const defaults = { push: true, email: false, whatsapp: false }

export default function AccountFeaturePage({ kind }) {
  const { userId } = useParams()
  const { user, loggedIn } = useAuthSession()
  const [profile, setProfile] = useState(null)
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [settings, setSettings] = useState(defaults)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loggedIn) return
    getProfileData()
      .then(({ profile: data }) => {
        setProfile(data)
        setSettings({ ...defaults, ...data.settings })
      })
      .catch((requestError) => setError(requestError.message))
  }, [loggedIn])

  useEffect(() => {
    if (!loggedIn || kind !== 'network') return
    getProfileUsers('', true).then(({ users: data }) => setUsers(data)).catch((requestError) => setError(requestError.message))
  }, [loggedIn, kind])

  const searchUsers = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const result = await getProfileUsers(query)
      setUsers(result.users)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const toggleFollow = async (person) => {
    setBusy(true)
    setError('')
    try {
      await followProfileUser(person.id, person.following)
      setUsers((current) => current.map((item) => item.id === person.id ? { ...item, following: !person.following } : item))
      setProfile((current) => current ? {
        ...current,
        following: person.following ? current.following.filter((id) => id !== person.id) : [...current.following, person.id]
      } : current)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const saveSettings = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await saveNotificationSettings(settings)
      setNotice('Your preferences have been saved.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const markRead = async (notification) => {
    try {
      const result = await markProfileNotificationRead(notification.id)
      setProfile((current) => ({ ...current, notifications: result.notifications }))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const titles = { notifications: 'Notifications', network: 'Your network', 'find-friends': 'Find friends', settings: 'Notification preferences' }
  const title = titles[kind] || 'Your account'

  return <div className={css.page}>
    <Navbar />
    <main className={css.main}>
      <h1>{title}</h1>
      <p className={css.intro}>{user ? `Signed in as ${user.name || user.email}` : 'Your account activity and preferences.'}</p>
      {!loggedIn ? <div className={css.card}>
        <p>Please sign in to view and manage your account.</p>
        <Link className={css.button} to="/">Go to sign in</Link>
      </div> : <>
        {error && <p className={css.error} role="alert">{error}</p>}
        {notice && <p className={css.notice} role="status">{notice}</p>}
        {kind === 'settings' && <form className={css.card} onSubmit={saveSettings}>
          <p>Choose which channels may send account and order updates.</p>
          {Object.entries({ push: 'Push notifications', email: 'Email updates', whatsapp: 'WhatsApp updates' }).map(([key, label]) =>
            <label className={css.setting} key={key}>
              <span>{label}</span>
              <input type="checkbox" checked={Boolean(settings[key])} onChange={(event) => setSettings((current) => ({ ...current, [key]: event.target.checked }))} />
            </label>
          )}
          <button className={css.button} type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save preferences'}</button>
        </form>}
        {kind === 'notifications' && <section className={css.list}>
          {profile?.notifications?.length ? profile.notifications.map((item) =>
            <article className={`${css.card} ${item.read ? '' : css.unread}`} key={item.id}>
              <div className={css.cardTop}><strong>{item.title}</strong><time>{new Date(item.createdAt).toLocaleString()}</time></div>
              <p>{item.message}</p>
              {!item.read && <button className={css.textButton} onClick={() => markRead(item)}>Mark as read</button>}
            </article>
          ) : <div className={css.card}>No notifications yet. Your order updates will appear here.</div>}
        </section>}
        {(kind === 'network' || kind === 'find-friends') && <section>
          {kind === 'find-friends' && <form className={css.search} onSubmit={searchUsers}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or email" minLength={2} />
            <button className={css.button} type="submit">Search</button>
          </form>}
          <div className={css.list}>
            {users.map((person) => <article className={`${css.card} ${css.person}`} key={person.id}>
              <div><strong>{person.name}</strong><p>{person.email}</p></div>
              <button className={css.button} disabled={busy} onClick={() => toggleFollow(person)}>{person.following ? 'Following · Unfollow' : 'Follow'}</button>
            </article>)}
            {!users.length && <div className={css.card}>{kind === 'network' ? 'You are not following anyone yet. Find people to connect with.' : 'Search for people by entering at least two characters.'}</div>}
          </div>
          {kind === 'network' && <Link className={css.link} to={`/user/${userId}/find-friends`}>Find people to follow</Link>}
        </section>}
      </>}
    </main>
    <Footer />
  </div>
}
