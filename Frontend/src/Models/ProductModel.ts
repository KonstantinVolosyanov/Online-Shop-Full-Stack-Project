import { RegisterOptions } from "react-hook-form";
import CategoryModel from "./CategoryModel";

class ProductModel {
   public _id: string;
   public name: string;
   public price: number;
   public categoryId: string;
   public image?: File;
   public imageName: string;
   public imageUrl: string;
   public category: CategoryModel;

   public static nameValidation: RegisterOptions = {
      required: { value: true, message: "Missing name" },
      minLength: { value: 2, message: "Name must be minimum 2 chars" },
      maxLength: { value: 50, message: "Name can't exceeds 50 chars" }
   };

   public static priceValidation: RegisterOptions = {
      required: { value: true, message: "Missing price" },
      min: { value: 0, message: "Price can't be negative" },
      max: { value: 1000, message: "Price can't exceeds 1000" }
   };

   public static categoryIdValidation: RegisterOptions = {
      required: { value: true, message: "Missing category id" }
   };

   public static categoryValidation: RegisterOptions = {
      required: { value: true, message: "Missing category" }
   };
   public static imagePostValidation: RegisterOptions = {
      required: { value: true, message: "Missing image" }
   };

   public static imagePutValidation: RegisterOptions = {

   };

}
export default ProductModel;