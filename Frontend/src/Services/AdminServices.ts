import axios from "axios";
import ProductModel from "../Models/ProductModel";
import appConfig from "../Utils/AppConfig";

class AdminServices {
   //Get one product
   public async getOneProduct(_id: string): Promise<ProductModel> {
      // Fetch vacations from backend:
      const response = await axios.get<ProductModel>(appConfig.adminProductsUrl + _id);
      const product = response.data;
      return product;
   }

   //Add new product
   public async addProduct(product: ProductModel, image: File): Promise<void> {

      // Add headers for image:
      const headers = { "Content-Type": "multipart/form-data" };
      // Send request to backend:
      const response = await axios.post<ProductModel>(appConfig.adminProductsUrl, product, { headers });
      const addedProduct = response.data;
      // Full image url:
      const imageUrl = appConfig.imagesUrl + addedProduct.imageName;
      // Add full url to addedVacation:
      const vacationWithImageUrl = { ...addedProduct, imageUrl };
   }

   //Update existing product:
   public async updateProduct(product: ProductModel, image?: File): Promise<void> {

      // Add headers for image:
      const headers = { "Content-Type": "multipart/form-data" };
      // Send request to backend:
      const response = await axios.put<ProductModel>(appConfig.adminProductsUrl + product._id, product, { headers });
      // Receive response to updatedVacation
      const updatedProduct = response.data;
      // Full image url:
      const imageUrl = appConfig.imagesUrl + updatedProduct.imageName;
      // Add full url to updatedProduct:
      const productWithImageUrl = { ...updatedProduct, imageUrl };
   }

   //Delete product
   public async deleteProduct(_id: string): Promise<void> {
      // Send delete request + vacationId  
      await axios.delete(appConfig.adminProductsUrl + _id);
   }
}

const adminServices = new AdminServices();

export default adminServices;