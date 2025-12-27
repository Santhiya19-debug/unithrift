/**
 * Email Validation Utilities
 * Enforces strict email rules for VIT student and faculty emails
 */

// Allowed email domains
const ALLOWED_DOMAINS = {
  STUDENT: 'vitstudent.ac.in',
  FACULTY: 'artvip.ac.in'
};

/**
 * Validate student email
 * Pattern: letters[.letters]*YYYY@vitstudent.ac.in
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid student email
 */
export const isValidStudentEmail = (email) => {
  if (!email) return false;
  
  // Must end with @vitstudent.ac.in
  if (!email.endsWith(`@${ALLOWED_DOMAINS.STUDENT}`)) {
    return false;
  }
  
  // Extract username part
  const username = email.split('@')[0];
  
  // Regex: starts with letters, optional dots + letters, ends with 4 digits
  const studentPattern = /^[a-zA-Z]+(\.[a-zA-Z]+)*\d{4}$/;
  
  return studentPattern.test(username);
};

/**
 * Validate faculty email
 * Pattern: any@artvip.ac.in
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid faculty email
 */
export const isValidFacultyEmail = (email) => {
  if (!email) return false;
  
  // Must end with @artvip.ac.in
  return email.endsWith(`@${ALLOWED_DOMAINS.FACULTY}`);
};

/**
 * Validate any allowed institutional email
 * @param {string} email - Email to validate
 * @returns {Object} Validation result with type
 */
export const validateInstitutionalEmail = (email) => {
  if (!email) {
    return { 
      isValid: false, 
      error: 'Email is required',
      type: null 
    };
  }

  // Trim whitespace
  email = email.trim().toLowerCase();

  // Check for basic email format
  if (!email.includes('@') || !email.includes('.')) {
    return { 
      isValid: false, 
      error: 'Invalid email format',
      type: null 
    };
  }

  // Check student email
  if (isValidStudentEmail(email)) {
    return { 
      isValid: true, 
      error: null,
      type: 'student' 
    };
  }

  // Check faculty email
  if (isValidFacultyEmail(email)) {
    return { 
      isValid: true, 
      error: null,
      type: 'faculty' 
    };
  }

  // Determine specific error message
  const domain = email.split('@')[1];
  
  if (domain === ALLOWED_DOMAINS.STUDENT) {
    return { 
      isValid: false, 
      error: 'Student email must end with a 4-digit year (e.g., alex2024@vitstudent.ac.in)',
      type: null 
    };
  }

  // Check if it's a public domain
  const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  if (publicDomains.some(d => email.endsWith(d))) {
    return { 
      isValid: false, 
      error: 'Public email addresses are not allowed. Use your institutional email.',
      type: null 
    };
  }

  // Generic error for other domains
  return { 
    isValid: false, 
    error: `Only ${ALLOWED_DOMAINS.STUDENT} and ${ALLOWED_DOMAINS.FACULTY} emails are allowed`,
    type: null 
  };
};

/**
 * Get email validation rules for display
 * @returns {Array} Array of rule objects
 */
export const getEmailRules = () => {
  return [
    {
      title: 'For Students',
      domain: ALLOWED_DOMAINS.STUDENT,
      rules: [
        'Must end with @vitstudent.ac.in',
        'Start with letters only',
        'Optional dots between name parts',
        'Must end with 4-digit year'
      ],
      examples: [
        'alex2024@vitstudent.ac.in',
        'alex.s2023@vitstudent.ac.in',
        'alex.kumar2022@vitstudent.ac.in'
      ]
    },
    {
      title: 'For Faculty',
      domain: ALLOWED_DOMAINS.FACULTY,
      rules: [
        'Must end with @artvip.ac.in',
        'No year requirement'
      ],
      examples: [
        'john.doe@artvip.ac.in',
        'faculty@artvip.ac.in'
      ]
    }
  ];
};

/**
 * Extract year from student email
 * @param {string} email - Student email
 * @returns {string|null} Year or null
 */
export const extractYearFromEmail = (email) => {
  if (!isValidStudentEmail(email)) return null;
  
  const username = email.split('@')[0];
  const yearMatch = username.match(/\d{4}$/);
  
  return yearMatch ? yearMatch[0] : null;
};