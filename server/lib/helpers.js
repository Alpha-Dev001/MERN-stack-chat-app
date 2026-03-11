// Utility functions for better error handling and validation

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${fieldName} is required`;
    }
    return null;
};

export const sanitizeString = (str) => {
    return str ? str.trim() : '';
};

export const createErrorResponse = (message, statusCode = 400) => {
    return {
        success: false,
        message,
        statusCode
    };
};

export const createSuccessResponse = (data, message = 'Operation successful') => {
    return {
        success: true,
        message,
        data
    };
};

export const logError = (error, context = '') => {
    console.error(`Error ${context ? `in ${context}: ` : ''}`, {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    });
};

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
