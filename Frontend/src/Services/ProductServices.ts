import axios from "axios";
import CartModel from "../Models/CartModel";
import CategoryModel from "../Models/CategoryModel";
import ProductModel from "../Models/ProductModel";
import appConfig from "../Utils/AppConfig";
import { ProductsActionType, productsStore } from "../Redux/ProductsState";

class ProductServices {
   //Get all products
   public async getAllProducts(): Promise<ProductModel[]> {
      //Take products from global state:
      let products = productsStore.getState().products;
      if (products.length === 0) {
         const response = await axios.get<ProductModel[]>(appConfig.productsUrl);
         products = response.data;
         //Update redux global state:
         productsStore.dispatch({ type: ProductsActionType.FetchProducts, payload: products });
      }
      return products;
   }

   //Get all categories
   public async getAllCategories(): Promise<CategoryModel[]> {
      // Fetch categories from backend:
      let categories = productsStore.getState().categories
      if (categories.length === 0) {
         const response = await axios.get<CategoryModel[]>(appConfig.categoriesUrl);
         categories = response.data;
         productsStore.dispatch({ type: ProductsActionType.FetchCategories, payload: categories })
         console.log(categories)
      }
      return categories;
   }

   //Get one cart
   public async getOneCart(_id: string): Promise<CartModel> {
      // Fetch vacations from backend:
      const response = await axios.get<CartModel>(appConfig.cartUrl + _id);
      const cart = response.data;
      // Return vacations:
      return cart;

   }
   //Get category by id
   public async getCategoryById(_id: string): Promise<CategoryModel> {
      // Fetch vacations from backend:
      const response = await axios.get<CategoryModel>(appConfig.categoriesUrl + _id);
      const category = response.data;
      // Return vacations:
      return category;
   }

}

const productServices = new ProductServices();

export default productServices;
