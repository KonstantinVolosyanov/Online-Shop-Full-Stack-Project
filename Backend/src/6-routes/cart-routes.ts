import express, { NextFunction, Request, Response } from "express";
import cyber from "../2-utils/cyber";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import { CartModel } from "../4-models/cart-model";
import { ResourceNotFoundError } from "../4-models/client-errors";
import { OrderModel } from "../4-models/order-model";
import { ProductModel } from "../4-models/product-model";
import cartServices from "../5-services/cart-services";

const router = express.Router(); // Capital R

// GET all carts // GET // http://localhost:4000/api/carts
router.get("/carts", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get all carts by cart-services:
        const carts = await cartServices.getAllCarts();
        // Response JSON: 
        response.json(carts);
    }
    catch (err: any) {
        next(err);
    }
});

// // GET one cart // GET //http://localhost:4000/api/cart/:_id
// router.get("/cart/:_id", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
//     try {
//         // Get cart id from request:
//         const _id = request.params._id;
//         // Get one cart by cart-services:
//         const cart = await cartServices.getOneCart(_id);
//         // Response JSON:
//         response.json(cart);
//     }
//     catch (err: any) {
//         next(err);
//     }
// });

// GET cart by user // GET //http://localhost:4000/api/cart/:_id
router.get("/cart-by-user", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get cart id from request:
        const userId = (cyber.getUserFromToken(request)).idNumber;
        // Get one cart by cart-services:
        console.log("send userId into services");
        const cart = await cartServices.getCartByUser(userId);
        // Response JSON:
        response.json(cart);
    }
    catch (err: any) {
        next(err);
    }
});


// Create Cart // POST // http://localhost:4000/api/shop
router.post("/cart", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get user from token:
        const currentUser = cyber.getUserFromToken(request);
        // Get user-id from current user:
        const userId = currentUser.idNumber;
        // Check if user already have cart:
        const existingCart = await CartModel.findOne({ userId }).exec();
        // if there is an existing cart, throw an error
        if (existingCart) { throw new Error("You can only have one cart at a time.") };
        // If user have no cart: create cart from request body: 
        const cart = new CartModel(request.body);
        // Create cart by cart-services:
        const addedCart = await cartServices.createCart(cart, currentUser);
        // Response status & JSON:
        response.status(201).json(addedCart);
    }
    catch (err: any) {
        next(err);
    }
});

// Delete cart // DELETE // http://localhost:4000/api/cart/product/:_id
router.delete("/cart/:_id", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get cart id from params:
        const _id = request.params._id;
        // Delete cart by cart-services:
        await cartServices.deleteCart(_id);
        // Respond status:
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

// PRODUCT IN CART ----------------------------------------------------------------------------

// Get all PRODUCTS in cart // GET // http://localhost:4000/api/categories
router.get("/cart-products/:_id", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get cart id from request:
        const cartId = request.params._id;
        // Get all products in cart by cart-services:
        const allProductsInCart = await cartServices.getAllProductsInCart(cartId);
        // Response JSON:
        response.json(allProductsInCart);
    }
    catch (err: any) {
        next(err);
    }
});

// Add product to cart // POST // http://localhost:4000/api/cart/product/:_id
router.post("/cart/product/:_id", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get product id from params: 
        const cartProductId = request.params._id;
        // Find product by id:
        const product = await ProductModel.findById(cartProductId).exec();
        // Get userId from token:
        const userId = (cyber.getUserFromToken(request)).idNumber
        // Get cart by userId:
        const cart = await CartModel.findOne({ userId }).exec();
        // Add product to cart by cart-services:
        const addedCartProduct = await cartServices.addProductToCart(product, cart);
        // Respond status and JSON
        response.status(201).json(addedCartProduct);
    }
    catch (err: any) {
        next(err);
    }
});

// Subtract one from amount in cart // PUT // http://localhost:4000/api/cart/product/:_id
router.put("/cart/product/subtract/:_id", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get product in cart id from params:
        const cartProductId = request.params._id;
        // Get userId from token:
        const userId = (cyber.getUserFromToken(request)).idNumber;
        // Find cart by user id
        const cart = await CartModel.findOne({ userId }).exec();
        // Update needed product in cart:
        const updatedCartProduct = await cartServices.subtractProductFromCart(cartProductId, cart);
        // If product is updated, respond status and JSON:
        if (updatedCartProduct) {
            response.status(200).json(updatedCartProduct);
        } else {
            response.sendStatus(204); // No Content
        }
    }
    catch (err: any) {
        next(err);
    }
});

// Delete product from cart // DELETE http://localhost:4000/api/cart/product/:_id
router.delete("/cart/product/:_id", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {

        // request.body.image = request.file.filename;
        // Get product id from params:
        const _id = request.params._id;
        // Delete product from cart by cart-services:
        await cartServices.deleteFromCart(_id);
        // Respond status:
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

// ORDERS -----------------------------------------------------------------------------

// Create Order // POST http://localhost:4000/api/shop
router.post("/order", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get user id from token:
        const userId = cyber.getUserFromToken(request).idNumber;
        // Find cart by user id:
        const userCart = await CartModel.findOne({ userId }).exec();
        // If no userCart:
        if (!userCart) { throw new ResourceNotFoundError("Cart") };
        // Check if shipping date already exists:
        const existingOrderDate = await OrderModel.find({ deliveryDateTime: request.body.deliveryDateTime }).exec();
        // If 3 or more shippings on this day, trow error:
        if (existingOrderDate.length >= 3) { throw new Error("Our schedule is full for this date, please choose another"); };
        // Create order from request body:
        const order = new OrderModel(request.body);
        // Create order by cart services:
        await cartServices.createOrder(order, userId, userCart);
        // Response status and JSON:
        response.status(201).json(order);
    }
    catch (err: any) {
        next(err);
    }
});

// GET all orders // http://localhost:4000/api/orders
router.get("/orders", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get all carts by cart-services:
        const orders = await cartServices.getAllOrders();
        // Response JSON: 
        response.json(orders);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;
