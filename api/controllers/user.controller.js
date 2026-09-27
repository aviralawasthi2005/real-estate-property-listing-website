import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
  res.json({
    status: 'healthy',
    message: 'User API route is operational',
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id.toString() !== req.params.id.toString()) {
    return next(errorHandler(403, 'You can only update your own account!'));
  }

  try {
    const updateData = {};
    if (req.body.username) updateData.username = req.body.username.trim();
    if (req.body.email) updateData.email = req.body.email.trim().toLowerCase();
    if (req.body.avatar) updateData.avatar = req.body.avatar;
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters long.'));
      }
      updateData.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found.'));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id.toString() !== req.params.id.toString()) {
    return next(errorHandler(403, 'You can only delete your own account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json({ success: true, message: 'User has been deleted!' });
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id.toString() !== req.params.id.toString()) {
    return next(errorHandler(403, 'You can only view your own listings!'));
  }
  try {
    const listings = await Listing.find({ userRef: req.params.id }).sort({ createdAt: -1 }).lean();
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, 'Invalid User ID format.'));
    }

    const user = await User.findById(req.params.id).select('-password').lean();

    if (!user) return next(errorHandler(404, 'User not found!'));

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const filter = req.user ? { _id: { $ne: req.user.id } } : {};
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).limit(50).lean();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
