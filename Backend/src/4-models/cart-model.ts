import  { Document, Schema, model } from "mongoose";
import { UserModel } from "./user-model";

//1. Interface describing the model (must extend mongoose.Document)
export interface ICartModel extends Document {
   // Don't define _id, it is automatically defined.
   dateTime: string;
   userId: string;
   totalPrice: number;
}

//2. Schema build from the interface containing rules regarding the model:
export const CartSchema = new Schema<ICartModel>({
   dateTime: {
      type: String,
      required: [true, "Missing Date and Time"],
   },
   userId: {
      type: String,
      required: [true, "Missing User Id"],
      unique: true,
   },
   totalPrice: {
      type: Number,
      default: 0,
      min: [0, "Price can not be negative"],
   }
}, {
   versionKey: false, // Don't create __v field in each document.
   toJSON: { virtuals: true }, // Support virtual fields when returning JSON.
   id: false // Don't duplicate _id int additional id field.
});

CartSchema.virtual("user", {
   ref: UserModel,
   localField: "userId",
   foreignField: "idNumber",
   justOne: true,
});

//3. Model from the above interface and schema:
export const CartModel = model<ICartModel>("CartModel", CartSchema, "carts");