import { RegisterOptions } from "react-hook-form";

class CategoryModel {
   public _id: string;
   public name: string;

   public static nameValidation: RegisterOptions = {
      required: { value: true, message: "Missing name" },
      minLength: { value: 2, message: "Name must be minimum 2 chars" },
      maxLength: { value: 50, message: "Name can't exceeds 50 chars" }
   };
}

export default CategoryModel;



