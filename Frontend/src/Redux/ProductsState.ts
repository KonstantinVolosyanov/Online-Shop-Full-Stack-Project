import { createStore } from "redux";
import ProductModel from "../Models/ProductModel";
import { composeWithDevTools } from "redux-devtools-extension";
import CartModel from "../Models/CartModel";
import CartProductModel from "../Models/CartProductModel";
import CategoryModel from "../Models/CategoryModel";
import OrderModel from "../Models/OrderModel";


//1. App State - application level state
export class ProductsState {
   public products: ProductModel[] = [];
   public carts: CartModel[] = [];
   public cartProducts: CartProductModel[] = [];
   public categories: CategoryModel[] = [];
   public orders: OrderModel[] = [];
}

//2. Action Type - list of actions needed on the data:
export enum ProductsActionType {
   FetchProducts = "FetchProducts",
   AddProduct = "AddProduct",
   UpdateProduct = "UpdateProduct",
   DeleteProduct = "DeleteProduct",

   FetchCarts = "FetchCarts",
   AddCart = "AddCart",
   DeleteCart = "DeleteCart",

   FetchCartProducts = "FetchCartProducts",
   AddCartProduct = "AddCartProduct",
   DeleteCartProduct = "DeleteCartProduct",

   FetchCategories = "FetchCategories",

   FetchOrders = "FetchOrders",
   AddOrder = "AddOrder"

}

//3. Action - a single object describing single operation on the data:
export interface ProductsAction {
   type: ProductsActionType;
   payload: any;
}

//4. Reducer - function performing the needed actions (the action object is the one sent via dispatch function):
export function productsReducer(currentState = new ProductsState(), action: ProductsAction): ProductsState {

   const newState: ProductsState = { ...currentState };

   switch (action.type) {
      //Products
      case ProductsActionType.FetchProducts:
         newState.products = action.payload;
         break;

      case ProductsActionType.AddProduct:
         const productToAdd = action.payload
         newState.products.push(productToAdd);
         break;

      case ProductsActionType.UpdateProduct:
         const updatedProduct = action.payload;
         newState.products = newState.products.map(p => p._id === updatedProduct._id ? updatedProduct : p)
         console.log(updatedProduct);
         break;

      case ProductsActionType.DeleteProduct:
         const productIdToDelete = action.payload;
         newState.products = newState.products.filter(p => p._id !== productIdToDelete);
         break;

      //Carts
      case ProductsActionType.FetchCarts:
         newState.carts = action.payload;
         break;

      case ProductsActionType.AddCart:
         newState.carts.push(action.payload);
         break;

      case ProductsActionType.DeleteCart:
         const cartIndexToDelete = newState.carts.findIndex(c => c._id === action.payload);
         if (cartIndexToDelete >= 0) {
            newState.carts.splice(cartIndexToDelete, 1);
         }
         break;

      //Cart Products
      case ProductsActionType.FetchCartProducts:
         newState.cartProducts = action.payload;
         break;

      case ProductsActionType.AddCartProduct:
         newState.cartProducts.push(action.payload);
         break;

      case ProductsActionType.DeleteCartProduct:
         const cartProductIndexToDelete = newState.cartProducts.findIndex(c => c._id === action.payload);
         if (cartProductIndexToDelete >= 0) {
            newState.cartProducts.splice(cartProductIndexToDelete, 1);
         }
         break;

      case ProductsActionType.FetchCategories:
         newState.categories = action.payload;
         break;

      //Orders
      case ProductsActionType.FetchOrders:
         newState.orders = action.payload
         break;

      case ProductsActionType.AddOrder:
         newState.orders.push(action.payload);
         break;
   }

   return newState;
}

//5. Store - redux manager;
export const productsStore = createStore(productsReducer, composeWithDevTools())