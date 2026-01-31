const asyncHandler = require('express-async-handler');
const Perfume = require('../models/Perfume');
const { notifySubscribers } = require('./newsletterController');

// @desc    Fetch all perfumes
// @route   GET /api/perfumes
// @access  Public
const getPerfumes = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching all perfumes...');
    const perfumes = await Perfume.find({});
    console.log(`Found ${perfumes.length} perfumes`);
    res.json(perfumes);
  } catch (error) {
    console.error('Error in getPerfumes controller:', error);
    res.status(500);
    throw new Error('Server error fetching perfumes');
  }
});

// @desc    Fetch single perfume
// @route   GET /api/perfumes/:id
// @access  Public
const getPerfumeById = asyncHandler(async (req, res) => {
  const perfume = await Perfume.findById(req.params.id);

  if (perfume) {
    res.json(perfume);
  } else {
    res.status(404);
    throw new Error('Perfume not found');
  }
});

// @desc    Delete a perfume
// @route   DELETE /api/perfumes/:id
// @access  Private/Admin
const deletePerfume = asyncHandler(async (req, res) => {
  const perfume = await Perfume.findById(req.params.id);

  if (perfume) {
    await Perfume.deleteOne({ _id: perfume._id });
    res.json({ message: 'Perfume removed' });
  } else {
    res.status(404);
    throw new Error('Perfume not found');
  }
});

// @desc    Create a perfume
// @route   POST /api/perfumes
// @access  Private/Admin
const createPerfume = asyncHandler(async (req, res) => {
  const perfume = new Perfume({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    concentration: 'Eau de Parfum',
    notes: {
      top: ['Sample top note'],
      middle: ['Sample middle note'],
      base: ['Sample base note']
    },
    sizeOptions: ['30ml', '50ml', '100ml']
  });

  const createdPerfume = await perfume.save();
  
  // Send email to all newsletter subscribers
  await notifySubscribers(createdPerfume);
  
  res.status(201).json(createdPerfume);
});

// @desc    Update a perfume
// @route   PUT /api/perfumes/:id
// @access  Private/Admin
const updatePerfume = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    concentration,
    notes,
    sizeOptions
  } = req.body;

  const perfume = await Perfume.findById(req.params.id);

  if (perfume) {
    perfume.name = name || perfume.name;
    perfume.price = price || perfume.price;
    perfume.description = description || perfume.description;
    perfume.image = image || perfume.image;
    perfume.brand = brand || perfume.brand;
    perfume.category = category || perfume.category;
    perfume.countInStock = countInStock || perfume.countInStock;
    perfume.concentration = concentration || perfume.concentration;
    perfume.notes = notes || perfume.notes;
    perfume.sizeOptions = sizeOptions || perfume.sizeOptions;

    const updatedPerfume = await perfume.save();
    res.json(updatedPerfume);
  } else {
    res.status(404);
    throw new Error('Perfume not found');
  }
});

// @desc    Create new review
// @route   POST /api/perfumes/:id/reviews
// @access  Private
const createPerfumeReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const perfume = await Perfume.findById(req.params.id);

  if (perfume) {
    const alreadyReviewed = perfume.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Perfume already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    perfume.reviews.push(review);

    perfume.numReviews = perfume.reviews.length;

    perfume.rating =
      perfume.reviews.reduce((acc, item) => item.rating + acc, 0) /
      perfume.reviews.length;

    await perfume.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Perfume not found');
  }
});

// @desc    Get top rated perfumes
// @route   GET /api/perfumes/top
// @access  Public
const getTopPerfumes = asyncHandler(async (req, res) => {
  const perfumes = await Perfume.find({}).sort({ rating: -1 }).limit(3);

  res.json(perfumes);
});

module.exports = {
  getPerfumes,
  getPerfumeById,
  deletePerfume,
  createPerfume,
  updatePerfume,
  createPerfumeReview,
  getTopPerfumes,
}; 