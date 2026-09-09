export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterInput(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const password = typeof data.password === 'string' ? data.password : '';
  const role = typeof data.role === 'string' ? data.role : 'patient';

  if (!name) {
    errors.name = 'Full legal name is required.';
  }

  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Invalid email address format.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  const validRoles = ['patient', 'pharmacist', 'wholesaler', 'admin'];
  if (!validRoles.includes(role)) {
    errors.role = `Invalid access role. Allowed: ${validRoles.join(', ')}`;
  }

  if (role === 'pharmacist') {
    const npi = typeof data.npiNumber === 'string' ? data.npiNumber.trim() : '';
    if (!npi) {
      errors.npiNumber = 'NPI (National Provider Identifier) is required for pharmacist accounts.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginInput(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  const identifier = typeof data.email === 'string' ? data.email.trim() : (typeof data.identifier === 'string' ? data.identifier.trim() : '');
  const password = typeof data.password === 'string' ? data.password : '';

  if (!identifier) {
    errors.email = 'Email, NPI, or Patient ID is required.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
