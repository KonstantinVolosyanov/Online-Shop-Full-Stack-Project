import multer, { FileFilterCallback } from "multer"
import fs from "fs";
import fsPromises from "fs/promises";
import path from 'path';
import { v4 as uuid } from "uuid";

// Images folder
const productImagesFolder = "./src/1-assets/images/products/";

// Create Multer instance
const upload = multer({
    dest: productImagesFolder,
    fileFilter: (
        req: Express.Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {
        // Check file type
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed!"));
        }
        cb(null, true);
    },
});

// Save new image: 
async function saveImage(image: Express.Multer.File): Promise<string> {
    // Create unique image name: 
    const uniqueImageName = createImageName(image.originalname);
    // Create absolute path: 
    const absolutePath = productImagesFolder + uniqueImageName;
    // Save to disk: 
    await fsPromises.rename(image.path, absolutePath);
    // Return new name: 
    return uniqueImageName;
}

// Update existing image:
async function updateImage(image: Express.Multer.File, existingImageName: string): Promise<string> {
    // Delete existing image: 
    await deleteImage(existingImageName);
    // Save new image to disk:
    const uniqueImageName = await saveImage(image);
    // Return unique name: 
    return uniqueImageName;
}

// Delete existing image:
async function deleteImage(existingImageName: string): Promise<void> {
    try {
        // If no image sent:
        if (!existingImageName) return;
        // Delete image from disk:
        await fsPromises.unlink(productImagesFolder + existingImageName);
    }
    catch (err: any) {
        console.error(err.message);
    }
}

function createImageName(originalImageName: string): string {
    // Take original extension: 
    const extension = originalImageName.substring(originalImageName.lastIndexOf("."));
    // Create unique name including original extension (v4 = 36 chars uuid):
    const uniqueImageName = uuid() + extension;
    // Return unique name:
    return uniqueImageName;
}

function getAbsolutePath(imageName: string): string {
    // If image exist:
    let absolutePath = path.join(__dirname, "..", "1-assets", "images", "products", imageName);
    // If image doesn't exist
    if (!fs.existsSync(absolutePath)) {
        absolutePath = path.join(__dirname, "..", "1-assets", "images", "not-found.jpg");
    }
    return absolutePath;
}

export default {
    upload,
    saveImage,
    updateImage,
    deleteImage,
    getAbsolutePath
};

