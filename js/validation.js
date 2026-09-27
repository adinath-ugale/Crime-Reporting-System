/**
 * CRIME REPORTING SYSTEM (CRS) - FORM VALIDATION UTILITIES
 * Real-time and submission validation for emails, Indian mobile numbers, pincodes, and passwords.
 */

const Validator = {
  // Regex definitions
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  MOBILE_REGEX: /^[6-9]\d{9}$/, // Standard 10-digit Indian mobile starting with 6-9
  PINCODE_REGEX: /^[1-9][0-9]{5}$/, // Standard 6-digit Indian PIN code

  /**
   * Validate required field
   */
  isRequired(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },

  /**
   * Validate Email format
   */
  isValidEmail(email) {
    if (!email) return false;
    return this.EMAIL_REGEX.test(email.trim());
  },

  /**
   * Validate Mobile number
   */
  isValidMobile(mobile) {
    if (!mobile) return false;
    // Strip spaces or dashes
    const cleaned = mobile.toString().replace(/[\s-]/g, '');
    return this.MOBILE_REGEX.test(cleaned);
  },

  /**
   * Validate Indian Pincode
   */
  isValidPincode(pincode) {
    if (!pincode) return false;
    return this.PINCODE_REGEX.test(pincode.toString().trim());
  },

  /**
   * Check password strength
   * Returns: { score: 0-4, label: 'Weak'|'Moderate'|'Strong', isValid: boolean }
   */
  checkPasswordStrength(password) {
    if (!password) {
      return { score: 0, label: 'Empty', isValid: false };
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = 'Weak';
    if (score === 3) label = 'Moderate';
    if (score >= 4) label = 'Strong';

    return {
      score,
      label,
      isValid: password.length >= 6 // Minimum baseline
    };
  },

  /**
   * Show error on an input element
   */
  showError(inputElement, message) {
    if (!inputElement) return;
    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid');

    // Check for existing feedback element
    let parent = inputElement.parentElement;
    if (parent.classList.contains('input-group') || parent.classList.contains('password-input-wrapper')) {
      parent = parent.parentElement;
    }

    let feedback = parent.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      parent.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.style.display = 'flex';
  },

  /**
   * Clear error on an input element
   */
  clearError(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove('is-invalid');

    let parent = inputElement.parentElement;
    if (parent.classList.contains('input-group') || parent.classList.contains('password-input-wrapper')) {
      parent = parent.parentElement;
    }

    const feedback = parent.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.textContent = '';
      feedback.style.display = 'none';
    }
  },

  /**
   * Mark input as valid
   */
  markValid(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');

    let parent = inputElement.parentElement;
    if (parent.classList.contains('input-group') || parent.classList.contains('password-input-wrapper')) {
      parent = parent.parentElement;
    }
    const feedback = parent.querySelector('.invalid-feedback');
    if (feedback) feedback.style.display = 'none';
  },

  /**
   * Clear all errors within a container/form
   */
  clearAllErrors(formElement) {
    if (!formElement) return;
    const invalidInputs = formElement.querySelectorAll('.is-invalid, .is-valid');
    invalidInputs.forEach(el => {
      el.classList.remove('is-invalid', 'is-valid');
    });
    const feedbacks = formElement.querySelectorAll('.invalid-feedback');
    feedbacks.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }
};
