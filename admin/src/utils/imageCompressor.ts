/**
 * Client-Side Automatic Image Compressor
 * Resizes and converts uploaded image files to lightweight WebP/JPEG Base64 strings in the browser.
 * Reduces raw 5-10 MB camera/phone photos down to optimized ~30-80 KB assets before saving to DB.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg';
}

/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * @param file The raw File from an <input type="file">
 * @param options Compression configuration (defaults: max 1200px, 80% quality, WebP)
 * @returns Promise<string> Base64 data URL
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<{ dataUrl: string; originalSize: number; compressedSize: number; format: string }> {
  const {
    maxWidth = 1200,
    maxHeight = 900,
    quality = 0.82,
    format = 'image/webp',
  } = options;

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) {
        reject(new Error('Empty image file.'));
        return;
      }

      // If already an SVG, do not compress
      if (file.type === 'image/svg+xml') {
        resolve({
          dataUrl: src,
          originalSize,
          compressedSize: originalSize,
          format: 'svg',
        });
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image data.'));
      
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate aspect-ratio preserving bounding box
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if canvas context is unavailable
          resolve({
            dataUrl: src,
            originalSize,
            compressedSize: originalSize,
            format: file.type,
          });
          return;
        }

        // Enable high-quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP compression first
        let dataUrl = canvas.toDataURL(format, quality);
        let activeFormat = 'webp';

        // Fallback to JPEG if browser does not support WebP canvas export
        if (!dataUrl.startsWith('data:image/webp') && format === 'image/webp') {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          activeFormat = 'jpeg';
        }

        // Approximate byte size from Base64 string
        const base64Content = dataUrl.split(',')[1] || '';
        const compressedSize = Math.round((base64Content.length * 3) / 4);

        resolve({
          dataUrl,
          originalSize,
          compressedSize,
          format: activeFormat,
        });
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to readable string (e.g. 1.2 MB or 45 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
