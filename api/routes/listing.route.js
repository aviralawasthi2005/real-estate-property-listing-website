import express from 'express';
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { validateListing } from '../middlewares/validation.middleware.js';
import { seedListings } from '../controllers/seed.controller.js';

const router = express.Router();

router.post('/create', verifyToken, validateListing, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, validateListing, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.get('/seed', seedListings);

export default router;
