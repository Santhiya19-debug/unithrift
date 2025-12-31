/**
 * Email Validation (Backend)
 * Matches frontend validation rules exactly
 */

const ALLOWED_DOMAINS = {
  STUDENT: 'vitstudent.ac.in',
  FACULTY: 'artvip.ac.in'
};

/**
 * Validate student email
 * Pattern: letters[.letters]*YYYY@vitstudent.ac.in
 */
const isValidStudentEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  if (!email.endsWith(`@${ALLOWED_DOMAINS.STUDENT}`)) {
    return false;
  }
  
  const username = email.split('@')[0];
  const studentPattern = /^[a-zA-Z]+(\.[a-zA-Z]+)*\d{4}$/;
  
  return studentPattern.test(username);
};

/**
 * Validate faculty email
 * Pattern: any@artvip.ac.in
 */
const isValidFacultyEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return email.endsWith(`@${ALLOWED_DOMAINS.FACULTY}`);
};

/**
 * Validate institutional email (main validation)
 */
const validateInstitutionalEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  email = email.trim().toLowerCase();

  if (!email.includes('@') || !email.includes('.')) {
    return {
      isValid: false,
      error: 'Invalid email format'
    };
  }

  // Check student email
  if (isValidStudentEmail(email)) {
    return { isValid: true, type: 'student' };
  }

  // Check faculty email
  if (isValidFacultyEmail(email)) {
    return { isValid: true, type: 'faculty' };
  }

  // Determine specific error
  const domain = email.split('@')[1];
  
  if (domain === ALLOWED_DOMAINS.STUDENT) {
    return {
      isValid: false,
      error: 'Student email must end with a 4-digit year (e.g., alex2024@vitstudent.ac.in)'
    };
  }

  // Check if public domain
  const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  if (publicDomains.some(d => email.endsWith(d))) {
    return {
      isValid: false,
      error: 'Public email addresses are not allowed. Use your institutional email.'
    };
  }

  return {
    isValid: false,
    error: `Only ${ALLOWED_DOMAINS.STUDENT} and ${ALLOWED_DOMAINS.FACULTY} emails are allowed`
  };
};

module.exports = {
  validateInstitutionalEmail,
  isValidStudentEmail,
  isValidFacultyEmail,
  ALLOWED_DOMAINS
};