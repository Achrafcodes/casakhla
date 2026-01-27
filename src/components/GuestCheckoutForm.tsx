import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface GuestCheckoutFormProps {
    onSubmit: (data: GuestCheckoutData) => Promise<void>;
    onClose: () => void;
    isProcessing: boolean;
}

export interface GuestCheckoutData {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
}

export function GuestCheckoutForm({
    onSubmit,
    onClose,
    isProcessing,
}: GuestCheckoutFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
    });

    const validateForm = (): boolean => {
        const newErrors = {
            name: '',
            email: '',
            phoneNumber: '',
            address: '',
        };

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10,}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    return (
        <div className="fixed inset-0 h-full z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md lg:max-w-sm">
                <div className="p-4 sm:p-6 lg:p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg sm:text-xl lg:text-lg font-semibold">Complete Your Order</h2>
                        <button
                            onClick={onClose}
                            className="hover:opacity-60 transition-opacity"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label htmlFor="phoneNumber" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                                Phone Number
                            </label>
                            <input
                                id="phoneNumber"
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.phoneNumber}
                                </p>
                            )}
                        </div>

                        {/* Address Field */}
                        <div>
                            <label htmlFor="address" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                                Delivery Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street address, city, country, postal code"
                                rows={3}
                                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-black text-white py-3 sm:py-4 mt-4 sm:mt-6 hover:bg-gray-900 disabled:bg-gray-400 transition-colors rounded-lg font-medium uppercase tracking-wider text-sm sm:text-base"
                        >
                            {isProcessing ? 'Processing Order...' : 'Place Order'}
                        </button>

                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="w-full border border-black/20 text-black py-2.5 sm:py-3 hover:border-black disabled:opacity-50 transition-colors rounded-lg font-medium uppercase tracking-wider text-sm"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
