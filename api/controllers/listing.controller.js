import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import { escapeRegex } from '../utils/sanitize.js';

export const createListing = async (req, res, next) => {
  try {
    const { regularPrice, discountPrice, offer } = req.body;

    if (offer && Number(discountPrice) >= Number(regularPrice)) {
      return next(errorHandler(400, 'Discount price must be less than regular price!'));
    }

    const listing = await Listing.create({
      ...req.body,
      userRef: req.user.id,
    });
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id.toString() !== listing.userRef.toString()) {
      return next(errorHandler(403, 'You can only delete your own listings!'));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Listing has been deleted!' });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id.toString() !== listing.userRef.toString()) {
      return next(errorHandler(403, 'You can only update your own listings!'));
    }

    const regularPrice = req.body.regularPrice !== undefined ? req.body.regularPrice : listing.regularPrice;
    const discountPrice = req.body.discountPrice !== undefined ? req.body.discountPrice : listing.discountPrice;
    const offer = req.body.offer !== undefined ? req.body.offer : listing.offer;

    if (offer && Number(discountPrice) >= Number(regularPrice)) {
      return next(errorHandler(400, 'Discount price must be less than regular price!'));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const rawLimit = parseInt(req.query.limit, 10);
    const limit = Math.min(Math.max(rawLimit || 9, 1), 50); // Bound between 1 and 50
    const rawStartIndex = parseInt(req.query.startIndex, 10);
    const startIndex = Math.max(rawStartIndex || 0, 0);

    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const rawSearch = req.query.searchTerm || '';
    const sanitizedSearch = escapeRegex(rawSearch.trim());

    // Whitelist allowed sort keys to prevent injection
    const allowedSortKeys = ['createdAt', 'regularPrice', 'updatedAt'];
    const sort = allowedSortKeys.includes(req.query.sort) ? req.query.sort : 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const query = {
      offer,
      furnished,
      parking,
      type,
    };

    if (sanitizedSearch) {
      query.name = { $regex: sanitizedSearch, $options: 'i' };
    }

    const listings = await Listing.find(query)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex)
      .lean();

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
