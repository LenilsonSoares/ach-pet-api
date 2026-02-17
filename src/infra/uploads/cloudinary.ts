import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_URL) {
  throw new Error('Variável de ambiente CLOUDINARY_URL não definida.');
}
cloudinary.config({
  url: process.env.CLOUDINARY_URL,
});

export default cloudinary;
