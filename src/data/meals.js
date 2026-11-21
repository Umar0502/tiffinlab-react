// Local catalogue: 12 records with stable string IDs (FR03).
// remainingSlots = batch slots still open for the next delivery window.

const art = (bg, plate, food, food2) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="${bg}"/>` +
      `<ellipse cx="160" cy="112" rx="104" ry="70" fill="${plate}"/><ellipse cx="160" cy="108" rx="84" ry="54" fill="#fff" opacity=".9"/>` +
      `<circle cx="132" cy="100" r="24" fill="${food}"/><circle cx="182" cy="96" r="20" fill="${food2}"/>` +
      `<circle cx="158" cy="128" r="16" fill="${food2}"/><circle cx="196" cy="126" r="9" fill="${food}"/></svg>`
  )}`;

export const MEALS = [
  {
    id: 'tl-01', name: 'Chicken Karahi Power Box', category: 'Individual Box',
    description: 'Wok-style chicken karahi with tomato, ginger and green chilli, served over measured brown rice.',
    ingredients: ['chicken', 'tomato', 'ginger', 'green chilli', 'brown rice'],
    price: 750, calories: 620, protein: 48, carbs: 42, fat: 24,
    tags: ['High-Protein', 'Balanced'], highSpice: true, remainingSlots: 8,
    prepNote: 'Reheat 2 minutes in a microwave. Keeps 3 days refrigerated.',
    image: art('#f6d9a8', '#b4321e', '#d9822b', '#7a2a14'),
  },
  {
    id: 'tl-02', name: 'Grilled Chicken Tikka Bowl', category: 'Individual Box',
    description: 'Yogurt-marinated chicken tikka with cucumber raita, mint chutney and steamed vegetables.',
    ingredients: ['chicken', 'yogurt', 'cucumber', 'mint', 'broccoli'],
    price: 720, calories: 580, protein: 52, carbs: 38, fat: 20,
    tags: ['High-Protein'], highSpice: false, remainingSlots: 10,
    prepNote: 'Mild marinade. Keep the raita separate until serving.',
    image: art('#dcead3', '#2f6b4a', '#e0a13a', '#5b9a5f'),
  },
  {
    id: 'tl-03', name: 'Daal Chawal Comfort Box', category: 'Individual Box',
    description: 'Slow-cooked masoor daal with jeera rice and a small kachumber salad.',
    ingredients: ['masoor daal', 'rice', 'onion', 'tomato', 'cucumber'],
    price: 480, calories: 540, protein: 22, carbs: 78, fat: 12,
    tags: ['Vegetarian', 'Balanced'], highSpice: false, remainingSlots: 12,
    prepNote: 'Add a splash of water before reheating the daal.',
    image: art('#f3e3b5', '#c68a1d', '#e8b64a', '#f2f2e6'),
  },
  {
    id: 'tl-04', name: 'Keto Seekh Kebab Plate', category: 'Individual Box',
    description: 'Two beef-and-chicken seekh kebabs with sauteed zucchini and garlic mayo. No rice, no roti.',
    ingredients: ['beef mince', 'chicken mince', 'zucchini', 'garlic', 'mayonnaise'],
    price: 820, calories: 590, protein: 44, carbs: 12, fat: 38,
    tags: ['Keto', 'High-Protein'], highSpice: true, remainingSlots: 6,
    prepNote: 'Reheat kebabs in a pan for best texture.',
    image: art('#e7d4cb', '#7a2a14', '#a9482f', '#5b9a5f'),
  },
  {
    id: 'tl-05', name: 'Chana Chaat Protein Bowl', category: 'Add-on Bowl',
    description: 'Chickpeas, tomato, onion and tangy chaat masala. A cold add-on for any box.',
    ingredients: ['chickpeas', 'tomato', 'onion', 'lemon', 'chaat masala'],
    price: 380, calories: 310, protein: 16, carbs: 42, fat: 8,
    tags: ['Vegetarian'], highSpice: true, remainingSlots: 14,
    prepNote: 'Serve cold. Do not microwave.',
    image: art('#f8e0cf', '#d9822b', '#c9a15a', '#b4321e'),
  },
  {
    id: 'tl-06', name: 'Beef Qeema Keto Box', category: 'Individual Box',
    description: 'Dry beef qeema with spinach and cauliflower rice, finished with ghee.',
    ingredients: ['beef mince', 'spinach', 'cauliflower', 'ghee', 'spices'],
    price: 850, calories: 640, protein: 46, carbs: 10, fat: 44,
    tags: ['Keto', 'High-Protein'], highSpice: true, remainingSlots: 5,
    prepNote: 'Contains ghee. Reheat covered to keep it moist.',
    image: art('#e5d6c9', '#5a3a2a', '#8a4a2a', '#4f8f57'),
  },
  {
    id: 'tl-07', name: 'Palak Paneer & Roti Box', category: 'Individual Box',
    description: 'Creamy spinach and paneer with two wholewheat rotis and a lemon wedge.',
    ingredients: ['spinach', 'paneer', 'wholewheat flour', 'cream', 'lemon'],
    price: 640, calories: 560, protein: 28, carbs: 50, fat: 26,
    tags: ['Vegetarian', 'Balanced'], highSpice: false, remainingSlots: 9,
    prepNote: 'Warm the rotis separately for 20 seconds.',
    image: art('#d3e6d0', '#2f6b4a', '#3f8a52', '#f2f2e6'),
  },
  {
    id: 'tl-08', name: 'Student Weekly Bundle (5 lunches)', category: 'Weekly Bundle',
    description: 'Five rotating lunch boxes, Monday to Friday, built around daal, chicken and vegetable dishes. Calories and protein are per box.',
    ingredients: ['chicken', 'daal', 'rice', 'seasonal vegetables'],
    price: 3200, calories: 600, protein: 35, carbs: 62, fat: 18,
    tags: ['Balanced'], highSpice: false, remainingSlots: 4,
    prepNote: 'Delivered chilled in one insulated carrier. Eat the chicken boxes first.',
    image: art('#dbe3f3', '#2d4f9a', '#e0a13a', '#5b9a5f'),
  },
  {
    id: 'tl-09', name: 'High-Protein Weekly Bundle (5 meals)', category: 'Weekly Bundle',
    description: 'Five dinners with at least 45 g protein each: chicken, beef and egg dishes. Calories and protein are per box.',
    ingredients: ['chicken', 'beef', 'eggs', 'brown rice', 'broccoli'],
    price: 4200, calories: 620, protein: 50, carbs: 40, fat: 22,
    tags: ['High-Protein'], highSpice: false, remainingSlots: 3,
    prepNote: 'Mild seasoning across the whole bundle.',
    image: art('#f1d6d0', '#b4321e', '#e0a13a', '#f2f2e6'),
  },
  {
    id: 'tl-10', name: 'Vegetarian Weekly Bundle (5 meals)', category: 'Weekly Bundle',
    description: 'Five meat-free lunches: daal, palak paneer, vegetable pulao and two seasonal dishes. Calories and protein are per box.',
    ingredients: ['lentils', 'paneer', 'rice', 'spinach', 'seasonal vegetables'],
    price: 3000, calories: 520, protein: 26, carbs: 66, fat: 16,
    tags: ['Vegetarian', 'Balanced'], highSpice: false, remainingSlots: 6,
    prepNote: 'Contains dairy.',
    image: art('#e1efd2', '#4f8f57', '#e8b64a', '#c9a15a'),
  },
  {
    id: 'tl-11', name: 'Greek Yogurt Berry Bowl', category: 'Add-on Bowl',
    description: 'Strained yogurt with mixed berries and roasted almonds. Good as a snack or breakfast add-on.',
    ingredients: ['yogurt', 'berries', 'almonds', 'honey'],
    price: 350, calories: 260, protein: 18, carbs: 30, fat: 6,
    tags: ['Vegetarian', 'High-Protein'], highSpice: false, remainingSlots: 15,
    prepNote: 'Keep refrigerated. Eat within 2 days.',
    image: art('#ecdcf0', '#7a4a9a', '#b4326e', '#f2f2e6'),
  },
  {
    id: 'tl-12', name: 'Masala Egg Rice Bowl', category: 'Add-on Bowl',
    description: 'Egg bhurji-style masala eggs on lightly spiced rice. A filling add-on or a light dinner.',
    ingredients: ['eggs', 'rice', 'onion', 'green chilli', 'turmeric'],
    price: 420, calories: 480, protein: 24, carbs: 52, fat: 16,
    tags: ['Balanced'], highSpice: true, remainingSlots: 7,
    prepNote: 'Contains egg. Reheat 90 seconds.',
    image: art('#f8ecb8', '#d9a21d', '#f2d24a', '#b4321e'),
  },
];

export const CATEGORIES = ['Individual Box', 'Weekly Bundle', 'Add-on Bowl'];
export const DIETARY_TAGS = ['High-Protein', 'Keto', 'Vegetarian', 'Balanced'];
