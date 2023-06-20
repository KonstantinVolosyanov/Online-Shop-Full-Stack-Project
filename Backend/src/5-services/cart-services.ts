import { CartModel, ICartModel } from "../4-models/cart-model";
import { CartProductModel, ICartProductModel } from "../4-models/cartProduct-model";
import { ResourceNotFoundError, ValidationError } from "../4-models/client-errors";
import { IOrderModel, OrderModel } from "../4-models/order-model";
import { IProductModel } from "../4-models/product-model";
import { IUserModel } from "../4-models/user-model";

//Get all carts
async function getAllCarts(): Promise<ICartModel[]> {
    // Find all carts, exec returning promise:
    return CartModel.find().populate("user").exec()
};

//Get cart by userId
async function getCartByUser(userId: string): Promise<ICartModel> {
    // Find specific cart:
    const cart = await CartModel.findOne({ userId }).exec();
    // return cart:
    return cart;
};

//Add new cart
async function createCart(cart: ICartModel, currentUser: IUserModel): Promise<ICartModel> {
    // Add current user id to the cart:
    cart.userId = currentUser.idNumber;
    // Today's date: 
    const date = new Date().toString();
    // Add date to cart:
    cart.dateTime = date;
    //Validate
    const errors = cart.validateSync();
    if (errors) throw new ValidationError(errors.message);
    // Return cart + user virtual
    return (await cart.save()).populate("user");
};

//Delete cart:
async function deleteCart(_id: string): Promise<void> {
    // Find by id and delete:
    const deleteCart = await CartModel.findByIdAndDelete(_id).exec();
    const cartId = _id;
    const deleteCartProducts = await CartProductModel.find({ cartId }).exec();
    // Delete each product:
    for (const cartProduct of deleteCartProducts) {
        await CartProductModel.findByIdAndDelete(cartProduct._id)
    }

    // If product not found:
    if (!deleteCart) throw new ResourceNotFoundError(_id);
};

// PRODUCTS IN CART ------------------------------------------------------------------------------------------

//Get all products in cart
async function getAllProductsInCart(cartId: string): Promise<ICartProductModel[]> {
    // Find all products in specific cart, exec returning promise:
    return CartProductModel.find({ cartId }).exec();
};

//Add new product to cart:
async function addProductToCart(product: IProductModel, cart: ICartModel): Promise<ICartProductModel> {
    // Search if product already in cart:
    const existingCartProduct = await CartProductModel.findOne({ productId: product._id, cartId: cart._id }).exec();
    // If already in a cart:
    if (existingCartProduct) {
        // Update amount of product:
        existingCartProduct.amountInCart++;
        // Calculate amount Price:
        existingCartProduct.amountPrice = +(existingCartProduct.amountInCart * product.price).toPrecision(4);
        // Update cart total price:
        cart.totalPrice = +(cart.totalPrice + product.price).toPrecision(4);
        // Add updated cart:
        await cart.save();
        //Add and return updated product :
        return existingCartProduct.save();
    } else {
        // Create new product in cart:
        const cartProduct = new CartProductModel();
        // cartProduct id:
        cartProduct.productId = product._id;
        // cartProduct name:
        cartProduct.name = product.name;
        // image Name
        cartProduct.imageName = product.imageName;
        // Amount = 1:
        cartProduct.amountInCart = 1;
        // Product in cart price = product price:
        cartProduct.price = product.price;
        // Add product price to the amount price:
        cartProduct.amountPrice = +(product.price).toPrecision(4);
        //Product in cart's cartId = cart id:
        cartProduct.cartId = cart._id;
        // Add product price to total cart price:
        cart.totalPrice = +(cart.totalPrice + product.price).toPrecision(4);
        // Add updated cart:
        await cart.save();
        // Add and return product in cart:
        return cartProduct.save();
    }
};

//Delete product from cart:
async function deleteFromCart(cartId: string): Promise<void> {
    // Find by id and delete:
    const deleteProduct = await CartProductModel.findByIdAndDelete(cartId).exec();
    // Find cart by id:
    const cart = await CartModel.findById(deleteProduct.cartId).exec();
    // Calculate cart total price:
    cart.totalPrice = +(cart.totalPrice - deleteProduct.amountPrice).toPrecision(4);
    // Add updated cart:
    await cart.save();
    // If product not found:
    if (!deleteProduct) throw new ResourceNotFoundError(cartId);
};

// Subtract 1 from amount in cart:
async function subtractProductFromCart(cartProductId: string, cart: ICartModel): Promise<ICartProductModel> {
    // Search if product already in cart:
    const existingCartProduct = await CartProductModel.findOne({ _id: cartProductId, cartId: cart._id });
    // If already in a cart:
    if (existingCartProduct) {
        // Subtract 1 from amount:
        existingCartProduct.amountInCart--;
        // If amount is 0:
        if (existingCartProduct.amountInCart <= 0) {
            // Remove cart product from the database if the amount reaches 0 or lower
            await existingCartProduct.deleteOne();
            // Subtract product price from total cart price: 
            cart.totalPrice = +(cart.totalPrice - existingCartProduct.price).toPrecision(4);
            // Add updated cart:
            await cart.save();
            return null;
        } else {
            // If amount bigger than 0, calculate amount price:
            existingCartProduct.amountPrice = +(existingCartProduct.amountInCart * existingCartProduct.price).toPrecision(4);
            // Calculate total cart price: 
            cart.totalPrice = +(cart.totalPrice - existingCartProduct.price).toPrecision(4);
            // Add updated cart:
            await cart.save();
            // Add and return updated cart product:
            return existingCartProduct.save();
        }
        // IF not in a cart:
    } else {
        // If the product is not in the cart, do nothing
        return null;
    }
};

// ORDERS ------------------------------------------------------------------------------------------

//Get all orders
async function getAllOrders(): Promise<IOrderModel[]> {
    // Find all carts, exec returning promise:
    return OrderModel.find().exec()
};

//Create order:
async function createOrder(order: IOrderModel, userId: string, userCart: ICartModel): Promise<IOrderModel> {
    // Order's date: 
    const orderDate = new Date().toString();
    // Add date to order:
    order.orderDateTime = orderDate;
    // Add final price to order:
    order.finalPrice = userCart.totalPrice;
    // Add cart id to order:
    order.cartId = userCart._id;
    // Add user id to order:
    order.userId = userId;
    //Validate
    const errors = order.validateSync();
    if (errors) throw new ValidationError(errors.message);
    // Return cart + user virtual
    const addedOrder = (await (await (await order.save()).populate("cart")).populate("user")).populate("products");
    // Delete products from ordered cart:
    // Delete ordered cart:
    await deleteCart(userCart._id);
    return (addedOrder);
};

export default {
    createCart,
    addProductToCart,
    deleteFromCart,
    subtractProductFromCart,
    getAllCarts,
    getAllProductsInCart,
    createOrder,
    deleteCart,
    getAllOrders,
    getCartByUser
};
