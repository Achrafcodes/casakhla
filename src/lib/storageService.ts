import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

// Upload image to Firebase Storage
export const uploadImage = async (file: File, path: string): Promise<string> => {
    try {
        // Create a unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `${path}/${fileName}`);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
};

// Upload multiple images
export const uploadImages = async (files: File[], path: string): Promise<string[]> => {
    try {
        const uploadPromises = files.map(file => uploadImage(file, path));
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error('Error uploading images:', error);
        throw new Error('Failed to upload images');
    }
};

// Delete image from Firebase Storage
export const deleteImage = async (imageUrl: string): Promise<void> => {
    try {
        // Extract the path from the URL
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
    } catch (error) {
        console.error('Error deleting image:', error);
        // Don't throw error if image doesn't exist
        if ((error as any).code !== 'storage/object-not-found') {
            throw new Error('Failed to delete image');
        }
    }
};

// Delete multiple images
export const deleteImages = async (imageUrls: string[]): Promise<void> => {
    try {
        const deletePromises = imageUrls.map(url => deleteImage(url));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error('Error deleting images:', error);
        throw new Error('Failed to delete images');
    }
};