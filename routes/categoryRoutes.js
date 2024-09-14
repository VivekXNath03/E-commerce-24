import express from 'express';
import { createCategory, getCategories, singleCategory, updateCategory , deleteCategory } from '../controllers/categoryController.js';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-category' , requireSignIn, isAdmin , createCategory);

router.put('/update-category/:id' , requireSignIn, isAdmin , updateCategory);

router.get('/get-category', getCategories);


router.get('/single-category/:slug' , singleCategory);

router.delete('/delete-category/:id' , requireSignIn, isAdmin , deleteCategory);

export default router;