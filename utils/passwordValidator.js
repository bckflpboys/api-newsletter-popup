const zxcvbn = require('zxcvbn');

const passwordValidator = {
  validatePassword: (password) => {
    const result = zxcvbn(password);
    
    // Score ranges from 0 to 4
    const strengthMap = {
      0: 'Very Weak',
      1: 'Weak',
      2: 'Fair',
      3: 'Strong',
      4: 'Very Strong'
    };

    const requirements = {
      minLength: password.length >= 12,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      notCommon: !result.feedback.suggestions.includes('Use a longer keyboard pattern'),
      noPersonalInfo: true // This should be checked against user data
    };

    return {
      score: result.score,
      strength: strengthMap[result.score],
      requirements,
      feedback: result.feedback,
      isStrong: result.score >= 3 && Object.values(requirements).every(req => req)
    };
  },

  generateSecurePassword: () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    
    // Ensure at least one of each required character type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*()'[Math.floor(Math.random() * 10)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }
};

module.exports = passwordValidator;
