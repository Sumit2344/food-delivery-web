import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import css from './RestaurantPage.module.css'
import { getRestaurants } from '../../services/api'

import NavigationBar from '../../components/Navbars/NavigationBar2/NavigationBar2'
import DownloadAppUtil from '../../utils/RestaurantUtils/DownloadAppUtil/DownloadAppUtil'
import HeroComponent from '../../components/RestaurantComponents/HeroComponent/HeroComponent'
import OrderTitleComponent from '../../components/RestaurantComponents/OrderTitleComponent/OrderTitleComponent'
import OrderBodyComponent from '../../components/RestaurantComponents/OrderBodyComponent/OrderBodyComponent'
import Footer from '../../components/Footer/Footer'

const RestaurantPage = () => {
  const { city, hotel } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const cityName = restaurant?.city || city?.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
  const restaurantName = restaurant?.name || hotel?.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())

  useEffect(() => {
    let cancelled = false

    getRestaurants(city, hotel)
      .then((data) => {
        if (!cancelled) setRestaurant(data)
      })
      .catch((error) => console.error('Failed to load restaurant details', error))

    return () => {
      cancelled = true
    }
  }, [city, hotel])

  return <div className={css.outerDiv}>
    <NavigationBar />
    <div className={css.innerDiv}>
        <div className={css.breadcrumb}>
            Home / India / {cityName} / {restaurantName}
        </div>
    </div>
    <HeroComponent />
    <div className={css.innerDiv2}>
      <OrderTitleComponent restaurant={restaurant} fallbackName={hotel} />
      <OrderBodyComponent />
    </div>
    <Footer />
  </div>
}

export default RestaurantPage