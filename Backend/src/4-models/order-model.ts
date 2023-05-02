import mongoose, { Document, ObjectId, Schema, model } from "mongoose";
import { CartModel } from "./cart-model";
import { UserModel } from "./user-model";
import { CartProductModel } from "./cartProduct-model";

//1. Interface describing the model (must extend mongoose.Document)
export interface IOrderModel extends Document {
   // Don't define _id, it is automatically defined.
   finalPrice: number;
   city: string;
   street: string;
   orderDateTime: string;
   deliveryDateTime: string;
   creditCard: number;
   userId: string;
   cartId: ObjectId;
}

//2. Schema build from the interface containing rules regarding the model:
export const OrderSchema = new Schema<IOrderModel>({
   finalPrice: {
      type: Number,
      required: [true, "Missing price"],
      min: [0.1, "Price must be positive"],
   },
   city: {
      type: String,
      required: [true, "Missing city"],
   },
   street: {
      type: String,
      required: [true, "Missing address"]
   },
   orderDateTime: {
      type: String,
      required: [true, "Missing order date and time"],
   },
   deliveryDateTime: {
      type: String,
      required: [true, "Missing delivery date and time"],
   },
   creditCard: {
      type: Number,
      required: [true, "Missing credit card 4 last digits"],
      length: [4, "Must be 4 digits"],
   },
   userId: {
      type: String,
      required: [true, "Missing user id"],
   },
   cartId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Missing cart id"],
   },
}, {
   versionKey: false, // Don't create __v field in each document.
   toJSON: { virtuals: true }, // Support virtual fields when returning JSON.
   id: false // Don't duplicate _id int additional id field.
});

//Virtual field - not exists in the database, only in the model.
OrderSchema.virtual("user", {
   ref: UserModel,
   localField: "userId",
   foreignField: "idNumber",
   justOne: true,
});

OrderSchema.virtual("cart", {
   ref: CartModel,
   localField: "cartId",
   foreignField: "_id",
   justOne: true,
});

OrderSchema.virtual("products", {
   ref: CartProductModel,
   localField: "cartId",
   foreignField: "cartId",
});

//3. Model from the above interface and schema:
export const OrderModel = model<IOrderModel>("OrderModel", OrderSchema, "orders");