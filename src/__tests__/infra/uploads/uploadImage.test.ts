
import { vi } from 'vitest';
import { uploadImage } from '../../../infra/uploads/uploadImage.js';

vi.mock('../../../infra/uploads/cloudinary.js', () => ({
  default: {
    uploader: {
      upload: vi.fn(async (filePath) => ({
        secure_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        original_filename: filePath,
      }))
    }
  }
}));

describe('uploadImage', () => {
  it('deve retornar sucesso e url ao fazer upload', async () => {
    const result = await uploadImage('fake/path/to/image.jpg');
    expect(result.success).toBe(true);
    expect(result.data.secure_url).toContain('cloudinary.com');
    expect(result.data.original_filename).toBe('fake/path/to/image.jpg');
  });

  it('deve retornar erro ao falhar upload', async () => {
    const cloudinary = require('../../../infra/uploads/cloudinary.js').default;
    cloudinary.uploader.upload.mockImplementationOnce(() => { throw new Error('Falha'); });
    const result = await uploadImage('fake/path/to/image.jpg');
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
  });
});
