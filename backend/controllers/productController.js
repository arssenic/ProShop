import asyncHandler from '../middleware/asyncHandler.js';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import productsData from '../data/products.js';

const fallbackProducts = productsData.map((product, index) => ({
  ...product,
  _id: String(index + 1).padStart(24, '0'),
  reviews: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const isMongoConnected = () => mongoose.connection.readyState === 1;

const getPageSize = () => Number(process.env.PAGINATION_LIMIT) || 24;

// Helper to sanitize search strings for plurals/boundaries
const cleanSearchTerm = (term) => {
  if (!term) return '';
  let cleaned = term.trim();
  // Strip trailing 's' for plural terms (e.g., "books" -> "book", "phones" -> "phone")
  if (cleaned.toLowerCase().endsWith('s') && cleaned.length > 3) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
};

const getFallbackProducts = ({ keyword, category, pageNumber }) => {
  const pageSize = getPageSize();
  const page = Number(pageNumber) || 1;
  
  const cleanedKeyword = cleanSearchTerm(keyword);
  // Using word boundary \b to prevent matching "headphones" when searching for "phone"
  const keywordRegex = cleanedKeyword ? new RegExp(`\\b${cleanedKeyword}`, 'i') : null;
  const categoryRegex = category ? new RegExp(`^${category}$`, 'i') : null;

  const filteredProducts = fallbackProducts.filter((product) => {
    const matchesKeyword = keywordRegex ? keywordRegex.test(product.name) : true;
    const matchesCategory = categoryRegex
      ? categoryRegex.test(product.category)
      : true;

    return matchesKeyword && matchesCategory;
  });

  const products = filteredProducts.slice(
    pageSize * (page - 1),
    pageSize * page
  );

  return {
    products,
    page,
    pages: Math.ceil(filteredProducts.length / pageSize) || 1,
  };
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    return res.json(
      getFallbackProducts({
        keyword: req.query.keyword,
        category: req.query.category,
        pageNumber: req.query.pageNumber,
      })
    );
  }

  const pageSize = getPageSize();
  const page = Number(req.query.pageNumber) || 1;

  const cleanedKeyword = cleanSearchTerm(req.query.keyword);

  const keyword = cleanedKeyword
    ? {
        name: {
          $regex: `\\b${cleanedKeyword}`,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category
    ? {
        category: {
          $regex: `^${req.query.category}$`,
          $options: 'i',
        },
      }
    : {};

  const filters = { ...keyword, ...category };

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    const product = fallbackProducts.find((item) => item._id === req.params.id);

    if (product) {
      return res.json(product);
    }

    res.status(404);
    throw new Error('Product not found');
  }

  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    const products = [...fallbackProducts]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    return res.json(products);
  }

  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};