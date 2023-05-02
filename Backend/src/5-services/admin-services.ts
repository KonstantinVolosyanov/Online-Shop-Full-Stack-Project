import imageHandler from "../2-utils/image-handler";
import { ResourceNotFoundError, ValidationError } from "../4-models/client-errors";
import { IProductModel, ProductModel } from "../4-models/product-model";

//Get one product
async function getOneProduct(_id: string): Promise<IProductModel> {
   // Find product by _id:
   const product = ProductModel.findById(_id).exec();
   // If no product throw error:
   if (!product) throw new ResourceNotFoundError(_id);
   // Return product
   return product;
}

//Add new product
async function addProduct(product: IProductModel, image: Express.Multer.File): Promise<IProductModel> {
   // Validate
   const errors = product.validateSync();
   // If validation failed, throw validation error:
   if (errors) throw new ValidationError(errors.message);
   // Save image name to database:
   product.imageName = await imageHandler.saveImage(image);
   // Save and return product:
   return product.save();
}

//Update existing product:
async function updateProduct(product: IProductModel, image?: Express.Multer.File): Promise<IProductModel> {
   //Validate:
   const errors = product.validateSync();
   //If validation failed, throw validation error:
   if (errors) throw new ValidationError(errors.message);
   //Find image name by _id:
   const existingImageName = (await ProductModel.findById(product._id).exec()).imageName;
   //If new image = update image name:
   if (image) {
      //Save new image
      product.imageName = await imageHandler.saveImage(image);
      //Delete old image
      await imageHandler.deleteImage(existingImageName);
   };
   //Update product: returnOriginal: false - will return database object and not an argument object.
   const updatedProduct = await ProductModel.findByIdAndUpdate(product._id, product, { returnOriginal: false }).exec();
   //If not found, throw recourse error:
   if (!updatedProduct) throw new ResourceNotFoundError(product._id);
   //Return Updated product:
   return updatedProduct;
}

//Delete product
async function deleteProduct(_id: string): Promise<void> {
   // Find image name by _id:
   const existingImageName = (await ProductModel.findById(_id).exec()).imageName;
   // Delete image file from assets:
   await imageHandler.deleteImage(existingImageName);
   // Delete Products:
   const deleteProduct = await ProductModel.findByIdAndDelete(_id).exec();
   // If no product throw recourse error:
   if (!deleteProduct) throw new ResourceNotFoundError(_id);
}

export default {
   getOneProduct,
   addProduct,
   updateProduct,
   deleteProduct

}