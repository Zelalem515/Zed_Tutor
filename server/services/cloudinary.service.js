const { v2: cloudinary } = require('cloudinary');

// Configure from environment — credentials never leave the server
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

/**
 * Upload a file buffer to Cloudinary.
 * Returns { secure_url, public_id } on success.
 */
function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: options.folder || 'zed_tutor',
        transformation: options.transformation || [],
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Delete an asset from Cloudinary by public_id.
 * Fails silently — a deletion failure must not block a DB update.
 */
async function deleteAsset(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('[Cloudinary] Failed to delete asset:', publicId, err.message);
  }
}

/**
 * Check whether Cloudinary credentials are configured.
 */
function isConfigured() {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

module.exports = { uploadBuffer, deleteAsset, isConfigured };
