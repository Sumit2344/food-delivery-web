import { useEffect, useMemo, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'

import css from './MenuComponent.module.css'
import { getRestaurants } from '../../../../../services/api'

const MenuComponent = () => {
  const { city, hotel } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [vegOnly, setVegOnly] = useState(false)
  const [cart, setCart] = useState([])
  const [openReview, setOpenReview] = useState(null)
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    getRestaurants(city, hotel)
      .then((data) => {
        if (cancelled) return
        if (!data) throw new Error('This restaurant could not be found.')
        setRestaurant(data)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        setErrorMessage(error.message || 'Unable to load this restaurant menu.')
        setStatus('error')
      })

    try {
      const savedCart = JSON.parse(window.localStorage.getItem('tomato_cart') || '[]')
      setCart(Array.isArray(savedCart)
        ? savedCart.map((item) => item.restaurantId ? item : { ...item, restaurantId: 'paraside', restaurantSlug: 'paraside', restaurantName: 'Paraside' })
        : [])
    } catch {
      setCart([])
    }

    return () => {
      cancelled = true
    }
  }, [city, hotel])

  const menuItems = restaurant?.menu || []
  const categories = useMemo(
    () => ['All', ...new Set(menuItems.map((item) => item.category || 'Recommended'))],
    [menuItems]
  )
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return menuItems.filter((item) => {
      const matchesSearch = !query || `${item.name} ${item.description || ''} ${item.category || ''}`.toLowerCase().includes(query)
      const matchesCategory = category === 'All' || (item.category || 'Recommended') === category
      const matchesDiet = !vegOnly || item.type === 'veg'
      return matchesSearch && matchesCategory && matchesDiet
    })
  }, [menuItems, search, category, vegOnly])

  const cartCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0)
  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0)
  const cartIsForThisRestaurant = !cart.length || cart.every((item) => item.restaurantId === (restaurant?.id || hotel) || item.restaurantSlug === hotel)

  const addToCart = (item) => {
    const belongsToAnotherRestaurant = cart.length && !cartIsForThisRestaurant
    if (belongsToAnotherRestaurant && !window.confirm(`Your cart has items from ${cart[0].restaurantName || 'another restaurant'}. Clear it and start a ${restaurant.name} cart?`)) {
      return
    }

    const startingCart = belongsToAnotherRestaurant ? [] : cart
    const existing = startingCart.find((entry) => entry.id === item.id)
    const nextCart = existing
      ? startingCart.map((entry) => entry.id === item.id ? { ...entry, quantity: Number(entry.quantity || 1) + 1 } : entry)
      : [...startingCart, {
        ...item,
        ttl: item.name,
        quantity: 1,
        restaurantId: restaurant.id,
        restaurantSlug: hotel,
        restaurantName: restaurant.name
      }]

    setCart(nextCart)
    window.localStorage.setItem('tomato_cart', JSON.stringify(nextCart))
  }

  if (status === 'loading') {
    return <section className={css.outerDiv} aria-live="polite"><p className={css.status}>Loading {hotel} menu…</p></section>
  }

  if (status === 'error') {
    return <section className={css.outerDiv} role="alert"><p className={css.error}>{errorMessage}</p></section>
  }

  return (
    <section className={css.outerDiv}>
      <header className={css.header}>
        <div>
          <p className={css.eyebrow}>Made fresh, delivered to you</p>
          <h1 className={css.ttl}>{restaurant.name} Menu</h1>
          <p className={css.subtitle}>{restaurant.cuisine} <span>·</span> {restaurant.deliveryTime || '30 min'} delivery</p>
        </div>
        <NavLink className={css.orderLink} to={`/${city}/${hotel}/order`}>Order online</NavLink>
      </header>

      <div className={css.toolbar}>
        <label className={css.searchBox}>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search dishes, ingredients…"
            aria-label="Search menu"
          />
        </label>
        <label className={css.vegToggle}>
          <input type="checkbox" checked={vegOnly} onChange={(event) => setVegOnly(event.target.checked)} />
          <span>Veg only</span>
        </label>
      </div>

      <nav className={css.categories} aria-label="Menu categories">
        {categories.map((item) => (
          <button
            className={category === item ? css.categoryActive : css.category}
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className={css.menuHeading}>
        <h2>{category === 'All' ? 'Fan favorites' : category}</h2>
        <span>{filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}</span>
      </div>

      {filteredItems.length ? (
        <div className={css.menuGrid}>
          {filteredItems.map((item) => (
            <article className={css.dishCard} key={item.id}>
              <div className={css.dishTopline}>
                <span className={item.type === 'veg' ? css.vegBadge : css.nonVegBadge}>
                  {item.type === 'veg' ? 'VEG' : 'NON-VEG'}
                </span>
                {item.popular ? <span className={css.popular}>Popular</span> : null}
              </div>
              <h3>{item.name}</h3>
              <div className={css.ratingLine}>
                <span>★ {Number(item.rating || 4.2).toFixed(1)}</span>
                <span>{item.reviewCount || 0} {Number(item.reviewCount) === 1 ? 'review' : 'reviews'}</span>
              </div>
              <p className={css.description}>{item.description || 'Prepared fresh with ingredients selected by our kitchen.'}</p>
              <button
                className={css.reviewToggle}
                type="button"
                onClick={() => setOpenReview(openReview === item.id ? null : item.id)}
                aria-expanded={openReview === item.id}
              >
                {openReview === item.id ? 'Hide review' : `Read ${item.reviewCount || 0} review${Number(item.reviewCount) === 1 ? '' : 's'}`}
              </button>
              {openReview === item.id ? (
                <blockquote className={css.review}>
                  <span>Sample diner · ★ {Number(item.reviews?.[0]?.rating || item.rating || 4.2).toFixed(1)}</span>
                  {item.reviews?.[0]?.text || 'No written reviews yet. Be the first to review this dish after ordering.'}
                  <small>Example review for this demo menu</small>
                </blockquote>
              ) : null}
              <div className={css.dishFooter}>
                <strong>₹{Number(item.price || 0)}</strong>
                <button className={css.addButton} type="button" onClick={() => addToCart(item)}>Add +</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={css.emptyState}>
          <strong>No dishes match those filters</strong>
          <span>Try another search or switch off Veg only.</span>
        </div>
      )}

      {cartCount > 0 ? (
        <aside className={css.cartBar} aria-live="polite">
          <div>
            <strong>{cartIsForThisRestaurant ? `${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart` : `Cart belongs to ${cart[0].restaurantName || 'another restaurant'}`}</strong>
            <span>₹{cartTotal} before delivery</span>
          </div>
          <NavLink to={`/${city}/${cartIsForThisRestaurant ? hotel : (cart[0].restaurantSlug || cart[0].restaurantId)}/order`}>
            {cartIsForThisRestaurant ? 'Review order' : 'Review that cart'} <span aria-hidden="true">→</span>
          </NavLink>
        </aside>
      ) : null}
    </section>
  )
}

export default MenuComponent
