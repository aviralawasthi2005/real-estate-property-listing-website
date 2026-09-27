import { errorHandler } from '../utils/error.js';

export const validateSignup = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return next(errorHandler(400, 'Username must be at least 3 characters long.'));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return next(errorHandler(400, 'Please provide a valid email address.'));
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return next(errorHandler(400, 'Password must be at least 6 characters long.'));
  }

  req.body.username = username.trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateSignin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, 'Email and password are required.'));
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateListing = (req, res, next) => {
  const { name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, type } = req.body;

  if (!name || name.trim().length === 0) {
    return next(errorHandler(400, 'Listing name is required.'));
  }
  if (!description || description.trim().length === 0) {
    return next(errorHandler(400, 'Listing description is required.'));
  }
  if (!address || address.trim().length === 0) {
    return next(errorHandler(400, 'Listing address is required.'));
  }
  if (regularPrice === undefined || Number(regularPrice) <= 0) {
    return next(errorHandler(400, 'Regular price must be greater than 0.'));
  }
  if (req.body.offer && Number(discountPrice) >= Number(regularPrice)) {
    return next(errorHandler(400, 'Discount price must be less than regular price.'));
  }
  if (bathrooms === undefined || Number(bathrooms) < 1) {
    return next(errorHandler(400, 'Bathrooms must be at least 1.'));
  }
  if (bedrooms === undefined || Number(bedrooms) < 1) {
    return next(errorHandler(400, 'Bedrooms must be at least 1.'));
  }
  if (!['sale', 'rent'].includes(type)) {
    return next(errorHandler(400, 'Type must be either "sale" or "rent".'));
  }

  next();
};
