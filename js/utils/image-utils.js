/**
 * BARANS SPILLVERKSTED - Image Utilities
 * Handles image loading, resizing, and conversion
 */

const ImageUtils = {
  /**
   * Maximum image dimensions
   */
  MAX_WIDTH: 200,
  MAX_HEIGHT: 200,
  MAX_FILE_SIZE: 1024 * 1024, // 1MB

  /**
   * Load an image from a file input
   */
  async loadFromFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      // Check file size
      if (file.size > this.MAX_FILE_SIZE * 5) {
        reject(new Error('File is too large'));
        return;
      }

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const resized = await this.resizeImage(e.target.result);
          resolve(resized);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  },

  /**
   * Resize an image to fit within max dimensions
   */
  async resizeImage(dataUrl, maxWidth = this.MAX_WIDTH, maxHeight = this.MAX_HEIGHT) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        // Draw with smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to data URL (PNG for transparency support)
        const resizedDataUrl = canvas.toDataURL('image/png', 0.9);
        resolve(resizedDataUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = dataUrl;
    });
  },

  /**
   * Create a circular cropped version of an image
   */
  async cropCircle(dataUrl, size = 100) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');

        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Calculate scaling to fill circle
        const scale = Math.max(size / img.width, size / img.height);
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => {
        reject(new Error('Failed to crop image'));
      };

      img.src = dataUrl;
    });
  },

  /**
   * Extract dominant color from an image
   */
  async getDominantColor(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 10, 10);

        const imageData = ctx.getImageData(0, 0, 10, 10);
        const data = imageData.data;

        let r = 0, g = 0, b = 0;
        const pixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        r = Math.round(r / pixels);
        g = Math.round(g / pixels);
        b = Math.round(b / pixels);

        resolve(`rgb(${r}, ${g}, ${b})`);
      };

      img.onerror = () => {
        resolve('#FF6B9D'); // Default color on error
      };

      img.src = dataUrl;
    });
  },

  /**
   * Create a thumbnail from an image
   */
  async createThumbnail(dataUrl, size = 50) {
    return this.resizeImage(dataUrl, size, size);
  },

  /**
   * Convert canvas to blob
   */
  canvasToBlob(canvas, type = 'image/png', quality = 0.9) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type, quality);
    });
  },

  /**
   * Load image from URL with CORS handling
   */
  async loadFromUrl(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => {
        reject(new Error('Failed to load image from URL'));
      };

      img.src = url;
    });
  },

  /**
   * Generate a placeholder image with emoji
   */
  createEmojiImage(emoji, size = 100, bgColor = '#FFFFFF') {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Emoji
    ctx.font = `${size * 0.7}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2);

    return canvas.toDataURL('image/png');
  },

  /**
   * Apply a simple filter to an image
   */
  async applyFilter(dataUrl, filter) {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');

        // Apply CSS filter
        ctx.filter = filter;
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => {
        resolve(dataUrl); // Return original on error
      };

      img.src = dataUrl;
    });
  },

  /**
   * Split an image into puzzle pieces
   */
  async createPuzzlePieces(dataUrl, rows, cols) {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const pieceWidth = Math.floor(img.width / cols);
        const pieceHeight = Math.floor(img.height / rows);
        const pieces = [];

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const canvas = document.createElement('canvas');
            canvas.width = pieceWidth;
            canvas.height = pieceHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(
              img,
              col * pieceWidth,
              row * pieceHeight,
              pieceWidth,
              pieceHeight,
              0,
              0,
              pieceWidth,
              pieceHeight
            );

            pieces.push({
              id: `piece_${row}_${col}`,
              row,
              col,
              dataUrl: canvas.toDataURL('image/png'),
              width: pieceWidth,
              height: pieceHeight
            });
          }
        }

        resolve(pieces);
      };

      img.onerror = () => {
        resolve([]);
      };

      img.src = dataUrl;
    });
  },

  /**
   * Validate image dimensions
   */
  async validateImage(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          valid: true,
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        });
      };

      img.onerror = () => {
        resolve({
          valid: false,
          error: 'Invalid image'
        });
      };

      img.src = dataUrl;
    });
  },

  /**
   * Create sprite sheet from multiple images
   */
  async createSpriteSheet(images, frameWidth, frameHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = frameWidth * images.length;
    canvas.height = frameHeight;

    const ctx = canvas.getContext('2d');

    const loadPromises = images.map((dataUrl, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, index * frameWidth, 0, frameWidth, frameHeight);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = dataUrl;
      });
    });

    await Promise.all(loadPromises);

    return canvas.toDataURL('image/png');
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageUtils;
}
