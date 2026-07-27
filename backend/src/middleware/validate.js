const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }
        
        next();
    };
};

// Validate ID parameter
const validateId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID provided',
            errors: [{ field: 'id', message: 'ID must be a positive integer' }]
        });
    }
    next();
};

// Validate pagination query parameters
const validatePagination = (req, res, next) => {
    const { page, limit } = req.query;
    
    if (page && (isNaN(parseInt(page)) || parseInt(page) <= 0)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid pagination parameters',
            errors: [{ field: 'page', message: 'Page must be a positive integer' }]
        });
    }
    
    if (limit && (isNaN(parseInt(limit)) || parseInt(limit) <= 0 || parseInt(limit) > 100)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid pagination parameters',
            errors: [{ field: 'limit', message: 'Limit must be between 1 and 100' }]
        });
    }
    
    next();
};

module.exports = {
    validate,
    validateId,
    validatePagination
};