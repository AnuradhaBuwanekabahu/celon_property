const jwt = require('jsonwebtoken');
const ClientModel = require('../models/ClientModel');

class AuthService {
    generateToken(client) {
        return jwt.sign(
            { 
                id: client.id, 
                username: client.username,
                email: client.email 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        } catch (error) {
            return null;
        }
    }

    async register(clientData) {
        const existingUser = await ClientModel.getByUsername(clientData.username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const existingEmail = await ClientModel.getByEmail(clientData.email);
        if (existingEmail) {
            throw new Error('Email already exists');
        }

        const id = await ClientModel.create(clientData);
        const client = await ClientModel.getById(id);
        const token = this.generateToken(client);
        
        return { client, token };
    }

    async login(username, password) {
        const client = await ClientModel.login(username, password);
        
        if (!client) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(client);
        return { client, token };
    }
}

module.exports = new AuthService();