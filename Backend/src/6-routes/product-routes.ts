import express, { NextFunction, Request, Response } from "express";
import imageHandler from "../2-utils/image-handler";
import productsService from "../5-services/products-service";
import verifyLoggedIn from "../3-middleware/verify-logged-in";

const router = express.Router(); // Capital R

// GET all products // http://localhost:4000/api/products
router.get("/products", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get all products by products service:
        const products = await productsService.getAllProducts();
        // Respond JSON:
        response.json(products);
    }
    catch (err: any) {
        next(err);
    }
});

// Get all categories // GET // http://localhost:4000/api/categories
router.get("/categories", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get all categories by product services:
        const categories = await productsService.getAllCategories();
        // Respond JSON:
        response.json(categories);
    }
    catch (err: any) {
        next(err);
    }
});


// Get Image // GET // http://localhost:4000/api/vacations/images/:imageName
router.get("/products/images/:imageName", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get image name by params:
        const imageName = request.params.imageName;
        // Get absolute path (path + image name);
        const absolutePath = imageHandler.getAbsolutePath(imageName);
        // Respond file by absolute path:
        response.sendFile(absolutePath)
    }
    catch (err: any) {
        next(err);
    }
});

export default router;
