import { RegisterOptions } from "react-hook-form";

class CredentialsModel {
   public _id: string;
   public email: string;
   public password: string;

   // Email Validation:
   public static emailValidation: RegisterOptions = {
      required: { value: true, message: "Missing email" },
      minLength: { value: 8, message: "Email must be minimum 8 chars" },
      maxLength: { value: 30, message: "Email can't exceed 30 chars" },
      // Valid email pattern
      pattern: {
         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{1,}$/i,
         message: "Format must be xxx@xxx.xxx"
      }
   };

   // Password Validation:
   public static passwordValidation: RegisterOptions = {
      required: { value: true, message: "Missing password" },
      minLength: { value: 4, message: "Password must be minimum 4 chars" },
      maxLength: { value: 30, message: "Password can't exceed 30 chars" }
   };
}

export default CredentialsModel;

