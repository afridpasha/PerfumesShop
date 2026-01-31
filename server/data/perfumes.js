const perfumes = [
  {
    name: 'Floral Elegance',
    image: 'https://img.freepik.com/premium-photo/floral-elegance-perfume_1022901-11941.jpg',
    description:
      'A delicate blend of rose and jasmine that evokes memories of spring gardens in full bloom. The top notes of bergamot and lemon add a refreshing citrus touch, while the base of sandalwood and musk provide depth and longevity.',
    brand: 'Royal Scents',
    category: 'Floral',
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
    concentration: 'Eau de Parfum',
    notes: {
      top: ['Bergamot', 'Lemon'],
      middle: ['Rose', 'Jasmine'],
      base: ['Sandalwood', 'Musk']
    },
    sizeOptions: ['30ml', '50ml', '100ml']
  },
  {
    name: 'Ocean Breeze',
    image: 'https://m.media-amazon.com/images/I/71uhg4Dl8eL._SL1500_.jpg',
    description:
      'Fresh and invigorating marine scent that captures the essence of a coastal getaway. Notes of sea salt, cucumber, and aquatic accords create a clean, refreshing experience.',
    brand: 'Azure',
    category: 'Fresh',
    price: 75.50,
    countInStock: 7,
    rating: 4.0,
    numReviews: 8,
    concentration: 'Eau de Toilette',
    notes: {
      top: ['Sea Salt', 'Cucumber'],
      middle: ['Water Lily', 'Green Apple'],
      base: ['Amber', 'Cedar']
    },
    sizeOptions: ['30ml', '50ml', '100ml']
  },
  {
    name: 'Midnight Mystery',
    image: 'https://img.perfume.com/images/products/parent/medium/73787w.jpg',
    description:
      'Rich and sensual with woody undertones, this fragrance is perfect for evening wear. Dark vanilla, exotic spices, and smoky incense create an aura of sophistication and intrigue.',
    brand: 'Black Diamond',
    category: 'Oriental',
    price: 120.00,
    countInStock: 5,
    rating: 4.8,
    numReviews: 15,
    concentration: 'Parfum',
    notes: {
      top: ['Black Pepper', 'Cardamom'],
      middle: ['Incense', 'Oud'],
      base: ['Vanilla', 'Tonka Bean']
    },
    sizeOptions: ['50ml', '100ml']
  },
  {
    name: 'Citrus Splash',
    image: 'https://www.birkholz-perfumes.com/cdn/shop/files/cITRUSsPLASH.jpg?v=1707832768',
    description:
      'A vibrant and energizing fragrance that combines zesty citrus notes with a hint of green herbs, perfect for daytime wear and providing a refreshing boost at any time.',
    brand: 'Sunshine',
    category: 'Citrus',
    price: 65.00,
    countInStock: 15,
    rating: 4.2,
    numReviews: 10,
    concentration: 'Eau de Toilette',
    notes: {
      top: ['Lemon', 'Grapefruit', 'Mandarin'],
      middle: ['Basil', 'Mint'],
      base: ['Cedarwood', 'White Musk']
    },
    sizeOptions: ['30ml', '50ml', '100ml']
  },
  {
    name: 'Spice Harmony',
    image: 'https://fimgs.net/mdimg/secundar/o.73482.jpg',
    description:
      'An exotic blend of warm spices and rich amber that creates a cozy and comforting aura. Ideal for fall and winter months, this fragrance wraps you in a blanket of warmth.',
    brand: 'Amber & Spice',
    category: 'Spicy',
    price: 95.00,
    countInStock: 8,
    rating: 4.6,
    numReviews: 9,
    concentration: 'Eau de Parfum',
    notes: {
      top: ['Cinnamon', 'Nutmeg'],
      middle: ['Clove', 'Jasmine'],
      base: ['Amber', 'Vanilla', 'Sandalwood']
    },
    sizeOptions: ['50ml', '100ml']
  }
];

module.exports = perfumes; 