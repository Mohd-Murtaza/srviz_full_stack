export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };
  
  export const validateRequired = (value) => {
    return value && value.toString().trim().length > 0;
  };
  
  export const validateForm = (formData) => {
    const errors = {};
  
    if (!validateRequired(formData.name)) {
      errors.name = 'Name is required';
    }
  
    if (!validateRequired(formData.email)) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }
  
    if (!validateRequired(formData.phone)) {
      errors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  