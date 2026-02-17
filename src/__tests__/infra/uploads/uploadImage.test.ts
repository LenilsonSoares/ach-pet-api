import { describe, it, expect } from 'vitest';

import { vi } from 'vitest';
import { uploadImage } from '../../../infra/uploads/uploadImage.js';
import cloudinary from '../../../infra/uploads/cloudinary.js';

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
    (cloudinary.uploader.upload as ReturnType<typeof vi.fn>).mockImplementationOnce(() => { throw new Error('Falha'); });
    const result = await uploadImage('fake/path/to/image.jpg');
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
  });
});
