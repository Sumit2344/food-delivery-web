import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import css from './OrderOnlineFieldComponent.module.css'

import SmallSearchBarUtil from '../../../../../utils/RestaurantUtils/SmallSearchBarUtil/SmallSearchBarUtil'
import OfferTrackUtil from '../../../../../utils/RestaurantUtils/OfferTrackUtil/OfferTrackUtil'
import FoodItemProduct from '../../../../../utils/RestaurantUtils/FoodItemProduct/FoodItemProduct'

import { getPaymentConfig, getRestaurants, placeOrder, submitPaymentReference } from '../../../../../services/api'

const compassIcon = '/icons/compass.png';
const clockIcon = '/icons/clock.png';
const vegIcon = '/icons/veg.png';
const OrderOnlineFieldComponent = () => {
  const { city, hotel } = useParams();
  const [isActive, setIsActive] = useState({ recommended: true });
  const [foodType, setFoodType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [foodItemsData, setFoodItemsData] = useState({});
  const [restaurant, setRestaurant] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('tomato_cart') || '[]');
      return Array.isArray(savedCart)
        ? savedCart.map((item) => item.restaurantId ? item : { ...item, restaurantId: 'paraside', restaurantSlug: 'paraside', restaurantName: 'Paraside' })
        : [];
    } catch (error) {
      return [];
    }
  });

  const offerTrackData = [
    { txt1: '0% OFF up to ₹80 + 10% OFF up to ₹75 Paytm Cashback', txt2: 'use code PAYTMBASH' },
    { txt1: 'Flat ₹125 OFF', txt2: 'use code ICICINB' }
  ]

  const normalizeMenu = (restaurantData) => {
    if (!restaurantData || !restaurantData.menu) return {};

    const menuMap = {};
    restaurantData.menu.forEach((item) => {
      const category = item.category || 'Recommended';
      const normalizedItem = {
        ...item,
        mustTry: Boolean(item.popular),
        ttl: item.name,
        votes: String(item.votes || 0),
        price: Number(item.price || 0),
        desc: item.description,
        vegNonveg: item.type === 'veg' ? vegIcon : vegIcon,
        foodType: item.type === 'veg' ? 'veg' : 'nonveg'
      };

      if (!menuMap[category]) menuMap[category] = [];
      menuMap[category].push(normalizedItem);
    });

    return menuMap;
  };

  useEffect(() => {
    let isMounted = true;

    const loadRestaurant = async () => {
      try {
        const result = await getRestaurants(city, hotel);
        if (!isMounted) return;

        const menu = normalizeMenu(result);
        setRestaurant(result);
        setFoodItemsData(menu || {});
        setIsActive({ recommended: true });
      } catch (error) {
        console.error('Failed to load restaurant data', error);
      }
    };

    if (city && hotel) {
      loadRestaurant();
    }

    return () => {
      isMounted = false;
    };
  }, [city, hotel]);

  useEffect(() => {
    getPaymentConfig()
      .then(setPaymentConfig)
      .catch(() => setPaymentConfig({ upiEnabled: false, error: 'Payment settings could not be loaded.' }));
  }, []);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0), [cart]);
  const cartIsForThisRestaurant = !cart.length || cart.every((item) => item.restaurantId === (restaurant?.id || hotel) || item.restaurantSlug === hotel);

  const syncCart = (nextCart) => {
    localStorage.setItem('tomato_cart', JSON.stringify(nextCart));
    setCart(nextCart);
  };

  const addToCart = (item) => {
    const belongsToAnotherRestaurant = cart.length && !cartIsForThisRestaurant;
    if (belongsToAnotherRestaurant && !window.confirm(`Your cart has items from ${cart[0].restaurantName || 'another restaurant'}. Clear it and start a ${restaurant?.name || 'new'} cart?`)) {
      return;
    }

    const startingCart = belongsToAnotherRestaurant ? [] : cart;
    const existing = startingCart.find((entry) => entry.id === item.id);
    const nextCart = existing
      ? startingCart.map((entry) => entry.id === item.id ? { ...entry, quantity: Number(entry.quantity || 1) + 1 } : entry)
      : [...startingCart, {
        ...item,
        quantity: 1,
        ttl: item.ttl || item.name,
        price: Number(item.price || 0),
        restaurantId: restaurant?.id || hotel,
        restaurantSlug: hotel,
        restaurantName: restaurant?.name || hotel
      }];

    syncCart(nextCart);
  };

  const placeOrderHandler = async () => {
    if (!cartIsForThisRestaurant) {
      alert('Your cart contains items from another restaurant. Start a new cart before checkout.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('tomato_user') || 'null');
    if (!user) {
      alert('Please login to place your order.');
      return;
    }

    if (!cart.length) {
      alert('Your cart is empty.');
      return;
    }

    try {
      const response = await placeOrder({
        userId: user.id,
        restaurantId: restaurant?.id || hotel,
        items: cart,
        deliveryAddress: 'Home',
        paymentMethod
      });

      setPlacedOrder(response.order);
      setPaymentMessage(paymentMethod === 'upi'
        ? 'Complete payment in your UPI app, then submit the transaction reference below. Payment is not confirmed until manually verified.'
        : `${response.message}. Total: ₹${response.order.total}`);
      if (paymentMethod === 'cod') syncCart([]);
    } catch (error) {
      alert(error.message || 'Unable to place order right now.');
    }
  };

  const submitPaymentReferenceHandler = async (event) => {
    event.preventDefault();
    if (!placedOrder || !paymentReference.trim()) return;

    try {
      const result = await submitPaymentReference(placedOrder.id, paymentReference);
      setPaymentMessage(result.message);
      setPlacedOrder((order) => ({ ...order, paymentStatus: result.paymentStatus, status: result.status }));
      syncCart([]);
    } catch (error) {
      setPaymentMessage(error.message || 'Unable to submit the payment reference.');
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredCategories = Object.entries(foodItemsData)
    .map(([name, items]) => [
      name,
      items.filter((item) => {
        const matchesSearch = !normalizedQuery || `${item.ttl} ${item.desc || ''} ${name}`.toLowerCase().includes(normalizedQuery)
        const matchesDiet = foodType === 'all' || item.foodType === foodType
        return matchesSearch && matchesDiet
      })
    ])
    .filter(([, items]) => items.length > 0)

  const sideNavHandler = (val) => {
    setIsActive({ [val?.[0]]: true });
    const target = document.getElementById(`${val?.[0]}`);
    target?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    const allTtls = document.querySelectorAll('[data-id=secTtl]');
    const options = { threshold: 0.1 }

    const handleIntersection = (entries) => {
      entries?.forEach((entry) => {
        const target = entry.target.id;
        const navItem = document.querySelector(`[data-sb-id='${target}']`);
        if (entry.isIntersecting) {
          navItem?.classList.add(css.activeNavTab);
        } else {
          navItem?.classList.remove(css.activeNavTab);
        }
      });
    }

    const observer = new IntersectionObserver(handleIntersection, options)
    allTtls.forEach((post) => observer.observe(post))
    return () => observer.disconnect();
  }, [foodItemsData])

  return <div className={css.outerDiv}>
    <div className={css.innerDiv}>
      <div className={css.leftBox}>
        {Object.entries(foodItemsData)?.map((val, id) => {
          return <div data-sb-id={val?.[0]} key={id} onClick={() => sideNavHandler(val)} className={isActive[val?.[0]] ? [css.navTab, css.activeNavTab].join(' ') : css.navTab}>{val?.[0]} ({val?.[1]?.length})</div>
        })}
      </div>
      <div className={css.rightBox}>
        <div className={css.hSec}>
            <div className={css.ttl}>Order Online</div>
            <SmallSearchBarUtil
              placeholder="Search within menu"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
        </div>
        <div className={css.tabBox}>
          <div className={css.tagLine}>
            <img src={compassIcon} className={css.clockIcon} alt="live track" />
            <span className={css.tabTxt}>Live track your order</span>
          </div>
          <div className={css.hr} />
          <div className={css.tagLine}>
            <img src={clockIcon} className={css.clockIcon} alt="time" />
            <span className={css.tabTxt}>{restaurant?.deliveryTime || '30 min'}</span>
          </div>
        </div>
        <div className={css.offersTrack}>
          {offerTrackData?.map((val, id) => {
            return <OfferTrackUtil key={id} txt1={val.txt1} txt2={val.txt2} />
          })}
        </div>
        <div className={css.formBox}>
          <div className={css.dietFilters} role="group" aria-label="Filter menu by diet">
            {[['all', 'All dishes'], ['veg', 'Veg only'], ['nonveg', 'Non-veg']].map(([value, label]) => (
              <button
                className={foodType === value ? css.dietFilterActive : css.dietFilter}
                key={value}
                type="button"
                onClick={() => setFoodType(value)}
                aria-pressed={foodType === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={css.checkoutBox}>
          <div className={css.cartSummary}>
            {cartIsForThisRestaurant ? `Cart: ${cart.reduce((count, item) => count + Number(item.quantity || 1), 0)} items · ₹${cartTotal}` : `Cart belongs to ${cart[0]?.restaurantName || 'another restaurant'}`}
          </div>
          {cart.length && !cartIsForThisRestaurant ? (
            <button type="button" className={css.checkoutBtn} onClick={() => syncCart([])}>Start new cart</button>
          ) : null}
          {cart.length && cartIsForThisRestaurant && !placedOrder ? (
            <div className={css.paymentChoices} role="group" aria-label="Choose payment method">
              <label className={css.paymentChoice}>
                <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <span>Cash on delivery</span>
              </label>
              <label className={paymentConfig?.upiEnabled ? css.paymentChoice : css.paymentChoiceDisabled}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  disabled={!paymentConfig?.upiEnabled}
                  onChange={() => setPaymentMethod('upi')}
                />
                <span>UPI {paymentConfig?.upiEnabled ? `(${paymentConfig.upiVpa})` : '— configure merchant UPI ID'}</span>
              </label>
              {paymentConfig?.error ? <span className={css.paymentHint}>{paymentConfig.error}</span> : null}
              <button type="button" className={css.checkoutBtn} onClick={placeOrderHandler} disabled={!cart.length || !paymentConfig}>
                {paymentMethod === 'upi' ? 'Continue to UPI' : 'Place order'}
              </button>
            </div>
          ) : null}
          {placedOrder ? (
            <div className={css.paymentResult} aria-live="polite">
              <strong>Order {placedOrder.id}</strong>
              <span>{paymentMessage}</span>
              {placedOrder.paymentMethod === 'upi' && placedOrder.paymentStatus === 'pending' ? (
                <>
                  <a className={css.upiLink} href={placedOrder.paymentUri}>Open UPI app · ₹{placedOrder.total}</a>
                  <span>Payee: {paymentConfig?.payeeName} · UPI ID: {paymentConfig?.upiVpa}</span>
                  <form className={css.referenceForm} onSubmit={submitPaymentReferenceHandler}>
                    <label htmlFor="upiReference">UPI transaction reference</label>
                    <input
                      id="upiReference"
                      value={paymentReference}
                      onChange={(event) => setPaymentReference(event.target.value)}
                      minLength={8}
                      maxLength={32}
                      required
                      placeholder="Enter UTR / transaction ID"
                    />
                    <button type="submit">Submit for verification</button>
                  </form>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className={css.itemsBox} id='itemsBox'>
          {filteredCategories.map(([category, items]) => {
            return <div key={category}>
              <div className={css.sec} >
                <div className={css.secTtl} id={category}>{category}</div>
                {items.map((item) => <FoodItemProduct key={item.id} data={item} dataset='secTtl' id={category} onAddToCart={addToCart} />)}
              </div>
              <hr className={css.hr2} />
            </div>
          })}
          {!filteredCategories.length ? <p className={css.noResults}>No dishes match your search and filters.</p> : null}
        </div>
      </div>
    </div>
  </div>
}

export default OrderOnlineFieldComponent