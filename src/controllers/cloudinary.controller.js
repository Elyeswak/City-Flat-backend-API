import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

/* Accessing .env content */
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });


  export const uploadImage = async (file) => {
    try {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(file);
      return result.secure_url;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  export const deleteImage = async (publicId) => {
    try {
      // Delete the image from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  export const updateImage = async (file, publicId) => {
    try {
      // Delete the existing image from Cloudinary
      await deleteImage(publicId);
      
      // Upload the new image to Cloudinary
      const imageUrl = await uploadImage(file);
      return imageUrl;
    } catch (error) {
      throw new Error('Failed to update image on Cloudinary');
    }
  };

  export const uploadMultipleImages = async (files) => {
    const uploadedImages = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await cloudinary.uploader.upload(file);
        uploadedImages.push(result.secure_url);
      } catch (error) {
        throw new Error(`Failed to upload image ${file.originalname}: ${error.message}`);
      }
    }
  
    return uploadedImages;
  };



  export const updateMultipleImages = async (files, publicIds) => {
    const updatedImages = [];
  
    // Delete existing images
    for (let i = 0; i < publicIds.length; i++) {
      const publicId = publicIds[i];
      try {
        await deleteImage(publicId);
      } catch (error) {
        throw new Error(`Failed to delete image with public ID ${publicId}: ${error.message}`);
      }
    }
  
    // Upload new images
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await cloudinary.uploader.upload(file);
        updatedImages.push(result.secure_url);
      } catch (error) {
        throw new Error(`Failed to upload image ${file.originalname}: ${error.message}`);
      }
    }
  
    return updatedImages;
  };