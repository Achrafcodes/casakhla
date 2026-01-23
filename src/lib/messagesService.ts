import {
    collection,
    doc,
    getDocs,
    addDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    createdAt: any;
    isRead?: boolean;
}

const MESSAGES_COLLECTION = 'contact_messages';

// Get all contact messages (admin only)
export const getAllMessages = async (): Promise<ContactMessage[]> => {
    try {
        const messagesRef = collection(db, MESSAGES_COLLECTION);
        const q = query(messagesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const messages: ContactMessage[] = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            messages.push({
                id: docSnap.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
                isRead: data.isRead,
                createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
            } as ContactMessage);
        });

        return messages;
    } catch (error) {
        console.error('Error getting messages:', error);
        throw new Error('Failed to fetch messages');
    }
};

// Create new contact message
export const createContactMessage = async (
    messageData: Omit<ContactMessage, 'id' | 'createdAt'>
): Promise<ContactMessage> => {
    try {
        const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
            name: messageData.name,
            email: messageData.email,
            phone: messageData.phone || '',
            subject: messageData.subject,
            message: messageData.message,
            createdAt: Timestamp.now(),
            isRead: false
        });

        return {
            id: docRef.id,
            ...messageData,
            createdAt: Timestamp.now().toDate(),
            isRead: messageData.isRead || false,
        };
    } catch (error: any) {
        console.error('Error creating contact message:', error);
        throw new Error(`Failed to send message: ${error.message}`);
    }
};

// Delete contact message
export const deleteContactMessage = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, MESSAGES_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting message:', error);
        throw new Error('Failed to delete message');
    }
};
