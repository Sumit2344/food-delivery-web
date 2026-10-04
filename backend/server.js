require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createHmac, randomBytes, scryptSync, timingSafeEqual } = require('crypto');
const { MongoClient, ObjectId } = require('mongodb');
const menuCatalog = require('./data/menu-catalog');
const { additions: restaurantMenuAdditions, newRestaurants } = require('./data/restaurant-catalog');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || '';
const DATABASE_NAME = process.env.MONGO_DB_NAME || 'tomato';
const UPI_VPA = process.env.UPI_VPA || '';
const UPI_PAYEE_NAME = process.env.UPI_PAYEE_NAME || 'Tomato Food Delivery';
const AUTH_SECRET = process.env.AUTH_SECRET || 'tomato-local-development-auth-secret';
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

if (process.env.NODE_ENV === 'production' && !process.env.AUTH_SECRET) {
  throw new Error('AUTH_SECRET must be configured in production.');
}

app.use(cors());
app.use(express.json());

const defaultData = {
  users: [
    { id: 'user_demo', name: 'Demo User', phone: '9999999999', email: 'demo@tomato.app' }
  ],
  orders: [],
  profiles: {},
  restaurants: [
    {
      id: 'paraside',
      name: 'Paraside',
      city: 'Hyderabad',
      slug: 'paraside',
      cuisine: 'North Indian, Mughlai',
      rating: 4.4,
      deliveryTime: '30 min',
      image: '/images/orderonline.jpg',
      location: { type: 'Point', coordinates: [78.3922, 17.4354] },
      menu: [
        { id: 'kebab-1', name: 'Hariyali Kebab', category: 'Recommended', price: 299, description: 'Chargrilled kebabs with mint, coriander and signature spice mix.', type: 'veg', popular: true, votes: 12 },
        { id: 'kebab-2', name: 'Paneer Tikka', category: 'Recommended', price: 329, description: 'Paneer cubes marinated in yogurt and roasted to perfection.', type: 'veg', popular: true, votes: 18 },
        { id: 'biryani-1', name: 'Hyderabadi Dum Biryani', category: 'Biryani', price: 399, description: 'Fragrant basmati rice layered with slow-cooked spices and herbs.', type: 'nonveg', votes: 24 },
        { id: 'noodles-1', name: 'Veg Schezwan Noodles', category: 'Noodles & Fried Rice', price: 259, description: 'Wok-tossed noodles with crunchy vegetables and spicy sauce.', type: 'veg', votes: 10 },
        { id: 'dessert-1', name: 'Gulab Jamun', category: 'Dessert', price: 149, description: 'Soft khoya dumplings soaked in saffron-flavoured syrup.', type: 'veg', votes: 8 }
      ]
    },
    {
      id: 'biryani-house',
      name: 'Biryani House',
      city: 'Hyderabad',
      slug: 'biryani-house',
      cuisine: 'Biryani, Chinese',
      rating: 4.6,
      deliveryTime: '25 min',
      image: '/images/diningout.jpg',
      location: { type: 'Point', coordinates: [78.4840, 17.4267] },
      menu: [
        { id: 'bh-1', name: 'Chicken Dum Biryani', category: 'Recommended', price: 329, description: 'Traditional dum biryani layered with chicken and aromatic rice.', type: 'nonveg', popular: true, votes: 30 },
        { id: 'bh-2', name: 'Paneer 65', category: 'Recommended', price: 249, description: 'Crispy paneer cubes tossed in spicy masala.', type: 'veg', votes: 15 },
        { id: 'bh-3', name: 'Egg Fried Rice', category: 'Noodles & Fried Rice', price: 219, description: 'Classic fried rice with eggs, vegetables and soy seasoning.', type: 'nonveg', votes: 14 }
      ]
    },
    {
      id: 'green-bowl',
      name: 'Green Bowl',
      city: 'Hyderabad',
      slug: 'green-bowl',
      cuisine: 'Healthy, Continental',
      rating: 4.3,
      deliveryTime: '35 min',
      image: '/images/proandproplus.jpg',
      location: { type: 'Point', coordinates: [78.4461, 17.4491] },
      menu: [
        { id: 'gb-1', name: 'Quinoa Salad', category: 'Recommended', price: 279, description: 'Healthy bowl with quinoa, veggies, herbs and lemon dressing.', type: 'veg', popular: true, votes: 16 },
        { id: 'gb-2', name: 'Chicken Caesar Wrap', category: 'Recommended', price: 319, description: 'Grilled chicken wrap with romaine and creamy dressing.', type: 'nonveg', votes: 13 },
        { id: 'gb-3', name: 'Fruit Smoothie', category: 'Dessert', price: 199, description: 'Cold blended fruit smoothie with yogurt and honey.', type: 'veg', votes: 9 }
      ]
    }
  ]
};

const parasideSeed = defaultData.restaurants.find((restaurant) => restaurant.id === 'paraside');
const parasideMenuNames = new Set(parasideSeed.menu.map((item) => item.name.toLowerCase()));
parasideSeed.menu.push(...menuCatalog.filter((item) => !parasideMenuNames.has(item.name.toLowerCase())));
for (const restaurant of defaultData.restaurants) {
  restaurant.menu.push(...(restaurantMenuAdditions[restaurant.id] || []));
}
defaultData.restaurants.push(...newRestaurants);

let mongoClient = null;
let mongoDb = null;

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
}

function readDb() {
  ensureDataFile();
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  let changed = false;

  for (const seed of defaultData.restaurants) {
    const index = data.restaurants.findIndex((restaurant) => restaurant.id === seed.id || restaurant.slug === seed.slug);
    if (index === -1) {
      data.restaurants.push(seed);
      changed = true;
      continue;
    }

    const current = data.restaurants[index];
    const merged = mergeRestaurantSeed(current, seed);
    if (JSON.stringify(current) !== JSON.stringify(merged)) {
      data.restaurants[index] = merged;
      changed = true;
    }
  }

  if (changed) writeDb(data);
  return data;
}

function writeDb(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  return {
    passwordSalt: salt,
    passwordHash: scryptSync(password, salt, 64).toString('hex')
  };
}

function verifyPassword(password, user) {
  if (!user.passwordSalt || !user.passwordHash) return false;
  const expectedHash = Buffer.from(user.passwordHash, 'hex');
  const suppliedHash = scryptSync(password, user.passwordSalt, 64);
  return expectedHash.length === suppliedHash.length && timingSafeEqual(expectedHash, suppliedHash);
}

function createAuthToken(userId) {
  const payload = Buffer.from(JSON.stringify({
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
  })).toString('base64url');
  const signature = createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function readAuthToken(token) {
  const [payload, signature, extra] = String(token || '').split('.');
  if (!payload || !signature || extra) return null;

  const expectedSignature = createHmac('sha256', AUTH_SECRET).update(payload).digest();
  const suppliedSignature = Buffer.from(signature, 'base64url');
  if (expectedSignature.length !== suppliedSignature.length || !timingSafeEqual(expectedSignature, suppliedSignature)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!decoded.sub || !Number.isInteger(decoded.exp) || decoded.exp <= Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch (error) {
    return null;
  }
}

function publicUser(user) {
  return {
    id: String(user.id || user._id),
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  };
}

function mergeRestaurantSeed(current, seed) {
  const menu = current.menu || [];
  const seedMenu = seed.id === 'paraside' ? [...seed.menu, ...menuCatalog] : seed.menu;
  const seededItems = new Map(seedMenu.map((item) => [item.name.toLowerCase(), item]));
  const enrichedMenu = menu.map((item) => {
    const seedItem = seededItems.get(String(item.name).toLowerCase());
    if (!seedItem) return item;

    const enriched = { ...item };
    for (const property of ['rating', 'reviewCount', 'reviews']) {
      if (enriched[property] === undefined && seedItem[property] !== undefined) {
        enriched[property] = seedItem[property];
      }
    }
    return enriched;
  });

  const knownIds = new Set(enrichedMenu.map((item) => item.id));
  const knownNames = new Set(enrichedMenu.map((item) => String(item.name).toLowerCase()));
  const newItems = seedMenu.filter((item) => !knownIds.has(item.id) && !knownNames.has(item.name.toLowerCase()));

  return {
    ...current,
    location: current.location || seed.location,
    menu: [...enrichedMenu, ...newItems]
  };
}

async function connectMongo() {
  if (!MONGO_URI) return null;
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    mongoDb = mongoClient.db(DATABASE_NAME);

    const restaurants = mongoDb.collection('restaurants');
    await restaurants.createIndex({ location: '2dsphere' }).catch(() => {});
    await mongoDb.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
    await mongoDb.collection('profiles').createIndex({ userId: 1 }, { unique: true });

    const existingCount = await restaurants.countDocuments();
    if (!existingCount) {
      await restaurants.insertMany(defaultData.restaurants);
    } else {
      for (const seed of defaultData.restaurants) {
        const current = await restaurants.findOne({ $or: [{ id: seed.id }, { slug: seed.slug }] });
        if (!current) {
          await restaurants.insertOne(seed);
          continue;
        }

        const merged = mergeRestaurantSeed(current, seed);
        if (JSON.stringify(current.menu || []) !== JSON.stringify(merged.menu) || !current.location) {
          await restaurants.updateOne(
            { _id: current._id },
            { $set: { menu: merged.menu, location: merged.location } }
          );
        }
      }
    }
  }
  return mongoDb;
}

function toDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function findNearbyRestaurants({ lat, lng, radiusKm = 5 }) {
  const db = await connectMongo();
  const baseLat = Number(lat);
  const baseLng = Number(lng);

  if (db) {
    const restaurants = db.collection('restaurants');
    const records = await restaurants.find({
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [baseLng, baseLat] },
          $maxDistance: Number(radiusKm) * 1000
        }
      }
    }).limit(10).toArray();

    return records.map((restaurant) => ({
      ...restaurant,
      distanceKm: restaurant.location && restaurant.location.coordinates
        ? Number(toDistanceKm(baseLat, baseLng, restaurant.location.coordinates[1], restaurant.location.coordinates[0]).toFixed(2))
        : 0
    }));
  }

  const restaurants = readDb().restaurants || [];
  return restaurants
    .map((restaurant) => {
      const seededRestaurant = defaultData.restaurants.find((seed) => seed.id === restaurant.id || seed.slug === restaurant.slug);
      const coords = restaurant.location?.coordinates || seededRestaurant?.location.coordinates || [0, 0];
      const distance = toDistanceKm(baseLat, baseLng, coords[1], coords[0]);
      return { ...restaurant, distanceKm: Number(distance.toFixed(2)) };
    })
    .filter((restaurant) => restaurant.distanceKm <= Number(radiusKm || 5))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 10);
}

async function getRestaurantCollection() {
  const db = await connectMongo();
  if (db) return db.collection('restaurants');
  return null;
}

async function getUserCollection() {
  const db = await connectMongo();
  if (db) return db.collection('users');
  return null;
}

async function getOrderCollection() {
  const db = await connectMongo();
  if (db) return db.collection('orders');
  return null;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Tomato API is running', timestamp: new Date().toISOString() });
});

app.get('/api/payment/config', (_req, res) => {
  res.json({
    upiEnabled: Boolean(UPI_VPA),
    payeeName: UPI_PAYEE_NAME,
    upiVpa: UPI_VPA
  });
});

app.get('/api/restaurants', async (req, res) => {
  const { city, slug, q } = req.query;
  const collection = await getRestaurantCollection();

  if (collection) {
    const filter = {};
    if (city) filter.city = { $regex: String(city), $options: 'i' };
    if (q) filter.$or = [
      { name: { $regex: String(q), $options: 'i' } },
      { cuisine: { $regex: String(q), $options: 'i' } }
    ];

    const restaurants = await collection.find(filter).toArray();
    if (slug) {
      const match = restaurants.find((item) => String(item.slug).toLowerCase() === String(slug).toLowerCase());
      return res.json(match || null);
    }
    return res.json(restaurants);
  }

  let restaurants = readDb().restaurants || [];
  if (city) {
    restaurants = restaurants.filter((item) => String(item.city).toLowerCase() === String(city).toLowerCase());
  }
  if (q) {
    restaurants = restaurants.filter((item) => `${item.name} ${item.cuisine}`.toLowerCase().includes(String(q).toLowerCase()));
  }
  if (slug) {
    const match = restaurants.find((item) => String(item.slug).toLowerCase() === String(slug).toLowerCase());
    return res.json(match || null);
  }
  res.json(restaurants);
});

app.get('/api/restaurants/nearby', async (req, res) => {
  const { lat, lng, radiusKm = 5 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  const nearby = await findNearbyRestaurants({ lat, lng, radiusKm });
  res.json(nearby);
});

app.post('/api/auth/signup', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ message: 'Enter a name between 2 and 100 characters.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }
  if (password.length < 8 || password.length > 128) {
    return res.status(400).json({ message: 'Password must be between 8 and 128 characters.' });
  }

  try {
    const collection = await getUserCollection();
    const existingUser = collection
      ? await collection.findOne({ email })
      : readDb().users.find((user) => normalizeEmail(user.email) === email);
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = {
      id: makeId('user'),
      name,
      email,
      ...hashPassword(password),
      createdAt: new Date().toISOString()
    };

    if (collection) {
      try {
        await collection.insertOne(user);
      } catch (error) {
        if (error.code === 11000) {
          return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        throw error;
      }
    } else {
      const db = readDb();
      db.users.push(user);
      writeDb(db);
    }

    return res.status(201).json({
      message: 'Account created successfully.',
      token: createAuthToken(user.id),
      user: publicUser(user)
    });
  } catch (error) {
    console.error('Account registration failed', error);
    return res.status(500).json({ message: 'Unable to create your account right now.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const collection = await getUserCollection();
    const user = collection
      ? await collection.findOne({ email })
      : readDb().users.find((candidate) => normalizeEmail(candidate.email) === email);
    if (!user || !verifyPassword(password, user)) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const safeUser = publicUser(user);
    return res.json({
      message: 'Login successful.',
      token: createAuthToken(safeUser.id),
      user: safeUser
    });
  } catch (error) {
    console.error('Login failed', error);
    return res.status(500).json({ message: 'Unable to sign in right now.' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const payload = readAuthToken(token);
  if (!payload) return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });

  try {
    const collection = await getUserCollection();
    let user;
    if (collection) {
      user = await collection.findOne({ id: payload.sub });
      if (!user && ObjectId.isValid(payload.sub)) {
        user = await collection.findOne({ _id: new ObjectId(payload.sub) });
      }
    } else {
      user = readDb().users.find((candidate) => candidate.id === payload.sub);
    }
    if (!user) return res.status(401).json({ message: 'Your account could not be found. Please sign in again.' });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('Session validation failed', error);
    return res.status(500).json({ message: 'Unable to validate your session right now.' });
  }
});

async function requireAuth(req, res, next) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const payload = readAuthToken(token);
  if (!payload) return res.status(401).json({ message: 'Sign in to continue.' });

  try {
    const collection = await getUserCollection();
    let user;
    if (collection) {
      user = await collection.findOne({ id: payload.sub });
      if (!user && ObjectId.isValid(payload.sub)) {
        user = await collection.findOne({ _id: new ObjectId(payload.sub) });
      }
    } else {
      user = readDb().users.find((candidate) => candidate.id === payload.sub);
    }
    if (!user) return res.status(401).json({ message: 'Your account could not be found. Please sign in again.' });
    req.authUser = publicUser(user);
    return next();
  } catch (error) {
    console.error('Authentication check failed', error);
    return res.status(500).json({ message: 'Unable to verify your sign-in right now.' });
  }
}

function emptyProfile() {
  return { bookmarks: [], reviews: [], notifications: [], following: [], settings: { push: true, email: false, whatsapp: false } };
}

async function loadProfile(userId) {
  const db = await connectMongo();
  const stored = db
    ? await db.collection('profiles').findOne({ userId })
    : (readDb().profiles || {})[userId];
  return { ...emptyProfile(), ...(stored || {}), settings: { ...emptyProfile().settings, ...(stored?.settings || {}) } };
}

async function storeProfile(userId, profile) {
  const db = await connectMongo();
  if (db) {
    await db.collection('profiles').updateOne({ userId }, { $set: profile }, { upsert: true });
    return;
  }
  const data = readDb();
  data.profiles = data.profiles || {};
  data.profiles[userId] = profile;
  writeDb(data);
}

async function getUserById(userId) {
  const collection = await getUserCollection();
  if (collection) {
    const byId = await collection.findOne({ id: userId });
    if (byId) return byId;
    return ObjectId.isValid(userId) ? collection.findOne({ _id: new ObjectId(userId) }) : null;
  }
  return readDb().users.find((user) => user.id === userId) || null;
}

app.get('/api/profile', requireAuth, async (req, res) => {
  try {
    res.json({ profile: await loadProfile(req.authUser.id) });
  } catch (error) {
    console.error('Profile load failed', error);
    res.status(500).json({ message: 'Unable to load your profile data.' });
  }
});

app.patch('/api/profile/settings', requireAuth, async (req, res) => {
  const keys = ['push', 'email', 'whatsapp'];
  const settings = req.body?.settings;
  if (!settings || keys.some((key) => typeof settings[key] !== 'boolean')) {
    return res.status(400).json({ message: 'Choose enabled or disabled for each notification setting.' });
  }
  try {
    const profile = await loadProfile(req.authUser.id);
    profile.settings = Object.fromEntries(keys.map((key) => [key, settings[key]]));
    await storeProfile(req.authUser.id, profile);
    res.json({ settings: profile.settings });
  } catch (error) {
    console.error('Notification settings update failed', error);
    res.status(500).json({ message: 'Unable to save notification settings.' });
  }
});

app.post('/api/profile/bookmarks', requireAuth, async (req, res) => {
  const item = req.body?.item;
  if (!item?.id || !item?.name || !item?.url || !String(item.url).startsWith('/') || String(item.url).startsWith('//')) {
    return res.status(400).json({ message: 'A restaurant ID, name, and link are required.' });
  }
  try {
    const profile = await loadProfile(req.authUser.id);
    if (!profile.bookmarks.some((bookmark) => bookmark.id === String(item.id))) {
      profile.bookmarks.unshift({
        id: String(item.id),
        name: String(item.name).slice(0, 120),
        city: String(item.city || '').slice(0, 80),
        cuisine: String(item.cuisine || '').slice(0, 160),
        url: String(item.url).slice(0, 300),
        createdAt: new Date().toISOString()
      });
      await storeProfile(req.authUser.id, profile);
    }
    res.status(201).json({ bookmarks: profile.bookmarks });
  } catch (error) {
    console.error('Bookmark save failed', error);
    res.status(500).json({ message: 'Unable to save this bookmark.' });
  }
});

app.delete('/api/profile/bookmarks/:bookmarkId', requireAuth, async (req, res) => {
  try {
    const profile = await loadProfile(req.authUser.id);
    profile.bookmarks = profile.bookmarks.filter((item) => item.id !== req.params.bookmarkId);
    await storeProfile(req.authUser.id, profile);
    res.json({ bookmarks: profile.bookmarks });
  } catch (error) {
    console.error('Bookmark removal failed', error);
    res.status(500).json({ message: 'Unable to remove this bookmark.' });
  }
});

app.post('/api/profile/reviews', requireAuth, async (req, res) => {
  const restaurantId = String(req.body?.restaurantId || '');
  const rating = Number(req.body?.rating);
  const text = String(req.body?.text || '').trim();
  if (!restaurantId || !Number.isInteger(rating) || rating < 1 || rating > 5 || text.length < 5 || text.length > 1000) {
    return res.status(400).json({ message: 'Choose a 1–5 star rating and write a review between 5 and 1,000 characters.' });
  }
  try {
    const restaurants = await getRestaurantCollection();
    const restaurant = restaurants
      ? await restaurants.findOne({ $or: [{ id: restaurantId }, { slug: restaurantId }] })
      : readDb().restaurants.find((item) => item.id === restaurantId || item.slug === restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found.' });
    const profile = await loadProfile(req.authUser.id);
    const review = {
      id: makeId('review'),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      city: restaurant.city,
      rating,
      text,
      createdAt: new Date().toISOString()
    };
    profile.reviews.unshift(review);
    await storeProfile(req.authUser.id, profile);
    res.status(201).json({ review, reviews: profile.reviews });
  } catch (error) {
    console.error('Review submission failed', error);
    res.status(500).json({ message: 'Unable to submit your review.' });
  }
});

app.get('/api/profile/notifications', requireAuth, async (req, res) => {
  try {
    const profile = await loadProfile(req.authUser.id);
    res.json({ notifications: profile.notifications });
  } catch (error) {
    console.error('Notifications load failed', error);
    res.status(500).json({ message: 'Unable to load your notifications.' });
  }
});

app.patch('/api/profile/notifications/:notificationId', requireAuth, async (req, res) => {
  try {
    const profile = await loadProfile(req.authUser.id);
    profile.notifications = profile.notifications.map((item) => item.id === req.params.notificationId ? { ...item, read: true } : item);
    await storeProfile(req.authUser.id, profile);
    res.json({ notifications: profile.notifications });
  } catch (error) {
    console.error('Notification update failed', error);
    res.status(500).json({ message: 'Unable to update this notification.' });
  }
});

app.get('/api/profile/users', requireAuth, async (req, res) => {
  const query = String(req.query.q || '').trim();
  try {
    const collection = await getUserCollection();
    const profile = await loadProfile(req.authUser.id);
    let candidates;
    if (req.query.following === 'true') {
      candidates = collection
        ? await collection.find({ id: { $in: profile.following } }).limit(100).toArray()
        : readDb().users.filter((user) => profile.following.includes(user.id));
    } else {
      if (query.length < 2) return res.json({ users: [] });
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      candidates = collection
        ? await collection.find({ $or: [{ name: { $regex: escapedQuery, $options: 'i' } }, { email: { $regex: escapedQuery, $options: 'i' } }] }).limit(30).toArray()
        : readDb().users.filter((user) => `${user.name || ''} ${user.email || ''}`.toLowerCase().includes(query.toLowerCase())).slice(0, 30);
    }
    const users = candidates.map(publicUser)
      .filter((user) => user.id !== req.authUser.id)
      .map((user) => ({ ...user, following: profile.following.includes(user.id) }));
    res.json({ users });
  } catch (error) {
    console.error('User search failed', error);
    res.status(500).json({ message: 'Unable to search users right now.' });
  }
});

app.post('/api/profile/users/:userId/follow', requireAuth, async (req, res) => {
  const targetId = req.params.userId;
  if (targetId === req.authUser.id) return res.status(400).json({ message: 'You cannot follow your own account.' });
  try {
    const target = await getUserById(targetId);
    if (!target) return res.status(404).json({ message: 'User not found.' });
    const profile = await loadProfile(req.authUser.id);
    if (!profile.following.includes(targetId)) profile.following.push(targetId);
    await storeProfile(req.authUser.id, profile);
    res.json({ following: profile.following });
  } catch (error) {
    console.error('Follow request failed', error);
    res.status(500).json({ message: 'Unable to follow this user.' });
  }
});

app.delete('/api/profile/users/:userId/follow', requireAuth, async (req, res) => {
  try {
    const profile = await loadProfile(req.authUser.id);
    profile.following = profile.following.filter((id) => id !== req.params.userId);
    await storeProfile(req.authUser.id, profile);
    res.json({ following: profile.following });
  } catch (error) {
    console.error('Unfollow request failed', error);
    res.status(500).json({ message: 'Unable to unfollow this user.' });
  }
});

app.post('/api/orders', requireAuth, async (req, res) => {
  const { userId, restaurantId, items = [], deliveryAddress = 'Home', paymentMethod = 'cod' } = req.body || {};

  if (!userId || !restaurantId || !Array.isArray(items) || !items.length || !['cod', 'upi'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'User, restaurant and items are required.' });
  }
  if (String(userId) !== req.authUser.id) {
    return res.status(403).json({ message: 'You can only place orders for your signed-in account.' });
  }
  if (paymentMethod === 'upi' && !UPI_VPA) {
    return res.status(503).json({ message: 'UPI is not configured. Add UPI_VPA to backend/.env.' });
  }

  const collection = await getOrderCollection();
  const restaurantCollection = await getRestaurantCollection();
  let restaurant;

  if (restaurantCollection) {
    restaurant = await restaurantCollection.findOne({ $or: [{ id: restaurantId }, { slug: restaurantId }] });
  } else {
    const db = readDb();
    restaurant = db.restaurants.find((item) => item.id === restaurantId || item.slug === restaurantId);
  }

  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found.' });
  }

  const orderItems = [];
  for (const item of items) {
    const itemId = String(item?.id || '');
    const quantity = Number(item?.quantity || 1);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return res.status(400).json({ message: 'Each item quantity must be between 1 and 20.' });
    }

    const menuItem = (restaurant.menu || []).find((entry) => String(entry.id) === itemId);
    if (!menuItem) {
      return res.status(400).json({ message: 'One or more cart items do not belong to this restaurant.' });
    }

    orderItems.push({
      id: menuItem.id,
      name: menuItem.name,
      price: Number(menuItem.price),
      quantity,
      description: menuItem.description,
      type: menuItem.type
    });
  }

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = makeId('order');
  const paymentUri = paymentMethod === 'upi'
    ? `upi://pay?${new URLSearchParams({
      pa: UPI_VPA,
      pn: UPI_PAYEE_NAME,
      am: total.toFixed(2),
      cu: 'INR',
      tn: `Tomato order ${orderId}`
    }).toString()}`
    : null;
  const order = {
    id: orderId,
    userId,
    restaurantId,
    restaurantName: restaurant.name,
    items: orderItems,
    deliveryAddress,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === 'upi' ? 'pending' : 'cash_on_delivery',
    paymentUri,
    status: paymentMethod === 'upi' ? 'awaiting_payment' : 'confirmed',
    createdAt: new Date().toISOString()
  };

  const profile = await loadProfile(req.authUser.id);
  profile.notifications.unshift({
    id: makeId('notification'),
    title: 'Order placed',
    message: `Your order from ${restaurant.name} was placed for ₹${total}.`,
    createdAt: new Date().toISOString(),
    read: false
  });
  profile.notifications = profile.notifications.slice(0, 50);
  await storeProfile(req.authUser.id, profile);

  if (collection) {
    await collection.insertOne(order);
    return res.status(201).json({ message: 'Order placed successfully', order });
  }

  const db = readDb();
  db.orders.push(order);
  writeDb(db);
  res.status(201).json({ message: 'Order placed successfully', order });
});

app.post('/api/orders/:orderId/payment-reference', async (req, res) => {
  const reference = String(req.body?.reference || '').trim();
  if (!/^[A-Za-z0-9-]{8,32}$/.test(reference)) {
    return res.status(400).json({ message: 'Enter a valid UPI transaction reference (8–32 letters or numbers).' });
  }

  const collection = await getOrderCollection();
  let order;
  if (collection) {
    order = await collection.findOne({ id: req.params.orderId });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.paymentMethod !== 'upi' || order.paymentStatus !== 'pending') {
      return res.status(409).json({ message: 'This order is not awaiting a UPI payment reference.' });
    }

    await collection.updateOne(
      { _id: order._id },
      { $set: { paymentReference: reference, paymentStatus: 'review_required', status: 'awaiting_manual_verification', paymentReportedAt: new Date().toISOString() } }
    );
  } else {
    const db = readDb();
    order = db.orders.find((item) => item.id === req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.paymentMethod !== 'upi' || order.paymentStatus !== 'pending') {
      return res.status(409).json({ message: 'This order is not awaiting a UPI payment reference.' });
    }

    order.paymentReference = reference;
    order.paymentStatus = 'review_required';
    order.status = 'awaiting_manual_verification';
    order.paymentReportedAt = new Date().toISOString();
    writeDb(db);
  }

  res.json({
    message: 'Payment reference received. The restaurant must manually verify the payment before confirming this order.',
    paymentStatus: 'review_required',
    status: 'awaiting_manual_verification'
  });
});

app.get('/api/orders', async (req, res) => {
  const { userId } = req.query;
  const collection = await getOrderCollection();

  if (collection) {
    const filter = userId ? { userId: String(userId) } : {};
    const orders = await collection.find(filter).sort({ createdAt: -1 }).toArray();
    return res.json(orders);
  }

  const db = readDb();
  let orders = db.orders || [];
  if (userId) orders = orders.filter((order) => order.userId === String(userId));
  res.json(orders.reverse());
});

async function startServer() {
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`Tomato backend running on http://localhost:${PORT}`);
    if (MONGO_URI) console.log('MongoDB connected successfully');
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
