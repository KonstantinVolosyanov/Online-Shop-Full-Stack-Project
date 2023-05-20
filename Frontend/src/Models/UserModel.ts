import { RegisterOptions, Validate } from "react-hook-form";

enum City {
   telAviv = "Tel-Aviv",
   hifa = "Hifa",
   jerusalem = "Jerusalem",
   rishonLezion = "Rishon-Lezion",
   petahTikva = "Petah-Tikva",
   netanya = "Netanya",
   ashdod = "Ashdod",
   bneiBrak = "Bnei-Brak",
   holon = "Holon",
   beersheva = "Beer-sheva",
   ramatGan = "Ramat-Gan",
   rehovot = "Rehovot"
}

class UserModel {
   public _id: string;
   public firstName: string;
   public lastName: string;
   public email: string;
   public idNumber: string;
   public password: string;
   public city: City;
   public street: string;
   public role: string;

   // First Name Validation:
   public static firstNameValidation: RegisterOptions = {
      required: { value: true, message: "Missing first name" },
      minLength: { value: 2, message: "First name must be minimum 2 chars" },
      maxLength: { value: 30, message: "First name can't exceed 30 chars" }
   };

   // Last Name Validation
   public static lastNameValidation: RegisterOptions = {
      required: { value: true, message: "Missing last name" },
      minLength: { value: 2, message: "Last name must be minimum 2 chars" },
      maxLength: { value: 30, message: "Last name can't exceed 30 chars" }
   };

   // Email Validation:
   public static emailValidation: RegisterOptions = {
      required: { value: true, message: "Missing email" },
      minLength: { value: 8, message: "Email must be minimum 8 chars" },
      maxLength: { value: 30, message: "Email can't exceed 30 chars" },
      // Valid email pattern:
      pattern: {
         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
         message: "Format must be email@email.com"
      }
   };

   // idNumber Validation
   public static idNumberValidation: RegisterOptions = {
      required: { value: true, message: "Missing id number" },
      minLength: { value: 9, message: "Id number must be minimum 9 chars" },
      maxLength: { value: 20, message: "Id number can't exceed 30 chars" }
   };

   // Password Validation
   public static passwordValidation: RegisterOptions = {
      required: { value: true, message: "Missing password" },
      minLength: { value: 4, message: "Password must be minimum 4 chars" },
      maxLength: { value: 30, message: "Password can't exceed 30 chars" }
   };

   // City Validation
   public static cityValidation: RegisterOptions = {
      required: { value: true, message: "Missing city" },
      minLength: { value: 4, message: "City must be minimum 4 chars" },
      maxLength: { value: 30, message: "City can't exceed 30 chars" }
   };

   // Street Validation
   public static streetValidation: RegisterOptions = {
      required: { value: true, message: "Missing street and address" },
      minLength: { value: 4, message: "Street must be minimum 4 chars" },
      maxLength: { value: 30, message: "Street can't exceed 30 chars" }
   };
}

export { UserModel, City };
