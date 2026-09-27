import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return next(errorHandler(400, 'User with this email already exists!'));
      }
      return next(errorHandler(400, 'Username is already taken!'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Invalid credentials!'));

    const token = jwt.sign({ id: validUser._id }, config.jwtSecret, {
      expiresIn: '7d',
    });

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, config.cookie)
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;
    if (!email) {
      return next(errorHandler(400, 'Google authentication payload missing email.'));
    }

    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: '7d',
      });
      const { password: pass, ...rest } = user._doc;
      return res
        .cookie('access_token', token, config.cookie)
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const baseName = (name || 'user').split(' ').join('').toLowerCase();
      const randomSuffix = Math.random().toString(36).slice(-4);

      user = new User({
        username: `${baseName}${randomSuffix}`,
        email,
        password: hashedPassword,
        avatar: photo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      });

      await user.save();
      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: '7d',
      });
      const { password: pass, ...rest } = user._doc;
      return res
        .cookie('access_token', token, config.cookie)
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token', {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
    });
    res.status(200).json({
      success: true,
      message: 'User has been logged out!',
    });
  } catch (error) {
    next(error);
  }
};
