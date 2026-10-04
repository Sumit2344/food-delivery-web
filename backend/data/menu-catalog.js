const catalogGroups = [
  ['Recommended', [
    ['Hariyali Kebab', 299, 'veg', 'Paneer marinated with mint, coriander and yogurt, then chargrilled until smoky at the edges.'],
    ['Paneer Tikka', 329, 'veg', 'Cubes of fresh paneer roasted with peppers in a tangy yogurt and house-spice marinade.'],
    ['Hyderabadi Dum Biryani', 399, 'nonveg', 'Long-grain basmati and tender chicken slow-cooked in a sealed pot with saffron and whole spices.'],
    ['Veg Schezwan Noodles', 259, 'veg', 'Wok-tossed noodles with crunchy vegetables, spring onion and a bold house-made chilli sauce.'],
    ['Gulab Jamun', 149, 'veg', 'Soft khoya dumplings soaked in warm cardamom syrup and finished with a little saffron.'],
    ['Tandoori Chicken Tikka', 349, 'nonveg', 'Juicy chicken pieces marinated overnight and roasted in the tandoor with lemon and warming spices.'],
    ['Butter Paneer Masala', 329, 'veg', 'Paneer simmered in a silky tomato, butter and cashew gravy with a gentle finish of fenugreek.'],
    ['Chicken 65', 299, 'nonveg', 'Crisp, spicy chicken bites tossed with curry leaves, green chilli and a squeeze of lime.'],
    ['Classic Masala Dosa', 189, 'veg', 'A crisp fermented rice crepe filled with spiced potato and served with sambar and coconut chutney.'],
    ['Double Ka Meetha', 159, 'veg', 'Hyderabadi-style bread pudding gently simmered in milk, cardamom and saffron.'],
  ]],
  ['Biryani', [
    ['Chicken Dum Biryani', 379, 'nonveg', 'Marinated chicken and fragrant basmati layered and slow-steamed together for traditional dum flavor.'],
    ['Mutton Dum Biryani', 469, 'nonveg', 'Tender mutton pieces cooked until soft beneath aromatic basmati, fried onions and fresh herbs.'],
    ['Chicken 65 Biryani', 409, 'nonveg', 'Spiced chicken 65 layered through basmati rice with mint, fried onions and a bright raita on the side.'],
    ['Paneer Biryani', 349, 'veg', 'Golden paneer, basmati rice and vegetables folded with mint, saffron and gentle biryani spices.'],
    ['Veg Dum Biryani', 319, 'veg', 'Seasonal vegetables and basmati cooked in a sealed pot with saffron, mint and toasted whole spices.'],
    ['Egg Biryani', 329, 'nonveg', 'Boiled eggs and aromatic rice layered with caramelized onions, coriander and a medium-spiced masala.'],
    ['Fish Biryani', 449, 'nonveg', 'Coastal-style biryani with delicately spiced fish, fragrant rice and fresh lime.'],
    ['Prawn Biryani', 489, 'nonveg', 'Juicy prawns cooked with basmati, curry leaves and a balanced blend of coastal spices.'],
    ['Keema Biryani', 429, 'nonveg', 'Spiced minced lamb layered with long-grain rice, fried onions and fresh coriander.'],
    ['Mushroom Biryani', 339, 'veg', 'Earthy mushrooms and basmati steamed with pepper, mint and a fragrant whole-spice blend.'],
    ['Kaju Biryani', 369, 'veg', 'Roasted cashews, vegetables and saffron rice make a rich, gently sweet vegetarian biryani.'],
    ['Family Pack Chicken Biryani', 899, 'nonveg', 'A generous sharing portion of chicken dum biryani with raita and salan for the table.'],
  ]],
  ['Starters', [
    ['Crispy Corn', 229, 'veg', 'Sweet corn kernels tossed crisp with chilli, pepper and chopped spring onion.'],
    ['Chilli Paneer Dry', 279, 'veg', 'Golden paneer cubes tossed with peppers, onion and a punchy Indo-Chinese chilli glaze.'],
    ['Gobi Manchurian', 249, 'veg', 'Crisp cauliflower florets coated in a tangy, savory Manchurian sauce with spring onion.'],
    ['Veg Spring Rolls', 219, 'veg', 'Golden pastry rolls filled with seasoned cabbage, carrot and tender noodles.'],
    ['Chicken Lollipop', 329, 'nonveg', 'Frenched chicken wings marinated, fried crisp and coated in a sweet-hot house sauce.'],
    ['Chilli Chicken Dry', 319, 'nonveg', 'Tender chicken wok-tossed with green chilli, onion and peppers in a savory sauce.'],
    ['Apollo Fish', 359, 'nonveg', 'Crisp fish strips tossed Hyderabad-style with curry leaves, green chilli and yogurt spices.'],
    ['Pepper Chicken', 329, 'nonveg', 'Chicken bites pan-tossed with cracked black pepper, curry leaves and a squeeze of lemon.'],
    ['Tandoori Gobi', 249, 'veg', 'Cauliflower florets roasted in a smoky tandoor after a creamy spiced-yogurt marinade.'],
    ['Hara Bhara Kebab', 239, 'veg', 'Pan-seared spinach and green-pea patties with herbs, mild spices and a crisp outside.'],
    ['Chicken Seekh Kebab', 349, 'nonveg', 'Minced chicken and fresh herbs shaped on skewers and roasted over charcoal.'],
    ['Mutton Seekh Kebab', 399, 'nonveg', 'Juicy minced mutton skewers seasoned with fragrant spices and finished in the tandoor.'],
    ['Crispy Baby Corn', 239, 'veg', 'Baby corn lightly battered and fried, then tossed with chilli, garlic and scallions.'],
    ['Garlic Prawns', 429, 'nonveg', 'Prawns sautéed with fresh garlic, butter, herbs and a bright hint of lime.'],
  ]],
  ['Mains', [
    ['Chicken Tikka Masala', 379, 'nonveg', 'Tandoor-roasted chicken simmered in a creamy tomato gravy with a balanced spice blend.'],
    ['Butter Chicken', 399, 'nonveg', 'Smoky chicken pieces finished in a smooth tomato-butter sauce with a touch of cream.'],
    ['Kadai Chicken', 369, 'nonveg', 'Chicken cooked with crushed coriander, peppers and onion in a fragrant kadai masala.'],
    ['Chicken Chettinad', 389, 'nonveg', 'South Indian chicken curry with roasted coconut, peppercorns and aromatic curry leaves.'],
    ['Mutton Rogan Josh', 469, 'nonveg', 'Slow-braised mutton in a deep Kashmiri-style gravy with warming whole spices.'],
    ['Palak Paneer', 299, 'veg', 'Soft paneer cubes folded through smooth spinach gravy with garlic and toasted cumin.'],
    ['Paneer Lababdar', 329, 'veg', 'Paneer simmered in a rich tomato-cashew sauce finished with cream and kasuri methi.'],
    ['Kadai Paneer', 319, 'veg', 'Paneer and peppers cooked in a freshly ground coriander and chilli kadai masala.'],
    ['Dal Makhani', 279, 'veg', 'Black lentils slow-cooked until creamy with butter, tomato and a gentle smoky finish.'],
    ['Dal Tadka', 229, 'veg', 'Yellow lentils topped with a sizzling tempering of garlic, cumin and dried chilli.'],
    ['Chana Masala', 249, 'veg', 'Chickpeas simmered with tomato, ginger and fragrant North Indian spices.'],
    ['Mushroom Masala', 299, 'veg', 'Button mushrooms cooked in a spiced onion-tomato gravy with fresh coriander.'],
    ['Prawn Masala', 449, 'nonveg', 'Prawns gently cooked in a coastal tomato and coconut gravy with curry leaves.'],
    ['Fish Curry', 429, 'nonveg', 'Tender fish simmered in a tangy, lightly spiced curry with fresh coriander.'],
  ]],
  ['Indian Breads', [
    ['Butter Naan', 69, 'veg', 'Soft tandoor-baked leavened bread brushed with a little melted butter.'],
    ['Garlic Naan', 89, 'veg', 'Tandoor-baked naan topped with chopped garlic, coriander and a touch of butter.'],
    ['Plain Naan', 59, 'veg', 'Classic soft leavened naan baked against the hot walls of a traditional tandoor.'],
    ['Tandoori Roti', 49, 'veg', 'Whole-wheat flatbread baked in the tandoor and served warm.'],
    ['Butter Roti', 59, 'veg', 'Whole-wheat tandoori roti finished with a thin brush of butter.'],
    ['Laccha Paratha', 79, 'veg', 'Flaky layered whole-wheat paratha cooked on a hot griddle until golden.'],
    ['Paneer Kulcha', 119, 'veg', 'Soft leavened bread stuffed with seasoned paneer and baked until lightly crisp.'],
    ['Onion Kulcha', 99, 'veg', 'Tandoor-baked bread filled with onion, coriander and a mild spice mix.'],
    ['Roomali Roti', 69, 'veg', 'Delicate, paper-thin handkerchief bread served warm from the griddle.'],
    ['Cheese Garlic Naan', 129, 'veg', 'Garlic naan filled with melted cheese and finished with fresh coriander.'],
  ]],
  ['South Indian', [
    ['Plain Dosa', 149, 'veg', 'A thin, crisp fermented rice-and-lentil crepe served with coconut chutney and sambar.'],
    ['Mysore Masala Dosa', 219, 'veg', 'Crisp dosa brushed with Mysore chilli chutney and filled with spiced potato.'],
    ['Rava Dosa', 199, 'veg', 'Lacy semolina dosa with cumin and pepper, served with sambar and coconut chutney.'],
    ['Onion Uttapam', 189, 'veg', 'Soft rice-and-lentil pancake topped with onion, tomato and fresh coriander.'],
    ['Idli Sambar', 139, 'veg', 'Steamed rice cakes served with hot lentil sambar and coconut chutney.'],
    ['Medu Vada', 149, 'veg', 'Crisp golden lentil doughnuts with a soft center, served with sambar and chutney.'],
    ['Pesarattu', 179, 'veg', 'A savory green-gram crepe with ginger and green chilli, served with ginger chutney.'],
    ['Ghee Podi Idli', 159, 'veg', 'Steamed mini idlis tossed with aromatic lentil podi and a little ghee.'],
    ['Set Dosa', 169, 'veg', 'A soft, fluffy pair of fermented rice dosas served with vegetable saagu.'],
    ['Curd Rice', 149, 'veg', 'Cooling rice folded with fresh yogurt and finished with mustard seed tempering.'],
  ]],
  ['Indo-Chinese', [
    ['Veg Hakka Noodles', 239, 'veg', 'Wok-tossed noodles with shredded vegetables, soy and a hint of toasted sesame.'],
    ['Chicken Hakka Noodles', 289, 'nonveg', 'Wok-tossed noodles with chicken, crisp vegetables and savory house seasoning.'],
    ['Veg Fried Rice', 229, 'veg', 'Fluffy rice tossed quickly with seasonal vegetables, scallions and light soy.'],
    ['Chicken Fried Rice', 279, 'nonveg', 'Wok-fried rice with chicken, egg, spring onion and a savory soy finish.'],
    ['Schezwan Fried Rice', 249, 'veg', 'Rice tossed with crunchy vegetables and a punchy, house-made Schezwan sauce.'],
    ['Chilli Garlic Noodles', 249, 'veg', 'Noodles tossed with roasted garlic, red chilli, cabbage and fresh scallions.'],
    ['Egg Fried Rice', 259, 'nonveg', 'Wok-fried rice with fluffy egg, vegetables, spring onion and light soy sauce.'],
    ['Chicken Manchurian', 329, 'nonveg', 'Crisp chicken pieces coated in a tangy Manchurian glaze with spring onions.'],
    ['Veg Manchurian Gravy', 259, 'veg', 'Vegetable dumplings simmered in a savory, gently tangy Indo-Chinese gravy.'],
    ['American Chopsuey', 279, 'nonveg', 'Crispy noodles topped with chicken, vegetables and a sweet-tangy sauce.'],
  ]],
  ['Thalis & Meals', [
    ['Veg Executive Thali', 299, 'veg', 'A complete meal with seasonal curry, dal, rice, roti, salad and a small dessert.'],
    ['Non-Veg Executive Thali', 379, 'nonveg', 'Chicken curry served with dal, rice, roti, salad and a small dessert.'],
    ['Paneer Meal Box', 289, 'veg', 'Paneer curry, fragrant rice, two rotis and a fresh salad packed as a hearty meal.'],
    ['Chicken Meal Box', 329, 'nonveg', 'Chicken curry with rice, two rotis and a fresh salad in a convenient meal box.'],
    ['South Indian Mini Meals', 249, 'veg', 'Rice, sambar, rasam, vegetable poriyal, curd and pickle in a comforting set meal.'],
    ['Mutton Meal Box', 399, 'nonveg', 'Slow-cooked mutton curry paired with rice, rotis and a refreshing salad.'],
    ['Dal Rice Bowl', 199, 'veg', 'Comforting dal over steamed rice with pickle and a crisp papad.'],
    ['Rajma Chawal', 219, 'veg', 'Slow-cooked kidney bean curry served over steamed rice with onion salad.'],
  ]],
  ['Desserts', [
    ['Rasmalai', 169, 'veg', 'Soft cottage-cheese rounds soaked in chilled, saffron-scented sweetened milk.'],
    ['Kesar Phirni', 149, 'veg', 'Creamy ground-rice pudding chilled in a clay cup with saffron and pistachio.'],
    ['Gajar Ka Halwa', 179, 'veg', 'Slow-cooked carrot pudding with milk, ghee, cardamom and toasted nuts.'],
    ['Chocolate Brownie', 189, 'veg', 'A warm, fudgy chocolate brownie with a delicate crisp top.'],
    ['Mango Kulfi', 129, 'veg', 'Traditional slow-set kulfi made creamy with ripe mango and a touch of cardamom.'],
    ['Caramel Custard', 149, 'veg', 'Silky baked custard topped with a light golden caramel sauce.'],
    ['Jalebi Rabri', 199, 'veg', 'Crisp saffron jalebi served with thickened sweet milk and chopped pistachio.'],
  ]],
  ['Drinks', [
    ['Sweet Lassi', 99, 'veg', 'Chilled yogurt blended smooth with a little sugar and cardamom.'],
    ['Salted Lassi', 99, 'veg', 'Cooling yogurt drink seasoned with roasted cumin and a pinch of salt.'],
    ['Mango Lassi', 129, 'veg', 'Ripe mango blended with chilled yogurt for a thick, refreshing drink.'],
    ['Fresh Lime Soda', 89, 'veg', 'Fresh lime and sparkling soda served sweet, salted or half-and-half.'],
    ['Masala Chaas', 79, 'veg', 'Light, chilled buttermilk seasoned with roasted cumin, mint and black salt.'],
  ]],
]

const ratingNotes = [
  'Fresh, well-seasoned and packed with care.',
  'A comforting portion with lovely balanced flavors.',
  'Arrived warm and tasted just as described.',
  'Really enjoyable; the spices were nicely balanced.',
  'A generous serving and a satisfying meal.',
]

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const menuCatalog = catalogGroups.flatMap(([category, dishes]) =>
  dishes.map(([name, price, type, description], index) => {
    const id = `dish-${slugify(name)}`
    const rating = Number((4 + ((menuCatalogIndex(category, dishes, index) * 7) % 10) / 10).toFixed(1))

    return {
      id,
      name,
      category,
      price,
      type,
      description,
      popular: category === 'Recommended' && index < 4,
      votes: 8 + ((index * 13 + name.length) % 83),
      rating,
      reviewCount: 1,
      reviews: [{
        author: 'Sample diner',
        rating,
        text: `${ratingNotes[(index + name.length) % ratingNotes.length]} ${name} was a good pick.`,
      }],
    }
  })
)

function menuCatalogIndex(category, dishes, index) {
  return catalogGroups.slice(0, catalogGroups.findIndex(([group]) => group === category))
    .reduce((count, [, items]) => count + items.length, 0) + index
}

module.exports = menuCatalog
