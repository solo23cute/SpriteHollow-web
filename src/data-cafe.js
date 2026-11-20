/* The Hollow Cafe: a cozy wave of pizzas, cocoa, candy, and rescue-team meals.
   Price tiers mirror the ordinary market: 7-9 coin treats and drinks, 14-17
   coin meals. Effects are audited against the full FOODS table so no cafe item
   is strictly dominated; candy keeps its sugar cost and small portions instead
   of replacing a meal. */

const CAFE_FOODS = {
  parlorslice: { id: 'parlorslice', name: 'Pizza Parlor Slice', emoji: '🍕', price: 14, hunger: 46, joy: 14, energy: 4, xp: 13, desc: '+46 food · +14 joy · +4 rest', cat: 'cafe' },
  fishdog: { id: 'fishdog', name: 'Fish Dog', emoji: '🌭', price: 15, hunger: 44, energy: 6, joy: 16, xp: 14, desc: '+44 food · +16 joy · +6 rest', cat: 'cafe' },
  pufflepasta: { id: 'pufflepasta', name: 'Puffle Pasta', emoji: '🍝', price: 16, hunger: 52, energy: 8, joy: 10, clean: -1, xp: 16, desc: '+52 food · +10 joy · +8 rest · -1 clean', cat: 'cafe' },
  snowfortstew: { id: 'snowfortstew', name: 'Snow Fort Stew', emoji: '🍲', price: 15, hunger: 50, energy: 12, joy: 8, xp: 14, desc: '+50 food · +8 joy · +12 rest', cat: 'cafe' },
  coveburger: { id: 'coveburger', name: 'Cove Burger', emoji: '🍔', price: 17, hunger: 54, joy: 12, energy: 6, xp: 16, desc: '+54 food · +12 joy · +6 rest', cat: 'cafe' },
  mountainchili: { id: 'mountainchili', name: 'Mountain Chili', emoji: '🥘', price: 16, hunger: 54, energy: 10, joy: 8, clean: -2, xp: 15, desc: '+54 food · +8 joy · +10 rest · -2 clean', cat: 'cafe' },

  creamsoda: { id: 'creamsoda', name: 'Cream Soda', emoji: '🧋', price: 8, energy: 22, joy: 18, xp: 9, desc: '+22 rest · +18 joy', cat: 'cafe' },
  berrytea: { id: 'berrytea', name: 'Berry Iced Tea', emoji: '🧃', price: 7, energy: 16, joy: 18, clean: 4, xp: 8, desc: '+16 rest · +18 joy · +4 clean', cat: 'cafe' },
  mintcocoa: { id: 'mintcocoa', name: 'Mint Cocoa', emoji: '☕', price: 9, energy: 26, joy: 16, clean: 2, xp: 9, desc: '+26 rest · +16 joy · +2 clean', cat: 'cafe' },
  orangefizz: { id: 'orangefizz', name: 'Orange Fizz', emoji: '🥤', price: 7, energy: 24, joy: 12, xp: 8, desc: '+24 rest · +12 joy', cat: 'cafe' },
  pufflelatte: { id: 'pufflelatte', name: 'Puffle Latte', emoji: '☕', price: 10, energy: 30, joy: 14, xp: 10, desc: '+30 rest · +14 joy', cat: 'cafe' },

  pufflepop: { id: 'pufflepop', name: 'Puffle Pop', emoji: '🍭', price: 9, hunger: 8, joy: 24, bond: 1, xp: 9, desc: '+8 food · +24 joy · +bond', cat: 'cafe', candy: true },
  snowcone: { id: 'snowcone', name: 'Snow Cone', emoji: '🍧', price: 7, hunger: 10, joy: 22, clean: 4, xp: 8, desc: '+10 food · +22 joy · +4 clean', cat: 'cafe', candy: true },
  chocolatecoin: { id: 'chocolatecoin', name: 'Chocolate Coin', emoji: '🍫', price: 7, hunger: 8, joy: 26, bond: 1, xp: 8, desc: '+8 food · +26 joy · +bond', cat: 'cafe', candy: true },
  marshmallowpuff: { id: 'marshmallowpuff', name: 'Marshmallow Puff', emoji: '🍡', price: 8, hunger: 10, joy: 24, bond: 1, xp: 8, desc: '+10 food · +24 joy · +bond', cat: 'cafe', candy: true },
  candycanecrunch: { id: 'candycanecrunch', name: 'Candy Cane Crunch', emoji: '🍬', price: 7, hunger: 12, joy: 24, clean: 3, xp: 9, desc: '+12 food · +24 joy · +3 clean', cat: 'cafe', candy: true },
  frosteddonut: { id: 'frosteddonut', name: 'Frosted Donut', emoji: '🍩', price: 8, hunger: 18, joy: 22, xp: 10, desc: '+18 food · +22 joy', cat: 'cafe', candy: true },
};

const CAFE_SNACKS = {
  snowballcookie: { id: 'snowballcookie', name: 'Snowball Cookie', emoji: '🍪', hunger: 14, joy: 12, bond: 1, xp: 9, desc: '+14 food · +12 joy · +bond', cat: 'sweet' },
  pufflecracker: { id: 'pufflecracker', name: 'Puffle Crackers', emoji: '🍘', hunger: 16, joy: 8, xp: 9, desc: '+16 food · +8 joy', cat: 'savory' },
  seaweedcrisp: { id: 'seaweedcrisp', name: 'Seaweed Crisps', emoji: '🌿', hunger: 10, clean: 4, xp: 8, desc: '+10 food · +4 clean', cat: 'savory' },
  snowflakecandy: { id: 'snowflakecandy', name: 'Snowflake Candy', emoji: '❄️', joy: 16, clean: 2, xp: 9, desc: '+16 joy · +2 clean', cat: 'sweet' },
};

/* First-release recipe loop: each Club game teaches one cafe recipe. A recipe
   is permanent, unlocks the food in the market, and stocks one free serving. */
const CAFE_RECIPES = {
  pizzaparlor: { game: 'pizzaparlor', food: 'parlorslice', title: 'Pizza Parlor', hint: 'Finish one Pizza Parlor shift.' },
  pufflepatrol: { game: 'pufflepatrol', food: 'snowfortstew', title: 'Puffle Patrol', hint: 'Finish one Puffle Patrol rescue.' },
  jetpackjaunt: { game: 'jetpackjaunt', food: 'orangefizz', title: 'Jetpack Jaunt', hint: 'Finish one Jetpack Jaunt flight.' },
};

const CAFE_RECIPE_BY_GAME = Object.fromEntries(Object.values(CAFE_RECIPES).map((recipe) => [recipe.game, recipe]));
const CAFE_RECIPE_BY_FOOD = Object.fromEntries(Object.values(CAFE_RECIPES).map((recipe) => [recipe.food, recipe]));
const CAFE_RECIPE_FOODS = Object.keys(CAFE_RECIPE_BY_FOOD);

function cafeRecipeForGame(game) {
  return CAFE_RECIPE_BY_GAME[game] || null;
}

function cafeRecipeForFood(food) {
  return CAFE_RECIPE_BY_FOOD[food] || null;
}

function cafeRecipeUnlocked(food) {
  return typeof state !== 'undefined'
    && Array.isArray(state.cafeRecipes)
    && state.cafeRecipes.includes(food);
}

function cafeFoodLocked(food) {
  const recipe = cafeRecipeForFood(food);
  return !!recipe && !cafeRecipeUnlocked(food);
}

const CAFE_DIET = {
  parlorslice: { path: 'hearty', gain: 2 },
  fishdog: { path: 'hearty', gain: 1 },
  pufflepasta: { path: 'hearty', gain: 2 },
  snowfortstew: { path: 'hearty', gain: 2 },
  coveburger: { path: 'hearty', gain: 2 },
  mountainchili: { path: 'hearty', gain: 2 },
  creamsoda: { path: 'sweet', gain: 1 },
  berrytea: { path: 'sweet', gain: 1 },
  mintcocoa: { path: 'sweet', gain: 1 },
  orangefizz: { path: 'wild', gain: 1 },
  pufflelatte: { path: 'sweet', gain: 1 },
  pufflepop: { path: 'sweet', gain: 2 },
  snowcone: { path: 'sweet', gain: 2 },
  chocolatecoin: { path: 'sweet', gain: 2 },
  marshmallowpuff: { path: 'sweet', gain: 2 },
  candycanecrunch: { path: 'sweet', gain: 1 },
  frosteddonut: { path: 'sweet', gain: 2 },
  snowballcookie: { path: 'sweet', gain: 1 },
  pufflecracker: { path: 'hearty', gain: 1 },
  seaweedcrisp: { path: 'wild', gain: 1 },
  snowflakecandy: { path: 'sweet', gain: 1 },
};

const CAFE_CANDY_KEYS = Object.keys(CAFE_FOODS).filter((key) => CAFE_FOODS[key].candy);

FOOD_CATEGORIES.cafe = { name: 'Hollow Cafe', icon: '☕' };
Object.assign(FOODS, CAFE_FOODS);
Object.assign(SNACKS, CAFE_SNACKS);
Object.assign(FOOD_DIET, CAFE_DIET);
FOOD_KEYS.push(...Object.keys(CAFE_FOODS));
SNACK_KEYS.push(...Object.keys(CAFE_SNACKS));
CANDY_ITEMS.push(...CAFE_CANDY_KEYS);

/* Club Penguin's own menu: the Pizza Parlor, Coffee Shop, and Puffle Catalog
   staples, gathered as one cafe counter. These are ordinary market foods so
   they can be bought, kept in the pantry, and fed like every other dish. */
const CLUB_PENGUIN_FOODS = {
  cp_puffleos: { id: 'cp_puffleos', name: "Puffle O's", emoji: '🥣', price: 9, hunger: 38, energy: 6, joy: 8, xp: 12, desc: '+38 food · +8 joy · +6 rest', cat: 'cp' },
  cp_fish: { id: 'cp_fish', name: 'Fish', emoji: '🐟', price: 8, hunger: 32, energy: 6, xp: 8, desc: '+32 food · +6 rest', cat: 'cp' },
  cp_greyfish: { id: 'cp_greyfish', name: 'Grey Fish', emoji: '🐟', price: 9, hunger: 34, joy: 4, xp: 9, desc: '+34 food · +4 joy', cat: 'cp' },
  cp_fishburger: { id: 'cp_fishburger', name: 'Fishburger', emoji: '🍔', price: 14, hunger: 46, joy: 10, energy: 4, xp: 13, desc: '+46 food · +10 joy · +4 rest', cat: 'cp' },
  cp_mullet: { id: 'cp_mullet', name: 'Mullet', emoji: '🐟', price: 10, hunger: 36, clean: 2, xp: 9, desc: '+36 food · +2 clean', cat: 'cp' },
  cp_squid: { id: 'cp_squid', name: 'Squid', emoji: '🦑', price: 12, hunger: 34, energy: 8, xp: 10, desc: '+34 food · +8 rest', cat: 'cp' },
  cp_shrimp: { id: 'cp_shrimp', name: 'Shrimp', emoji: '🍤', price: 11, hunger: 30, clean: 2, xp: 9, desc: '+30 food · +2 clean', cat: 'cp' },
  cp_sushi: { id: 'cp_sushi', name: 'Sushi', emoji: '🍣', price: 13, hunger: 38, energy: 8, joy: 6, xp: 12, desc: '+38 food · +8 rest · +6 joy', cat: 'cp' },
  cp_pizza: { id: 'cp_pizza', name: 'Pizza', emoji: '🍕', price: 12, hunger: 44, joy: 10, xp: 12, desc: '+44 food · +10 joy', cat: 'cp' },
  cp_cheese: { id: 'cp_cheese', name: 'Cheese', emoji: '🧀', price: 7, hunger: 22, joy: 6, xp: 7, desc: '+22 food · +6 joy', cat: 'cp' },
  cp_stinkycheese: { id: 'cp_stinkycheese', name: 'Stinky Cheese', emoji: '🧀', price: 8, hunger: 26, joy: 4, clean: -2, xp: 8, desc: '+26 food · +4 joy · -2 clean', cat: 'cp' },
  cp_taco: { id: 'cp_taco', name: 'Taco', emoji: '🌮', price: 11, hunger: 36, joy: 10, clean: -1, xp: 10, desc: '+36 food · +10 joy · -1 clean', cat: 'cp' },
  cp_fries: { id: 'cp_fries', name: 'Fries', emoji: '🍟', price: 6, hunger: 24, joy: 10, clean: -2, xp: 7, desc: '+24 food · +10 joy · -2 clean', cat: 'cp' },
  cp_waffles: { id: 'cp_waffles', name: 'Waffles', emoji: '🧇', price: 9, hunger: 30, energy: 6, joy: 12, xp: 9, desc: '+30 food · +12 joy · +6 rest', cat: 'cp' },
  cp_croissant: { id: 'cp_croissant', name: 'Croissant', emoji: '🥐', price: 7, hunger: 20, joy: 12, xp: 8, desc: '+20 food · +12 joy', cat: 'cp' },
  cp_chips: { id: 'cp_chips', name: 'Chips', emoji: '🥔', price: 5, hunger: 18, joy: 10, clean: -1, xp: 6, desc: '+18 food · +10 joy · -1 clean', cat: 'cp' },
  cp_salsa: { id: 'cp_salsa', name: 'Salsa', emoji: '🥣', price: 5, hunger: 12, joy: 8, clean: -1, xp: 6, desc: '+12 food · +8 joy · -1 clean', cat: 'cp' },
  cp_biscuit: { id: 'cp_biscuit', name: 'Biscuit Treat', emoji: '🍪', price: 5, hunger: 16, joy: 8, bond: 1, xp: 6, desc: '+16 food · +8 joy · +bond', cat: 'cp' },
  cp_preserve: { id: 'cp_preserve', name: 'Country Preserve', emoji: '🍯', price: 8, hunger: 16, joy: 14, xp: 8, desc: '+16 food · +14 joy', cat: 'cp' },
  cp_pizzasauce: { id: 'cp_pizzasauce', name: 'Pizza Sauce', emoji: '🍅', price: 4, hunger: 8, joy: 8, clean: -1, xp: 5, desc: '+8 food · +8 joy · -1 clean', cat: 'cp' },
  cp_bubblegum: { id: 'cp_bubblegum', name: 'Bubble Gum', emoji: '🍬', price: 4, joy: 18, bond: 1, xp: 6, desc: '+18 joy · +bond', cat: 'cp' },
  cp_cookie: { id: 'cp_cookie', name: 'Cookie', emoji: '🍪', price: 4, hunger: 12, joy: 10, bond: 1, xp: 6, desc: '+12 food · +10 joy · +bond', cat: 'cp' },
  cp_cake: { id: 'cp_cake', name: 'Cake', emoji: '🍰', price: 11, hunger: 24, joy: 22, xp: 12, desc: '+24 food · +22 joy', cat: 'cp' },
  cp_popcorn: { id: 'cp_popcorn', name: 'Popcorn', emoji: '🍿', price: 5, hunger: 12, joy: 18, xp: 6, desc: '+12 food · +18 joy', cat: 'cp' },
  cp_gingerbread: { id: 'cp_gingerbread', name: 'Gingerbread Man Cookie', emoji: '🍪', price: 6, hunger: 14, joy: 16, bond: 1, xp: 7, desc: '+14 food · +16 joy · +bond', cat: 'cp' },
  cp_chocolate: { id: 'cp_chocolate', name: 'Chocolate Bar', emoji: '🍫', price: 6, hunger: 10, joy: 18, xp: 7, desc: '+10 food · +18 joy', cat: 'cp' },
  cp_chocchips: { id: 'cp_chocchips', name: 'Chocolate Chips', emoji: '🍫', price: 5, hunger: 8, joy: 14, xp: 6, desc: '+8 food · +14 joy', cat: 'cp' },
  cp_chocsauce: { id: 'cp_chocsauce', name: 'Chocolate Sauce', emoji: '🍫', price: 5, hunger: 6, joy: 16, clean: -2, xp: 6, desc: '+6 food · +16 joy · -2 clean', cat: 'cp' },
  cp_icecream: { id: 'cp_icecream', name: 'Ice Cream', emoji: '🍦', price: 7, hunger: 14, joy: 20, clean: -2, xp: 8, desc: '+14 food · +20 joy · -2 clean', cat: 'cp' },
  cp_jellybeans: { id: 'cp_jellybeans', name: 'Jelly Beans', emoji: '🍬', price: 5, joy: 18, xp: 6, desc: '+18 joy', cat: 'cp' },
  cp_licorice: { id: 'cp_licorice', name: 'Licorice', emoji: '🍬', price: 4, joy: 16, xp: 5, desc: '+16 joy', cat: 'cp' },
  cp_marshmallow: { id: 'cp_marshmallow', name: 'Marshmallow', emoji: '🍡', price: 5, hunger: 8, joy: 16, bond: 1, xp: 6, desc: '+8 food · +16 joy · +bond', cat: 'cp' },
  cp_pinkicing: { id: 'cp_pinkicing', name: 'Pink Icing', emoji: '🧁', price: 4, joy: 20, clean: -3, xp: 6, desc: '+20 joy · -3 clean', cat: 'cp' },
  cp_sprinkles: { id: 'cp_sprinkles', name: 'Sprinkles', emoji: '✨', price: 4, joy: 18, clean: -2, xp: 5, desc: '+18 joy · -2 clean', cat: 'cp' },
  cp_cottoncandy: { id: 'cp_cottoncandy', name: 'Cotton Candy', emoji: '🍭', price: 5, joy: 20, xp: 6, desc: '+20 joy', cat: 'cp' },
  cp_lollipop: { id: 'cp_lollipop', name: 'Lollipop', emoji: '🍭', price: 4, joy: 18, xp: 5, desc: '+18 joy', cat: 'cp' },
  cp_candyapple: { id: 'cp_candyapple', name: 'Candy Apple', emoji: '🍎', price: 6, hunger: 16, joy: 20, xp: 7, desc: '+16 food · +20 joy', cat: 'cp' },
  cp_anniversarycake: { id: 'cp_anniversarycake', name: 'Anniversary Cake', emoji: '🎂', price: 15, hunger: 28, joy: 26, bond: 2, xp: 14, desc: '+28 food · +26 joy · +2 bond', cat: 'cp' },
  cp_pie: { id: 'cp_pie', name: 'Pie', emoji: '🥧', price: 9, hunger: 24, joy: 18, clean: -2, xp: 10, desc: '+24 food · +18 joy · -2 clean', cat: 'cp' },
  cp_candy: { id: 'cp_candy', name: 'Candy', emoji: '🍬', price: 4, joy: 16, xp: 5, desc: '+16 joy', cat: 'cp' },
  cp_coffee: { id: 'cp_coffee', name: 'Coffee', emoji: '☕', price: 6, energy: 26, joy: 8, xp: 7, desc: '+26 rest · +8 joy', cat: 'cp' },
  cp_hotchoc: { id: 'cp_hotchoc', name: 'Hot Chocolate', emoji: '☕', price: 8, energy: 24, joy: 14, clean: 2, xp: 8, desc: '+24 rest · +14 joy · +2 clean', cat: 'cp' },
  cp_juice: { id: 'cp_juice', name: 'Fruit Juice', emoji: '🧃', price: 6, energy: 18, joy: 12, xp: 7, desc: '+18 rest · +12 joy', cat: 'cp' },
  cp_smoothie: { id: 'cp_smoothie', name: 'Smoothie', emoji: '🥤', price: 8, energy: 20, joy: 16, clean: 3, xp: 8, desc: '+20 rest · +16 joy · +3 clean', cat: 'cp' },
  cp_tea: { id: 'cp_tea', name: 'Tea', emoji: '🍵', price: 5, energy: 16, joy: 10, clean: 2, xp: 6, desc: '+16 rest · +10 joy · +2 clean', cat: 'cp' },
  cp_carrot: { id: 'cp_carrot', name: 'Carrot', emoji: '🥕', price: 3, hunger: 18, joy: 4, xp: 5, desc: '+18 food · +4 joy', cat: 'cp' },
  cp_apple: { id: 'cp_apple', name: 'Apple', emoji: '🍎', price: 3, hunger: 18, joy: 5, xp: 5, desc: '+18 food · +5 joy', cat: 'cp' },
  cp_cayenne: { id: 'cp_cayenne', name: 'Cayenne Pepper', emoji: '🌶️', price: 6, hunger: 14, energy: 8, joy: 6, xp: 7, desc: '+14 food · +8 rest · +6 joy', cat: 'cp' },
  cp_broccoli: { id: 'cp_broccoli', name: 'Broccoli', emoji: '🥦', price: 5, hunger: 18, clean: 5, xp: 6, desc: '+18 food · +5 clean', cat: 'cp' },
  cp_dragonfruit: { id: 'cp_dragonfruit', name: 'Dragon Fruit', emoji: '🍈', price: 8, hunger: 24, joy: 8, xp: 8, desc: '+24 food · +8 joy', cat: 'cp' },
  cp_pickles: { id: 'cp_pickles', name: 'Pickle', emoji: '🥒', price: 4, hunger: 14, joy: 6, xp: 5, desc: '+14 food · +6 joy', cat: 'cp' },
  cp_corn: { id: 'cp_corn', name: 'Corn', emoji: '🌽', price: 4, hunger: 18, joy: 5, xp: 5, desc: '+18 food · +5 joy', cat: 'cp' },
  cp_fruit: { id: 'cp_fruit', name: 'Fruit Basket', emoji: '🍇', price: 6, hunger: 20, joy: 10, clean: 3, xp: 7, desc: '+20 food · +10 joy · +3 clean', cat: 'cp' },
  cp_water: { id: 'cp_water', name: 'Water', emoji: '💧', price: 2, energy: 14, clean: 3, xp: 4, desc: '+14 rest · +3 clean', cat: 'cp' },
  cp_hotsauce: { id: 'cp_hotsauce', name: 'Hot Sauce', emoji: '🌶️', price: 4, hunger: 6, joy: 12, clean: -2, xp: 5, desc: '+6 food · +12 joy · -2 clean', cat: 'cp' },
};

const CLUB_PENGUIN_DIET_GROUPS = {
  hearty: ['cp_puffleos', 'cp_fish', 'cp_greyfish', 'cp_fishburger', 'cp_mullet', 'cp_squid', 'cp_shrimp', 'cp_sushi', 'cp_pizza', 'cp_cheese', 'cp_stinkycheese', 'cp_taco', 'cp_fries', 'cp_waffles', 'cp_croissant', 'cp_chips', 'cp_salsa', 'cp_biscuit', 'cp_preserve', 'cp_pizzasauce'],
  sweet: ['cp_bubblegum', 'cp_cookie', 'cp_cake', 'cp_popcorn', 'cp_gingerbread', 'cp_chocolate', 'cp_chocchips', 'cp_chocsauce', 'cp_icecream', 'cp_jellybeans', 'cp_licorice', 'cp_marshmallow', 'cp_pinkicing', 'cp_sprinkles', 'cp_cottoncandy', 'cp_lollipop', 'cp_candyapple', 'cp_anniversarycake', 'cp_pie', 'cp_candy', 'cp_coffee', 'cp_hotchoc', 'cp_juice', 'cp_smoothie', 'cp_tea'],
  wild: ['cp_carrot', 'cp_apple', 'cp_cayenne', 'cp_broccoli', 'cp_dragonfruit', 'cp_pickles', 'cp_corn', 'cp_fruit', 'cp_water', 'cp_hotsauce'],
};

const CLUB_PENGUIN_DIET = {};
Object.entries(CLUB_PENGUIN_DIET_GROUPS).forEach(([path, keys]) => {
  keys.forEach((key) => { CLUB_PENGUIN_DIET[key] = { path, gain: CLUB_PENGUIN_FOODS[key].price >= 12 ? 2 : 1 }; });
});

const CLUB_PENGUIN_CANDY_KEYS = ['cp_bubblegum', 'cp_jellybeans', 'cp_licorice', 'cp_marshmallow', 'cp_pinkicing', 'cp_sprinkles', 'cp_cottoncandy', 'cp_lollipop', 'cp_candyapple', 'cp_candy'];

FOOD_CATEGORIES.cp = { name: 'Club Penguin Cafe', icon: '🐧' };
Object.assign(FOODS, CLUB_PENGUIN_FOODS);
Object.assign(FOOD_DIET, CLUB_PENGUIN_DIET);
FOOD_KEYS.push(...Object.keys(CLUB_PENGUIN_FOODS));
CANDY_ITEMS.push(...CLUB_PENGUIN_CANDY_KEYS);

/* Puffle Hotel room service. These are hotel-only gifts and orders rather than
   market stock, so the hotel can hand out a care treat after a spa run without
   disturbing the ordinary cafe shelf. */
const HOTEL_FOODS = {
  hotel_breakfast: { id: 'hotel_breakfast', name: 'Breakfast in Bed', emoji: '🥐', price: 19, hunger: 52, energy: 14, joy: 16, xp: 18, desc: '+52 food · +14 rest · +16 joy', cat: 'hotel', hotelKind: 'meal', giftOnly: true },
  hotel_feast: { id: 'hotel_feast', name: 'Grand Puffle Feast', emoji: '🍱', price: 24, hunger: 64, energy: 12, joy: 22, xp: 22, desc: '+64 food · +12 rest · +22 joy', cat: 'hotel', hotelKind: 'meal', giftOnly: true },
  hotel_soup: { id: 'hotel_soup', name: 'Spa Day Soup', emoji: '🍲', price: 16, hunger: 46, joy: 14, clean: 4, xp: 16, desc: '+46 food · +14 joy · +4 clean', cat: 'hotel', hotelKind: 'meal', giftOnly: true },
  hotel_sandwich: { id: 'hotel_sandwich', name: 'Lobby Club Sandwich', emoji: '🥪', price: 17, hunger: 50, energy: 6, joy: 12, xp: 17, desc: '+50 food · +6 rest · +12 joy', cat: 'hotel', hotelKind: 'meal', giftOnly: true },
  hotel_curry: { id: 'hotel_curry', name: 'Moonlight Curry', emoji: '🍛', price: 18, hunger: 54, energy: 10, joy: 12, clean: -1, xp: 18, desc: '+54 food · +10 rest · +12 joy · -1 clean', cat: 'hotel', hotelKind: 'meal', giftOnly: true },

  hotel_smoothie: { id: 'hotel_smoothie', name: 'Fluff & Glow Smoothie', emoji: '🥤', price: 10, energy: 24, joy: 18, clean: 3, xp: 10, desc: '+24 rest · +18 joy · +3 clean', cat: 'hotel', hotelKind: 'drink', giftOnly: true },
  hotel_cocoa: { id: 'hotel_cocoa', name: 'Pillow Mint Cocoa', emoji: '☕', price: 9, energy: 28, joy: 16, clean: 2, xp: 9, desc: '+28 rest · +16 joy · +2 clean', cat: 'hotel', hotelKind: 'drink', giftOnly: true },
  hotel_lemonade: { id: 'hotel_lemonade', name: 'Lobby Lemonade', emoji: '🍋', price: 8, energy: 20, joy: 18, clean: 3, xp: 8, desc: '+20 rest · +18 joy · +3 clean', cat: 'hotel', hotelKind: 'drink', giftOnly: true },
  hotel_boba: { id: 'hotel_boba', name: 'Bubblegum Boba', emoji: '🧋', price: 11, energy: 26, joy: 24, xp: 11, desc: '+26 rest · +24 joy', cat: 'hotel', hotelKind: 'drink', giftOnly: true },

  hotel_cookie: { id: 'hotel_cookie', name: 'Hairbrush Cookie', emoji: '🍪', price: 8, hunger: 16, joy: 22, xp: 8, desc: '+16 food · +22 joy', cat: 'hotel', hotelKind: 'treat', giftOnly: true },
  hotel_mint: { id: 'hotel_mint', name: 'Pillow Mint', emoji: '🍬', price: 7, hunger: 6, joy: 24, clean: 4, xp: 7, desc: '+6 food · +24 joy · +4 clean', cat: 'hotel', hotelKind: 'treat', giftOnly: true, candy: true },
  hotel_cupcake: { id: 'hotel_cupcake', name: 'Vanilla Cloud Cupcake', emoji: '🧁', price: 9, hunger: 18, joy: 24, xp: 9, desc: '+18 food · +24 joy', cat: 'hotel', hotelKind: 'treat', giftOnly: true },
  hotel_taffy: { id: 'hotel_taffy', name: 'Toothbrush Taffy', emoji: '🍭', price: 8, hunger: 8, joy: 20, clean: 5, xp: 8, desc: '+8 food · +20 joy · +5 clean', cat: 'hotel', hotelKind: 'treat', giftOnly: true, candy: true },
  hotel_pudding: { id: 'hotel_pudding', name: 'Cloud Nine Pudding', emoji: '🍮', price: 9, hunger: 20, joy: 22, xp: 9, desc: '+20 food · +22 joy', cat: 'hotel', hotelKind: 'treat', giftOnly: true },
};

const HOTEL_DIET = {
  hotel_breakfast: { path: 'hearty', gain: 2 },
  hotel_feast: { path: 'hearty', gain: 2 },
  hotel_soup: { path: 'hearty', gain: 2 },
  hotel_sandwich: { path: 'hearty', gain: 2 },
  hotel_curry: { path: 'hearty', gain: 2 },
  hotel_smoothie: { path: 'wild', gain: 1 },
  hotel_cocoa: { path: 'sweet', gain: 1 },
  hotel_lemonade: { path: 'wild', gain: 1 },
  hotel_boba: { path: 'sweet', gain: 1 },
  hotel_cookie: { path: 'sweet', gain: 2 },
  hotel_mint: { path: 'sweet', gain: 2 },
  hotel_cupcake: { path: 'sweet', gain: 2 },
  hotel_taffy: { path: 'sweet', gain: 2 },
  hotel_pudding: { path: 'sweet', gain: 2 },
};

const HOTEL_CANDY_KEYS = Object.keys(HOTEL_FOODS).filter((key) => HOTEL_FOODS[key].candy);
const HOTEL_CARE_KEYS = Object.keys(HOTEL_FOODS);

const HOTEL_FLAVORS = {
  bubblegum: { key: 'bubblegum', name: 'Bubblegum Burst', emoji: '🫧', color: '#ff9ec7', desc: 'Sweet and pink, with a very bubbly finish.', joy: 4 },
  mint: { key: 'mint', name: 'Polar Mint', emoji: '🌿', color: '#8fe07a', desc: 'Cold, crisp, and suspiciously refreshing.', clean: 4 },
  watermelon: { key: 'watermelon', name: 'Watermelon Splash', emoji: '🍉', color: '#ff7a7a', desc: 'A summery swirl that tastes like a pool party.', energy: 4 },
  berry: { key: 'berry', name: 'Berry Breeze', emoji: '🍓', color: '#ff6fa8', desc: 'A handful of berries in a tiny hotel glass.', joy: 3, clean: 2 },
  vanilla: { key: 'vanilla', name: 'Vanilla Cloud', emoji: '🍦', color: '#ffe6b8', desc: 'Soft vanilla foam. Mild, cozy, and very polite.', bond: 1 },
  citrus: { key: 'citrus', name: 'Citrus Spark', emoji: '🍊', color: '#ffb347', desc: 'A bright orange zing that wakes up your whiskers.', energy: 3, joy: 2 },
};

const HOTEL_SERVICES = {
  fluffdry: { key: 'fluffdry', name: 'Fluff & Dry', icon: '🛁', price: 14, desc: 'A warm towel, a big blow-dry, and a cloud of fluff.', effects: { clean: 22, hair: 18, joy: 8, bond: 2, xp: 6 } },
  pawdicure: { key: 'pawdicure', name: 'Pawdicure', icon: '💅', price: 12, desc: 'A gentle paw soak, a tidy trim, and a shiny polish.', effects: { clean: 14, joy: 12, bond: 2, xp: 5 } },
  earclean: { key: 'earclean', name: 'Ear Clean', icon: '👂', price: 10, desc: 'The careful cotton-swab treatment, with a complimentary boop.', effects: { clean: 10, hair: 6, breath: 8, joy: 6, xp: 4 } },
  spritz: { key: 'spritz', name: 'Sparkle Spritz', icon: '✨', price: 11, desc: 'A shimmering cloud of mint and hotel flowers.', effects: { breath: 20, hair: 10, joy: 10, bond: 1, xp: 4 } },
  massage: { key: 'massage', name: 'Pillow Massage', icon: '💆', price: 13, desc: 'A tiny massage table, warm stones, and a very long sigh.', effects: { energy: 24, joy: 16, bond: 3, xp: 6 } },
};

FOOD_CATEGORIES.hotel = { name: 'Puffle Hotel', icon: '🏨' };
Object.assign(FOODS, HOTEL_FOODS);
Object.assign(FOOD_DIET, HOTEL_DIET);
FOOD_KEYS.push(...Object.keys(HOTEL_FOODS));
CANDY_ITEMS.push(...HOTEL_CANDY_KEYS);
