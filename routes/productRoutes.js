import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  productPhotoController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
import { getProductsContoller } from "../controllers/productController.js";
import { getSingleProductContoller } from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

router.post(
  "/update-product",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

router.get("/get-product", getProductsContoller);
router.get("/get-product/:slug", getSingleProductContoller);
router.get("/product-photo/:pid", productPhotoController);
router.put(
  "/update-product",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);
router.delete("/product", deleteProductController);

export default router;
