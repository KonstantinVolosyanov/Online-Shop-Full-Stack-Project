import { Document, Schema, model } from "mongoose";

//1. Interface describing the model (must extend mongoose.Document)
export interface IUserModel extends Document {
   // Don't define _id, it is automatically defined.
   firstName: string;
   lastName: string;
   email: string;
   idNumber: string;
   password: string;
   city: string;
   street: string;
   role: string;
};

//2. Schema build from the interface containing rules regarding the model:
export const UserSchema = new Schema<IUserModel>({
   firstName: {
      type: String, // JavaScript string type.
      required: [true, "Missing first name"],
      minlength: [2, "First name must be minimum 2 chars"],
      maxlength: [100, "First name can't exceed 100 chars"],
      trim: true,
   },
   lastName: {
      type: String,
      required: [true, "Missing last name"],
      minlength: [2, "Last name must be minimum 2 chars"],
      maxlength: [100, "Last name can't exceed 100 chars"],
      trim: true,
   },
   email: {
      type: String,
      required: [true, "Missing email"],
      minlength: [6, "Name must be minimum 6 chars"],
      maxlength: [30, "Name can't exceed 30 chars"],
      trim: true,
      validate: {
         validator: function (value: string) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
         },
         message: "Invalid email format: must be XX@XX.XX"
      }
   },
   idNumber: {
      type: String,
      required: [true, "Missing id number"],
      minlength: [2, "Id Number must be minimum 2 chars"],
      maxlength: [100, "Id Number can't exceed 100 chars"],
      trim: true,
      unique: true,
   },
   password: {
      type: String,
      required: [true, "Missing password"],
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: [1000, "Password can't exceed 1000 characters"],
      // validate:
      //   {
      //     validator: (value: string) => 
      //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value),
      //     message:
      //       "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      //   },
   },
   city: {
      type: String,
      required: [true, "Missing city"],
      enum: ["Tel-Aviv", "Haifa", "Jerusalem", "Rishon-LeZiyyon", "Petah-Tikva", "Netanya", "Ashdod", "Bnei-Brak", "Holon", "Beersheva", "Ramat-Gan", "Rehovot"],
      trim: true,

   },
   street: {
      type: String,
      required: [true, "Missing street"],
      minlength: [2, "Name must be minimum 6 chars"],
      maxlength: [30, "Name can't exceed 30 chars"],
      trim: true,
   },
   role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"] // List of allowed values.
   }
}, {
   versionKey: false, // Don't create __v field in each document.
   id: false // Don't duplicate _id int additional id field.
});

//3. Model from the above interface and schema:
export const UserModel = model<IUserModel>("UserModel", UserSchema, "users");