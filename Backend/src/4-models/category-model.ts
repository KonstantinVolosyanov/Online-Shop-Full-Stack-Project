import  { Document, Schema, model } from "mongoose";

//1. Interface describing the model (must extend mongoose.Document)
export interface ICategoryModel extends Document {
   // Don't define _id, it is automatically defined.
   name: string;
}

//2. Schema build from the interface containing rules regarding the model:
export const CategorySchema = new Schema<ICategoryModel>({
   name: {
      type: String, // JavaScript string type.
      required: [true, "Missing category name"],
      minlength: [2, "Category name must be minimum 2 chars"],
      maxlength: [100, "Category name can't exceed 100 chars"],
      trim: true,
      unique: true
   },
}, {
   versionKey: false
});

//3. Model from the above interface and schema:
export const CategoryModel = model<ICategoryModel>("CategoryModel", CategorySchema, "categories");