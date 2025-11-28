import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

const folder = env.CLOUDINARY_FOLDER || 'curly-fiesta/recipes';

export function configureCloudinary() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables are not fully configured');
  }
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadRecipeImage(buffer: Buffer, filename?: string) {
  configureCloudinary();
  return new Promise<{ url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', public_id: filename?.replace(/\.[^/.]+$/, '') },
      (error: unknown, result: any) => {
        if (error || !result) return reject(error || new Error('Cloudinary upload failed'));
        resolve({ url: result.secure_url });
      }
    );
    uploadStream.end(buffer);
  });
}
