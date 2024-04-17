const cloudinary = require('cloudinary').v2; // Assuming Cloudinary SDK v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (fileBuffer, filename, folder) => {
    try {
        // Upload file to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    folder: folder,
                    public_id: filename
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(new Error('Failed to upload file to Cloudinary'));
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(fileBuffer);
        });

        if (!uploadResult.secure_url) {
            throw new Error('Secure URL not found in Cloudinary upload result');
        }

        return uploadResult.secure_url; // Return the secure URL
    } catch (error) {
        console.error(error);
        throw error;
    }
};


module.exports = {
    uploadToCloudinary
};