const Joi = require('joi');

// =========================================================
// CLIENT VALIDATIONS
// =========================================================

// Register client validation
const registerClientSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Username is required',
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username must be less than 50 characters',
            'any.required': 'Username is required'
        }),
    
    password: Joi.string()
        .min(6)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'string.max': 'Password must be less than 255 characters',
            'any.required': 'Password is required'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
    
    phone_number: Joi.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number',
            'string.empty': 'Phone number is required',
            'any.required': 'Phone number is required'
        }),
    
    whatsapp_number: Joi.string()
        .pattern(/^[0-9+\-\s()]*$/)
        .allow('', null)
        .messages({
            'string.pattern.base': 'Please provide a valid WhatsApp number'
        }),
    
    full_name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Full name is required',
            'string.min': 'Full name must be at least 2 characters',
            'string.max': 'Full name must be less than 100 characters',
            'any.required': 'Full name is required'
        })
});

// Login client validation
const loginClientSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'string.empty': 'Username is required',
            'any.required': 'Username is required'
        }),
    
    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
});

// Update client validation
const updateClientSchema = Joi.object({
    email: Joi.string()
        .email()
        .messages({
            'string.email': 'Please provide a valid email address'
        }),
    
    phone_number: Joi.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .messages({
            'string.pattern.base': 'Please provide a valid phone number'
        }),
    
    whatsapp_number: Joi.string()
        .pattern(/^[0-9+\-\s()]*$/)
        .allow('', null),
    
    full_name: Joi.string()
        .min(2)
        .max(100),
    
    is_active: Joi.boolean()
});

// =========================================================
// PROPERTY VALIDATIONS (Hot Sales)
// =========================================================

const hotSalesSchema = Joi.object({
    client_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Client ID must be a number',
            'number.positive': 'Client ID must be a positive number',
            'any.required': 'Client ID is required'
        }),
    
    title: Joi.string()
        .min(3)
        .max(150)
        .required()
        .messages({
            'string.empty': 'Title is required',
            'string.min': 'Title must be at least 3 characters',
            'string.max': 'Title must be less than 150 characters',
            'any.required': 'Title is required'
        }),
    
    description: Joi.string()
        .allow('', null),
    
    price: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be greater than 0',
            'any.required': 'Price is required'
        }),
    
    property_type: Joi.string()
        .required()
        .messages({
            'string.empty': 'Property type is required',
            'any.required': 'Property type is required'
        }),
    
    overview: Joi.object()
        .allow(null),
    
    highlights: Joi.object()
        .allow(null),
    
    area_sqft: Joi.number()
        .positive()
        .allow(null)
        .messages({
            'number.positive': 'Area must be greater than 0'
        }),
    
    city: Joi.string()
        .required()
        .messages({
            'string.empty': 'City is required',
            'any.required': 'City is required'
        }),
    
    map_address: Joi.string()
        .allow('', null),
    
    location: Joi.string()
        .required()
        .messages({
            'string.empty': 'Location is required',
            'any.required': 'Location is required'
        }),
    
    main_image: Joi.string()
        .required()
        .messages({
            'string.empty': 'Main image is required',
            'any.required': 'Main image is required'
        }),
    
    images: Joi.array()
        .items(Joi.string())
        .allow(null),
    
    status: Joi.string()
        .valid('pending', 'active', 'sold')
        .default('pending')
});

// =========================================================
// STAYS TO BUY VALIDATIONS
// =========================================================

const staysToBuySchema = hotSalesSchema.keys({
    // Same as hot_sales but with different status
    status: Joi.string()
        .valid('pending', 'active', 'sold')
        .default('pending')
});

// =========================================================
// STAYS TO RENT VALIDATIONS
// =========================================================

const staysToRentSchema = hotSalesSchema.keys({
    price_period: Joi.string()
        .valid('monthly', 'yearly')
        .default('monthly'),
    
    status: Joi.string()
        .valid('pending', 'active', 'rented')
        .default('pending')
});

// =========================================================
// LAND VALIDATIONS
// =========================================================

const landSchema = Joi.object({
    client_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Client ID must be a number',
            'number.positive': 'Client ID must be a positive number',
            'any.required': 'Client ID is required'
        }),
    
    title: Joi.string()
        .min(3)
        .max(150)
        .required()
        .messages({
            'string.empty': 'Title is required',
            'string.min': 'Title must be at least 3 characters',
            'string.max': 'Title must be less than 150 characters',
            'any.required': 'Title is required'
        }),
    
    description: Joi.string()
        .allow('', null),
    
    price: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be greater than 0',
            'any.required': 'Price is required'
        }),
    
    land_size: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Land size must be a number',
            'number.positive': 'Land size must be greater than 0',
            'any.required': 'Land size is required'
        }),
    
    size_unit: Joi.string()
        .valid('perches', 'acres', 'sqft')
        .default('perches'),
    
    location: Joi.string()
        .allow('', null),
    
    city: Joi.string()
        .required()
        .messages({
            'string.empty': 'City is required',
            'any.required': 'City is required'
        }),
    
    main_image: Joi.string()
        .required()
        .messages({
            'string.empty': 'Main image is required',
            'any.required': 'Main image is required'
        }),
    
    images: Joi.array()
        .items(Joi.string())
        .allow(null),
    
    status: Joi.string()
        .valid('pending', 'active', 'sold')
        .default('pending')
});

// =========================================================
// WANTED VALIDATIONS
// =========================================================

const wantedSchema = Joi.object({
    client_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Client ID must be a number',
            'number.positive': 'Client ID must be a positive number',
            'any.required': 'Client ID is required'
        }),
    
    title: Joi.string()
        .min(3)
        .max(150)
        .required()
        .messages({
            'string.empty': 'Title is required',
            'string.min': 'Title must be at least 3 characters',
            'string.max': 'Title must be less than 150 characters',
            'any.required': 'Title is required'
        }),
    
    description: Joi.string()
        .allow('', null),
    
    budget: Joi.number()
        .positive()
        .allow(null)
        .messages({
            'number.positive': 'Budget must be greater than 0'
        }),
    
    preferred_city: Joi.string()
        .allow('', null),
    
    phone_number: Joi.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number',
            'string.empty': 'Phone number is required',
            'any.required': 'Phone number is required'
        }),
    
    main_image: Joi.string()
        .allow('', null),
    
    images: Joi.array()
        .items(Joi.string())
        .allow(null),
    
    status: Joi.string()
        .valid('pending', 'active', 'closed')
        .default('pending')
});

// =========================================================
// AD VALIDATIONS
// =========================================================

const adSchema = Joi.object({
    client_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Client ID must be a number',
            'number.positive': 'Client ID must be a positive number',
            'any.required': 'Client ID is required'
        }),
    
    title: Joi.string()
        .max(150)
        .allow('', null),
    
    image: Joi.string()
        .required()
        .messages({
            'string.empty': 'Image is required',
            'any.required': 'Image is required'
        }),
    
    link_url: Joi.string()
        .uri()
        .allow('', null)
        .messages({
            'string.uri': 'Please provide a valid URL'
        }),
    
    position: Joi.number()
        .integer()
        .min(0)
        .default(0),
    
    is_active: Joi.boolean()
        .default(true)
});

// =========================================================
// PAYMENT VALIDATIONS
// =========================================================

const paymentSchema = Joi.object({
    client_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Client ID must be a number',
            'number.positive': 'Client ID must be a positive number',
            'any.required': 'Client ID is required'
        }),
    
    property_type: Joi.string()
        .valid('hot_sales', 'stays_to_buy', 'stays_to_rent', 'wanted', 'land')
        .required()
        .messages({
            'string.base': 'Invalid property type',
            'any.required': 'Property type is required'
        }),
    
    property_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Property ID must be a number',
            'number.positive': 'Property ID must be a positive number',
            'any.required': 'Property ID is required'
        }),
    
    amount: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Amount must be a number',
            'number.positive': 'Amount must be greater than 0',
            'any.required': 'Amount is required'
        }),
    
    payment_method: Joi.string()
        .allow('', null),
    
    transaction_ref: Joi.string()
        .allow('', null)
});

// =========================================================
// EXPORT ALL SCHEMAS
// =========================================================

module.exports = {
    registerClientSchema,
    loginClientSchema,
    updateClientSchema,
    hotSalesSchema,
    staysToBuySchema,
    staysToRentSchema,
    landSchema,
    wantedSchema,
    adSchema,
    paymentSchema
};