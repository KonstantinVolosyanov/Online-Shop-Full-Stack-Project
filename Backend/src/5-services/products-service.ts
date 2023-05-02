import appConfig from "../2-utils/app-config";
import { CartModel, ICartModel } from "../4-models/cart-model";
import { CategoryModel, ICategoryModel } from "../4-models/category-model";
import { ResourceNotFoundError } from "../4-models/client-errors";
import { IProductModel, ProductModel } from "../4-models/product-model";

//Get all products
// async function getAllProducts(): Promise<IProductModel[]> {
//     // Find all products, exec returning promise + category virtual:
//     return ProductModel.find().populate("category").exec();
// }
//Get all products
async function getAllProducts(): Promise<IProductModel[]> {
    const products = ProductModel.find().populate("category").exec();
    const productsWithImageUrl = (await products).map((p) => {
        p.imageUrl = appConfig.productImagesAddress + p.imageName
        return p;
    });
    return productsWithImageUrl;
}


//Get all categories
async function getAllCategories(): Promise<ICategoryModel[]> {
    // Find all categories, exec returning promise:
    return CategoryModel.find().exec();
}

//Get one product
async function getOneCart(_id: string): Promise<ICartModel> {
    // Find specific cart:
    const cart = CartModel.findById(_id).exec();
    // If cart doesn't exist: 
    if (!cart) throw new ResourceNotFoundError(_id);
    // return cart:
    return cart;
}


// IMAGE-------------------------------------------------------------------------------------

// Get image name from database:
async function getImageNameFromDB(_id: string): Promise<string> {
    // Get object array:
    const product = ProductModel.findById(_id).exec();
    // If no such product: 
    if (!product) return null;
    // Return image name:
    const imageName = (await product).imageName;
    return imageName;
}

export default {
    getAllProducts,
    getImageNameFromDB,
    getAllCategories,
    getOneCart,
};
