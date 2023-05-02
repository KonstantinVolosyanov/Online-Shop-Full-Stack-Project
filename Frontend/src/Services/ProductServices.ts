import axios from "axios";
import CartModel from "../Models/CartModel";
import CategoryModel from "../Models/CategoryModel";
import ProductModel from "../Models/ProductModel";
import appConfig from "../Utils/AppConfig";

class ProductServices {

   //Get all products
   public async getAllProducts(): Promise<ProductModel[]> {
      const response = await axios.get<ProductModel[]>(appConfig.productsUrl);
      const products = response.data;
      return products;
   }

   //Get all categories
   public async getAllCategories(): Promise<CategoryModel[]> {
      // Fetch categories from backend:
      const response = await axios.get<CategoryModel[]>(appConfig.categoriesUrl);
      const categories = response.data;
      return categories;
   }

   //Get one product
   public async getOneCart(_id: string): Promise<CartModel> {
      // Fetch vacations from backend:
      const response = await axios.get<CartModel>(appConfig.cartUrl + _id);
      const cart = response.data;
      // Return vacations:
      return cart;

   }

}

const productServices = new ProductServices();

export default productServices;
