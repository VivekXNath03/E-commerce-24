import productModel from "../models/productModel.js";
import fs from "fs";
export const createProductController = async (req, res) => {
  try {
    const { name, description, slug, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(400).send({
          success: false,
          message: "Name is required",
        });

      case !description:
        return res.status(400).send({
          success: false,
          message: "Description is required",
        });
      case !price:
        return res.status(400).send({
          success: false,
          message: "Price is required",
        });
      case !category:
        return res.status(400).send({
          success: false,
          message: "Category is required",
        });
      case !quantity:
        return res.status(400).send({
          success: false,
          message: "Quantity is required",
        });
      case !photo && photo.size > 1000000:
        return res.status(400).send({
          success: false,
          message: "Photo is required and should be less than 1mb",
        });
    }

    const products = new productModel({ ...req.feilds, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while creating product",
    });
  }
};

export const getProductsContoller = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All Products",
      products,
      countTotal: products.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching products",
    });
  }
};

export const getSingleProductContoller = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching single product",
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.paramas.pid)
      .select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting product photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id).select("-photo");

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, slug, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(400).send({
          success: false,
          message: "Name is required",
        });

      case !description:
        return res.status(400).send({
          success: false,
          message: "Description is required",
        });
      case !price:
        return res.status(400).send({
          success: false,
          message: "Price is required",
        });
      case !category:
        return res.status(400).send({
          success: false,
          message: "Category is required",
        });
      case !quantity:
        return res.status(400).send({
          success: false,
          message: "Quantity is required",
        });
      case !photo && photo.size > 1000000:
        return res.status(400).send({
          success: false,
          message: "Photo is required and should be less than 1mb",
        });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating  product",
    });
  }
};
