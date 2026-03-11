// Input sanitization utilities

export const sanitizeText = (text) => {
    if (typeof text !== 'string') return '';
    
    return text
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .substring(0, 1000); // Limit length
};

export const sanitizeEmail = (email) => {
    if (typeof email !== 'string') return '';
    
    return email
        .toLowerCase()
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML
        .substring(0, 255); // Limit length
};

export const sanitizeName = (name) => {
    if (typeof name !== 'string') return '';
    
    return name
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML
        .replace(/[^a-zA-Z0-9\s]/g, '') // Allow only letters, numbers, and spaces
        .substring(0, 50); // Limit length
};

export const sanitizeBio = (bio) => {
    if (typeof bio !== 'string') return '';
    
    return bio
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .substring(0, 500); // Limit length
};
