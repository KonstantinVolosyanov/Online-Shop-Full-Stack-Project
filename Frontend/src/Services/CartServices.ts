import axios from "axios";
import appConfig from "../Utils/AppConfig";
import ProductModel from "../Models/ProductModel";
import CartModel from "../Models/CartModel";
import { UserModel } from "../Models/UserModel";
import CartProductModel from "../Models/CartProductModel";
import OrderModel from "../Models/OrderModel";
import { ProductsActionType, productsStore } from "../Redux/ProductsState";
import authServices from "./AuthServices";

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
      const response = await axios.get<CartModel>(appConfig.cartByUserUrl);
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
      //Fetch products in cart from backend:
      const response = await axios.get<CartProductModel[]>(appConfig.allProductsCartUrl + cartId);
      const cartProducts = response.data;
      return cartProducts;
   };

   //Add new product to cart:
   public async addProductToCart(_id: string, cart: CartModel): Promise<void> {
      // Send request to backend:
      const response = await axios.post<CartProductModel>(appConfig.productCartUrl + _id, cart);
      //Receive response to addedProduct
      const addedCartProduct = response.data;
      //Send added product into redux global state
      productsStore.dispatch({ type: ProductsActionType.AddCartProduct, payload: addedCartProduct });
   };

   //Delete product from cart:
   public async deleteFromCart(cartId: string): Promise<void> {
      return null
   };

   // Subtract 1 from amount in cart:
   public async subtractProductFromCart(_id: string, cart: CartModel): Promise<void> {
      // Send request to backend:
      console.log(_id, cart);
      const response = await axios.put<CartProductModel>(appConfig.subtractProductUrl + _id, cart);
      //Receive response to addedProduct
      const subtractedCartProduct = response.data;
      //Send added product into redux global state
      productsStore.dispatch({ type: ProductsActionType.AddCartProduct, payload: subtractedCartProduct });
   };

   // ORDERS ------------------------------------------------------------------------------------------

   //Get all orders
   public async getAllOrders(): Promise<OrderModel[]> {
      let orders = productsStore.getState().orders;
      if (orders.length === 0) {
         const response = await axios.get<OrderModel[]>(appConfig.ordersUrl);
         orders = response.data;
         //Update redux global state:
         productsStore.dispatch({ type: ProductsActionType.FetchOrders, payload: orders })
      }
      return orders;
   };

   // public async getOrderByUser(userId: string): Promise<OrderModel> {
   //    let orders = productsStore.getState().orders;
   //    let ordersByUser = orders.find(o => o.userId === userId)
   //    let lastOrder = ordersByUser.length - 1;
   //    if (orders.length === 0) {
   //       const response = await axios.get<OrderModel[]>(appConfig.ordersUrl);
   //       orders = response.data;
   //       ordersByUser = orders.find(o => o.userId === userId)
   //       lastOrder = ordersByUser.length - 1;
   //    }
   //    return lastOrder
   // }

   //Create order:
   public async addOrder(order: OrderModel, userId: string, userCart: CartModel): Promise<void> {
      const response = await axios.post<OrderModel>(appConfig.ordersUrl, order)
      const addedOrder = response.data;
      productsStore.dispatch({ type: ProductsActionType.AddOrder, payload: addedOrder })
   };
};

const cartServices = new CartServices();
export default cartServices;

