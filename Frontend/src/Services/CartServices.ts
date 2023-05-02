import axios from "axios";
import appConfig from "../Utils/AppConfig";
import ProductModel from "../Models/ProductModel";
import CartModel from "../Models/CartModel";
import { UserModel } from "../Models/UserModel";
import CartProductModel from "../Models/CartProductModel";
import OrderModel from "../Models/OrderModel";

class CartServices {

   //Get all carts:
   public async getAllCarts(): Promise<CartModel[]> {
      //Fetch carts from backend:
      const response = await axios.get<CartModel[]>(appConfig.cartUrl);
      const carts = response.data;
      return carts;
   };

   //Get one cart
   public async getOneCart(_id: string): Promise<CartModel> {
      const response = await axios.get<CartModel>(appConfig.cartUrl + _id);
      const cart = response.data;
      return cart;
   };

   //Get cart by userId
   public async getCartByUser(): Promise<CartModel> {
      // Find specific cart:
      console.log("front send");
      const response = await axios.get<CartModel>(appConfig.cartByUserUrl);
      console.log("front receive");
      const cart = response.data;
      // return cart:
      return cart;
   };

   //Add new cart
   public async createCart(): Promise<CartModel> {
      const response = await axios.post<CartModel>(appConfig.cartUrl);
      const cart = response.data;
      return cart;
   };

   //Delete cart:
   public async deleteCart(_id: string): Promise<void> {
      await axios.delete(appConfig.cartUrl + _id);
   };

   // PRODUCTS IN CART ------------------------------------------------------------------------------------------

   //Get all products in cart
   public async getAllProductsInCart(cartId: string): Promise<CartProductModel[]> {
      return null
   };

   //Add new product to cart:
   public async addProductToCart(product: ProductModel, cart: CartModel): Promise<CartProductModel> {
      return null
   };

   //Delete product from cart:
   public async deleteFromCart(cartId: string): Promise<void> {
      return null
   };

   // Subtract 1 from amount in cart:
   public async subtractProductFromCart(cartProductId: string, cart: CartModel): Promise<CartProductModel> {
      return null
   };

   // ORDERS ------------------------------------------------------------------------------------------

   //Get all orders
   public async getAllOrders(): Promise<OrderModel[]> {
      return null
   };

   //Create order:
   public async createOrder(order: OrderModel, userId: string, userCart: CartModel): Promise<OrderModel> {
      return null
   };
};

const cartServices = new CartServices();
export default cartServices;

