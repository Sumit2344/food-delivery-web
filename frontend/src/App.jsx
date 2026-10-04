import { useEffect, useState } from 'react'
import HomePageBanner from './components/HomeComponents/HomePageBanner/HomePageBanner'
import SmallCard from './utils/Cards/card1/SmallCard'
import Collections from './components/HomeComponents/Collections/Collections'
import PopularPlaces from './components/HomeComponents/PopularPlaces/PopularPlaces'
import GetTheApp from './components/HomeComponents/GetTheApp/GetTheApp'
import ExploreOptionsNearMe from './components/HomeComponents/ExploreOptionsNearMe/ExploreOptionsNearMe'
import Footer from './components/Footer/Footer'

const orderOnlineImg = '/images/orderonline.jpg';
const diningoutImg = '/images/diningout.jpg';
const proandproplusImg = '/images/proandproplus.jpg';
const nightlifeandclubsImg = '/images/nightlifeandclubs.jpg';
import css from './App.module.css'

import { orderOnlinePage, diningOutPage, proAndProPlusPage, nightLifePage } from './helpers/constants';
import { getNearbyRestaurants, getRestaurants } from './services/api';

function App() {
  const [nearbyRestaurants, setNearbyRestaurants] = useState([])
  const [locationStatus, setLocationStatus] = useState('Finding restaurants around you...')
  const [restaurants, setRestaurants] = useState([])
  const [restaurantError, setRestaurantError] = useState('')
  const [selectedCity, setSelectedCity] = useState('All cities')
  const [restaurantSearch, setRestaurantSearch] = useState('')
  const cities = [...new Set(restaurants.map((restaurant) => restaurant.city).filter(Boolean))].sort()
  const visibleRestaurants = restaurants.filter((restaurant) => {
    const matchesCity = selectedCity === 'All cities' || restaurant.city === selectedCity
    const query = restaurantSearch.trim().toLowerCase()
    const matchesSearch = !query || [
      restaurant.name,
      restaurant.city,
      restaurant.cuisine,
      ...(restaurant.menu || []).map((item) => `${item.name} ${item.category}`),
    ].some((value) => String(value || '').toLowerCase().includes(query))
    return matchesCity && matchesSearch
  })

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .catch((error) => {
        console.error('Failed to load restaurant directory', error)
        setRestaurantError(error.message || 'Unable to load restaurants right now.')
      })

    if (!navigator.geolocation) {
      setLocationStatus('Location is unavailable. Browse restaurants by city below.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getNearbyRestaurants(position.coords.latitude, position.coords.longitude, 10)
          setNearbyRestaurants(data)
          setLocationStatus(data.length ? 'Restaurants near you' : 'No restaurants found nearby')
        } catch (error) {
          console.error('Failed to load nearby restaurants', error)
          setLocationStatus('Unable to fetch nearby restaurants right now.')
        }
      },
      () => {
        setLocationStatus('Location access is off. Browse restaurants by city below.')
      }
    )
  }, [])

  return <>
    <HomePageBanner />
    <div className={css.bodySize}>
      <div className={css.chooseTypeCards}>
        <SmallCard imgSrc={orderOnlineImg} text="Order Online" link={"/show-case?page=" + orderOnlinePage} />
        <SmallCard imgSrc={diningoutImg} text="Dining Out" link={'/show-case?page=' + diningOutPage} />
        <SmallCard imgSrc={proandproplusImg} text="Pro and Pro Plus" link={'/show-case?page=' + proAndProPlusPage} />
        <SmallCard imgSrc={nightlifeandclubsImg} text="Night Life and Clubs" link={'/show-case?page=' + nightLifePage} />
      </div>

      <section className={css.nearbySection}>
        <div className={css.nearbyHeader}>
          <h3>Nearby Restaurants</h3>
          <span>{locationStatus}</span>
        </div>
        <div className={css.nearbyGrid}>
          {nearbyRestaurants.length ? nearbyRestaurants.map((restaurant) => (
            <a key={restaurant.id || restaurant.slug} className={css.nearbyCard} href={`/${String(restaurant.city || 'hyderabad').toLowerCase()}/${restaurant.slug || restaurant.id}/order`}>
              <img src={restaurant.image || orderOnlineImg} alt={restaurant.name} />
              <div>
                <div className={css.nearbyName}>{restaurant.name}</div>
                <div className={css.nearbyMeta}>{restaurant.cuisine}</div>
                <div className={css.nearbyMeta}>{restaurant.rating || '4.3'} ★ • {restaurant.deliveryTime || '30 min'} • {restaurant.distanceKm ? `${restaurant.distanceKm} km away` : 'nearby'}</div>
              </div>
            </a>
          )) : <div className={css.nearbyFallback}>Share your location for nearby picks, or browse restaurants by city below.</div>}
        </div>
      </section>

      <section className={css.directorySection}>
        <div className={css.directoryHeading}>
          <div>
            <span className={css.directoryEyebrow}>DISCOVER SOMETHING DELICIOUS</span>
            <h2>Explore restaurants by city</h2>
            <p>Search restaurants, cuisines or dishes across {cities.length || 8} cities.</p>
          </div>
          <span className={css.directoryCount}>{restaurants.length} restaurants · demo listings</span>
        </div>
        <label className={css.directorySearch}>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={restaurantSearch}
            onChange={(event) => setRestaurantSearch(event.target.value)}
            placeholder="Try biryani, dosa, pizza or a restaurant"
            aria-label="Search restaurants, cuisines, and dishes"
          />
        </label>
        <div className={css.cityFilters} aria-label="Filter restaurants by city">
          {['All cities', ...cities].map((city) => (
            <button
              key={city}
              type="button"
              className={selectedCity === city ? css.activeCityFilter : css.cityFilter}
              aria-pressed={selectedCity === city}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
        {restaurantError ? (
          <div className={css.directoryMessage} role="alert">{restaurantError}</div>
        ) : visibleRestaurants.length ? (
          <>
            <div className={css.directoryResultCount}>
              Showing {visibleRestaurants.length} of {restaurants.length} restaurants
            </div>
            <div className={css.restaurantGrid}>
              {visibleRestaurants.map((restaurant) => (
                <a
                  key={restaurant.id || restaurant.slug}
                  className={css.restaurantCard}
                  href={`/${String(restaurant.city || 'hyderabad').toLowerCase()}/${restaurant.slug || restaurant.id}/order`}
                >
                  <img src={restaurant.image || orderOnlineImg} alt="" />
                  <div className={css.restaurantCardBody}>
                    <div className={css.restaurantCardTopline}>
                      <span className={css.restaurantCity}>{restaurant.city}</span>
                      <span className={css.restaurantRating}>{restaurant.rating || '4.3'} ★</span>
                    </div>
                    <h3>{restaurant.name}</h3>
                    <p className={css.restaurantCuisine}>{restaurant.cuisine}</p>
                    <div className={css.restaurantCardFooter}>
                      <span>{restaurant.deliveryTime || '30 min'} delivery</span>
                      <span>{restaurant.menu?.length || 0} dishes</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        ) : (
          <div className={css.directoryMessage}>
            {restaurants.length ? 'No matching restaurants or dishes. Try another search or city.' : 'Restaurant listings are temporarily unavailable. Please try again shortly.'}
          </div>
        )}
      </section>

      <Collections />
      <PopularPlaces />
    </div>
    <GetTheApp />
    <ExploreOptionsNearMe />
    <Footer />
  </>
}

export default App
