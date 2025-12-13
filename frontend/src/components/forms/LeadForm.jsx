import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { validateForm } from '../../utils/validation';
import { leadsAPI } from '../../services/api';
import api from '../../services/api';

const LeadForm = ({ events = [], selectedEvent = null, selectedPackage = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    event: selectedEvent?._id || '',
    package: selectedPackage?._id || '',
    numberOfTravellers: 1,
    preferredDate: selectedEvent?.startDate ? new Date(selectedEvent.startDate).toISOString().split('T')[0] : '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // If user changes email after verification, mark as unverified
    if (name === 'email') {
      setEmailVerified(false);
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  useEffect(() => {
    // If redirected from verification endpoint, mark email verified
    try {
      const params = new URLSearchParams(window.location.search);
      const verified = params.get('emailVerified');
      const emailParam = params.get('email');
      if (verified === 'true' && emailParam) {
        // populate email and mark verified
        setFormData((prev) => ({ ...prev, email: decodeURIComponent(emailParam) }));
        setEmailVerified(true);

        // clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        toast.success('Email verified successfully');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSendVerification = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email' }));
      return;
    }

    setVerifyLoading(true);
    try {
      const resp = await api.post('/verify-email/send', { email: formData.email });

      // resp is the backend response body: { success, message, data }
      if (resp && resp.success) {
        // If backend indicates already verified, mark verified
        const alreadyVerified = (resp.message && resp.message.toLowerCase().includes('already verified')) || (resp.data && String(resp.data).toLowerCase().includes('already verified'));
        if (alreadyVerified) {
          setErrors((prev) => ({ ...prev, email: '' }));
          setEmailVerified(true);
          toast.success('Email is already verified');
        } else {
          // Normal flow - verification email was sent
          toast.success(resp.message || 'Verification email sent. Please check your inbox.');
        }
      } else {
        const msg = resp?.message || 'Failed to send verification email';
        toast.error(msg);
      }
    } catch (error) {
      console.error('Error sending verification:', error);
      const msg = error?.message || 'Failed to send verification email. Try again later.';
      toast.error(msg);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Require email verification before submitting
    if (!emailVerified) {
      setErrors((prev) => ({ ...prev, email: 'Please verify your email before submitting' }));
      toast.error('Please verify your email before submitting');
      return;
    }

    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        numberOfTravellers: parseInt(formData.numberOfTravellers) || 1,
      };

      // Add optional fields
      if (formData.event) {
        submitData.event = formData.event;
      }
      if (formData.package) {
        submitData.package = formData.package;
      }
      if (formData.preferredDate) {
        submitData.preferredDate = formData.preferredDate;
      }

      // Submit to API
      const response = await leadsAPI.create(submitData);

      toast.success('Thank you! We will contact you shortly.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        event: '',
        package: '',
        numberOfTravellers: 1,
        preferredDate: '',
      });
      setEmailVerified(false);
      setErrors({});

      // Call success callback
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      // Extract error message from response
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Failed to submit form. Please try again.';
      
      // Show appropriate toast based on status code
      if (error.response?.status === 429) {
        // Rate limit or cooldown error
        toast.error(errorMessage, { duration: 5000 });
      } else if (error.response?.status === 400) {
        // Validation or duplicate error
        toast.error(errorMessage, { duration: 5000 });
      } else {
        // Generic error
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
          error={errors.name}
        />

        <div className="w-full">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className={`input-field w-full ${errors.email ? 'border-red-500 focus:ring-red-500' : emailVerified ? 'border-green-500 focus:ring-green-500' : ''}`}
            />

            <button
              type="button"
              onClick={handleSendVerification}
              disabled={verifyLoading || !formData.email || !/\S+@\S+\.\S+/.test(formData.email) || emailVerified}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border ${emailVerified ? 'bg-green-50 border-green-400 text-green-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              {verifyLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending...
                </>
              ) : (
                emailVerified ? 'Verified' : 'Verify'
              )}
            </button>
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          {emailVerified && <p className="mt-1 text-sm text-green-600">Email verified</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          required
          error={errors.phone}
        />

        <div className="w-full">
          <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-2">
            Interested Event
          </label>
          {selectedEvent ? (
            <div className="px-4 py-3 bg-primary-50 border-2 border-primary-500 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-dark-navy">{selectedEvent.name}</p>
                  <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                </div>
                <div className="text-xs text-primary-600 font-medium bg-white px-3 py-1 rounded-full">
                  Pre-selected
                </div>
              </div>
            </div>
          ) : (
            <select
              id="event"
              name="event"
              value={formData.event}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select an event (Optional)</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Display selected package if provided */}
      {selectedPackage && (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Package
          </label>
          <div className="px-4 py-3 bg-green-50 border-2 border-green-500 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-dark-navy">{selectedPackage.name}</p>
                <p className="text-sm text-gray-600">Base Price: ₹{selectedPackage.basePrice?.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-xs text-green-600 font-medium bg-white px-3 py-1 rounded-full">
                Pre-selected
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Number of Travellers"
          name="numberOfTravellers"
          type="number"
          min="1"
          max="20"
          value={formData.numberOfTravellers}
          onChange={handleChange}
        />

        <Input
          label="Preferred Date"
          name="preferredDate"
          type="date"
          value={formData.preferredDate}
          onChange={handleChange}
          min={selectedEvent?.startDate ? new Date(selectedEvent.startDate).toISOString().split('T')[0] : undefined}
          max={selectedEvent?.endDate ? new Date(selectedEvent.endDate).toISOString().split('T')[0] : undefined}
        />
      </div>

      <Textarea
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Tell us about your travel preferences, budget, or any special requests..."
        rows={4}
      />

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Enquiry'
          )}
        </Button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        By submitting this form, you agree to our Privacy Policy and Terms of Service.
      </p>
    </form>
  );
};

export default LeadForm;
