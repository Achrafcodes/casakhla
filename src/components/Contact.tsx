import { Mail, Phone, MapPin, Send, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createContactMessage } from '../lib/messagesService';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto close success modal after 3 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        setErrorMessage('Please fill in all required fields.');
        setShowErrorModal(true);
        return;
      }

      // Send message to database
      await createContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      setShowSuccessModal(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      setErrorMessage(error?.message || 'Failed to send message. Please try again.');
      setShowErrorModal(true);
    }
  };

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-5xl lg:text-6xl tracking-tighter mb-6">
            Get In Touch
          </h2>
          <div className="w-16 h-0.5 bg-black mx-auto mb-8"></div>
          <p className="text-gray-600 tracking-wide">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl tracking-tighter mb-8">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="tracking-tight mb-1">Email</h4>
                    <p className="text-gray-600 text-sm">info@casaka7la.com</p>
                    <p className="text-gray-600 text-sm">support@casaka7la.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="tracking-tight mb-1">Phone</h4>
                    <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                    <p className="text-gray-600 text-sm">Mon-Fri 9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="tracking-tight mb-1">Headquarters</h4>
                    <p className="text-gray-600 text-sm">123 Fashion Avenue</p>
                    <p className="text-gray-600 text-sm">New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Hours */}
            <div className="border-t border-black/10 pt-8">
              <h4 className="tracking-tight mb-4">Store Hours</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span>10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span>10:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span>11:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="border-t border-black/10 pt-8">
              <h4 className="tracking-tight mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-black flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <span className="text-white text-xs">IG</span>
                </a>
                <a href="#" className="w-10 h-10 bg-black flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <span className="text-white text-xs">TW</span>
                </a>
                <a href="#" className="w-10 h-10 bg-black flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <span className="text-white text-xs">FB</span>
                </a>
                <a href="#" className="w-10 h-10 bg-black flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <span className="text-white text-xs">TK</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm uppercase tracking-wider mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm uppercase tracking-wider mb-2">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm uppercase tracking-wider mb-2">
                  Subject *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 group"
              >
                Send Message
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 h-full z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-auto max-w-sm animate-scaleIn">
            <div className="p-6 sm:p-8 text-center space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>

              <h2 className="text-base sm:text-lg md:text-xl font-semibold">Message Sent Successfully!</h2>

              <p className="text-xs sm:text-sm text-gray-600">
                Thank you for contacting us. We will get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 h-full z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-auto max-w-sm">
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-black/10">
              <h2 className="text-base sm:text-lg font-semibold">Error</h2>
              <button
                onClick={() => setShowErrorModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8 text-center space-y-4">
              <p className="text-xs sm:text-sm text-gray-600">
                {errorMessage}
              </p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
