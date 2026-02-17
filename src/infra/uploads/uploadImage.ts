import cloudinary from './cloudinary.js';

export async function uploadImage(filePath: string): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error };
  }
}
