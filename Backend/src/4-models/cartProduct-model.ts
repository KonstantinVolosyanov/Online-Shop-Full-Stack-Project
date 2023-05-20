import mongoose, { Document, ObjectId, Schema, model } from "mongoose";
import { CartModel } from "./cart-model";
import { ProductModel } from "./product-model";

//1. Interface describing the model (must extend mongoose.Document)
export interface ICartProductModel extends Document {
   // Don't define _id, it is automatically defined.
   name: string;
   productId: ObjectId;
   amountInCart: number;
   amountPrice: number;
   price: number;
   cartId: ObjectId;
   imageName: string;
}

//2. Schema build from the interface containing rules regarding the model:
export const CartProductSchema = new Schema<ICartProductModel>({
   name: {
      type: String,
      required: [true, "Missing name"],
   },
   amountInCart: {
      type: Number,
      required: [true, "Missing amount"],
      min: [1, "Amount cant be smaller than 1"],
      max: [50, "Amount cant be higher than 50"],
   },
   amountPrice: {
      type: Number,
      required: [true, "Missing amount price"],
      min: [0, "Price cant be negative"],
   },
   price: {
      type: Number,
   },
   productId: {
      type: mongoose.Schema.Types.ObjectId,
   },
   cartId: {
      type: mongoose.Schema.Types.ObjectId,
   },
   imageName: {
      type: String,
      // required: [true, "Missing image Url"],
   }
}, {
   versionKey: false, // Don't create __v field in each document.
   toJSON: { virtuals: true }, // Support virtual fields when returning JSON.
   id: false // Don't duplicate _id int additional id field.
});

//Virtual field - not exists in the database, only in the model.
CartProductSchema.virtual("product", {
   ref: ProductModel,
   localField: "productId",
   foreignField: "_id",
   justOne: true,
});

CartProductSchema.virtual("cart", {
   ref: CartModel,
   localField: "cartId",
   foreignField: "_id",
   justOne: true,
});

//3. Model from the above interface and schema:
export const CartProductModel = model<ICartProductModel>("CartProductModel", CartProductSchema, "cartProducts");