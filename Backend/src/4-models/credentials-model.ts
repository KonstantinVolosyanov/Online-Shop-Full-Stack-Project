import { Document, Schema, model } from "mongoose";

//1. Interface describing the model (must extend mongoose.Document)
export interface ICredentialsModel extends Document {
   // Don't define _id, it is automatically defined.
   email: string;
   password: string;
}

//2. Schema build from the interface containing rules regarding the model:
export const CredentialsSchema = new Schema<ICredentialsModel>({
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
      }},
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
   }
});

//3. Model from the above interface and schema:
export const CredentialsModel = model<ICredentialsModel>("CredentialsModel", CredentialsSchema, "credentials");