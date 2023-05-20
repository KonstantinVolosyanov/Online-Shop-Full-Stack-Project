import express, { NextFunction, Request, Response } from "express";
import verifyAdmin from "../3-middleware/verify-admin";
import { ProductModel } from "../4-models/product-model";
import adminServices from "../5-services/admin-services";
import verifyLoggedIn from "../3-middleware/verify-logged-in";

// Make variable from express.Router
const router = express.Router(); // Capital R

// GET one product // http://localhost:4000/api/products/:_id
router.get("/admin/products/:_id", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
   try {
      // Get id from params:
      const _id = request.params._id;
      // Get one product by admin services:
      const product = await adminServices.getOneProduct(_id);
      // Response JSON:
      response.json(product);
   }
   catch (err: any) {
      next(err);
   }
});


// ADD Product // http://localhost:4000/api/products
router.post("/admin/products", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
   try {
      // Save image name :
      request.body.image = request.file.filename;
      // Create new Product by model:
      const product = new ProductModel(request.body)
      // Add new Product by admin services:
      const addedProduct = await adminServices.addProduct(product, request.file);
      // Respond status and JSON:
      response.status(201).json(addedProduct);
   }
   catch (err: any) {
      next(err);
   }
});

// EDIT Product // http://localhost:4000/api/products/:_id
router.put("/admin/products/:_id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
   try {
      // Get product id by params:
      request.body._id = request.params._id;
      // If new image, save name:
      if (request.file) { request.body.image = request.file.filename };
      // Create new Product by model:
      const product = new ProductModel(request.body);
      // Update existing product by admin services:
      const updatedProduct = await adminServices.updateProduct(product, request.file);
      // Respond status and JSON:
      response.status(201).json(updatedProduct);
   }
   catch (err: any) {
      next(err);
   }
});

// DELETE Product // http://localhost:4000/api/products/:_id
router.delete("/admin/products/:_id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
   try {
      // Get product id by params:
      const _id = request.params._id;
      // Delete product by admin services:
      await adminServices.deleteProduct(_id);
      // Respond status:
      response.sendStatus(204);
   }
   catch (err: any) {
      next(err);
   }
});

// Get category by Id // GET // http://localhost:4000/api/categories/_id
router.get("/categories/:_id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
   try {
      const _id = request.params._id;
      // Get all categories by product services:
      const categories = await adminServices.getCategoryById(_id);
      // Respond JSON:
      response.json(categories);
   }
   catch (err: any) {
      next(err);
   }
});

export default router;