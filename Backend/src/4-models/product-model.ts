
import mongoose, { Document, ObjectId, Schema, model } from "mongoose";
import { CategoryModel } from "./category-model";

//1. Interface describing the model (must extend mongoose.Document)
export interface IProductModel extends Document {
   product: Express.Multer.File;
   // Don't define _id, it is automatically defined.
   name: string;
   price: number;
   image: File;
   imageName: string;
   imageUrl: string;
   categoryId: ObjectId;
}

//2. Schema build from the interface containing rules regarding the model:
export const ProductSchema = new Schema<IProductModel>({
   name: {
      type: String, // JavaScript string type.
      required: [true, "Missing product name"],
      minlength: [2, "product name must be minimum 2 chars"],
      maxlength: [100, "product name can't exceed 100 chars"],
      unique: true,
      trim: true,
   },
   price: {
      type: Number,
      required: [true, "Missing price"],
      min: [0, "Price must be positive"],
      max: [10000, "Price can be higher than 10000"]
   },
   image: {
      type: Object,
      validate: {
         validator: function (this: IProductModel) {
            // Only validate if it's a POST request or image is present
            return !this.isNew || this.image != null;
         },
         message: "Missing image"
      },
   },
   imageUrl: {
      type: String,
      // required: [true, "Missing image Url"],
   },
   imageName: {
      type: String,
      // required: [true, "Missing image name"],
   },
   categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Missing Category Id"],
   },
}, {
   versionKey: false, // Don't create __v field in each document.
   toJSON: { virtuals: true }, // Support virtual fields when returning JSON.
   id: false // Don't duplicate _id into additional id field.
});

//Virtual field - not exists in the database, only in the model.
ProductSchema.virtual("category", {
   ref: CategoryModel,
   localField: "categoryId",
   foreignField: "_id",
   justOne: true,
});

//3. Model from the above interface and schema:
export const ProductModel = model<IProductModel>("ProductModel", ProductSchema, "products"); // model name, schema type, db collection name

// For specifying types in function declaration we use the interface (IProductModel).
// For performing operations with the model we use model class (ProductModel).