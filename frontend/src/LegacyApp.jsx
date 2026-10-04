import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AddRestaurant from './legacy-pages/AddRestaurant/AddRestaurant'
import ShowCase from './legacy-pages/ShowCase/ShowCase'
import RestaurantPage from './legacy-pages/RestaurantPage/RestaurantPage'
import User from './legacy-pages/User/User'
import GetTheApp from './legacy-pages/GetTheApp/GetTheApp'
import ErrorPage from './legacy-pages/ErrorPage/ErrorPage'
import AccountFeaturePage from './components/Account/AccountFeaturePage'

import TestPage from './legacy-pages/TestPage/TestPage'
// import AddRestaurantHeader from './components/AddRestaurantHeader/AddRestaurantHeader'
import App from './App'

export default function LegacyApp() {
  return (
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="/" element={<App />} />
      <Route path="/add-restaurant" element={<AddRestaurant />} />
      <Route path="/show-case" element={<ShowCase />} />
      <Route path="/user/:userId" element={<User />} />
      <Route path="/user/:userId/:hashId" element={<User />} />
      <Route path="/user/:userId/notifications" element={<AccountFeaturePage kind="notifications" />} />
      <Route path="/user/:userId/network" element={<AccountFeaturePage kind="network" />} />
      <Route path="/user/:userId/find-friends" element={<AccountFeaturePage kind="find-friends" />} />
      <Route path="/user/:userId/settings" element={<AccountFeaturePage kind="settings" />}/>
      <Route path="/get-the-app" element={<GetTheApp />} />
      <Route path="/:city/:hotel" element={<RestaurantPage />} />
      <Route path="/:city/:hotel/:page" element={<RestaurantPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
  )
}
