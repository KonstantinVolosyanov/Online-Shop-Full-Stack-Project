import axios from "axios";
import ProductModel from "../Models/ProductModel";
import { ProductsActionType, productsStore } from "../Redux/ProductsState";
import appConfig from "../Utils/AppConfig";
import productServices from "./ProductServices";

class AdminServices {

   //Get one product
   public async getOneProduct(_id: string): Promise<ProductModel> {
      //Take products from global state:
      let products = productsStore.getState().products;
      //Find needed product from global state:
      let product = products.find(p => p._id === _id);
      //If product not found:
      if (!product) {
         // Fetch vacations from backend:
         const response = await axios.get<ProductModel>(appConfig.adminProductsUrl + _id);
         product = response.data;
      }
      return product;
   }

   //Add new product
   public async addProduct(product: ProductModel): Promise<void> {
      // Add headers for image:
      const headers = { "Content-Type": "multipart/form-data" };
      // Fetch category by ID:
      const category = await productServices.getCategoryById(product.categoryId);
      // Attach category object to addedProduct
      product.category = category;
      // Send request to backend:
      const response = await axios.post<ProductModel>(appConfig.adminProductsUrl, product, { headers });
      //Receive response to addedProduct
      const addedProduct = response.data;
      // Full image url:
      const imageUrl = appConfig.imagesUrl + addedProduct.imageName;
      // Attach category object to addedProduct
      addedProduct.imageUrl = imageUrl;
      //Send added product into redux global state
      productsStore.dispatch({ type: ProductsActionType.AddProduct, payload: addedProduct });
   }

   //Update existing product:
   public async updateProduct(product: ProductModel): Promise<void> {
      // Add headers for image:
      const headers = { "Content-Type": "multipart/form-data" };
      // Send request to backend:
      const response = await axios.put<ProductModel>(appConfig.adminProductsUrl + product._id, product, { headers });
      // Receive response to updatedVacation
      const updatedProduct = response.data;
      // Fetch category by ID:
      const category = await productServices.getCategoryById(product.categoryId);
      // Full image url:
      const imageUrl = appConfig.imagesUrl + updatedProduct.imageName;
      // Attach updated imageUrl & category object to updatedProduct
      updatedProduct.category = category;
      updatedProduct.imageUrl = imageUrl;
      //Send updated product into redux global state:
      productsStore.dispatch({ type: ProductsActionType.UpdateProduct, payload: updatedProduct });
   }

   //Delete product
   public async deleteProduct(_id: string): Promise<void> {
      // Send delete request + vacationId  
      await axios.delete(appConfig.adminProductsUrl + _id);
      //Send delete id product into redux global state:
      productsStore.dispatch({ type: ProductsActionType.DeleteProduct, payload: _id });
   }
}

const adminServices = new AdminServices();

export default adminServices;