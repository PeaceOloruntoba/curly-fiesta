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
  const timeoutMs = 25000;
  return new Promise<{ url: string }>((resolve, reject) => {
    const to = setTimeout(() => reject(new Error('Image upload timed out')), timeoutMs);
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', public_id: filename?.replace(/\.[^/.]+$/, '') },
      (error: unknown, result: any) => {
        clearTimeout(to);
        if (error || !result) return reject(error || new Error('Cloudinary upload failed'));
        resolve({ url: result.secure_url });
      }
    );
    uploadStream.on('error', (err: unknown) => {
      clearTimeout(to);
      reject(err || new Error('Cloudinary upload stream error'));
    });
    uploadStream.end(buffer);
  });
}
