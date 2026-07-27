const ClientModel = require('../models/ClientModel');
const AuthService = require('../services/authService');

class ClientController {
    // Get all clients (Admin only)
    static async getAll(req, res) {
        try {
            const clients = await ClientModel.getAll();
            const sanitizedClients = clients.map(client => {
                delete client.password;
                return client;
            });
            res.json({
                success: true,
                count: sanitizedClients.length,
                data: sanitizedClients
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get client by ID
    static async getById(req, res) {
        try {
            const client = await ClientModel.getById(req.params.id);
            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }
            delete client.password;
            res.json({
                success: true,
                data: client
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Register new client
    static async register(req, res) {
        try {
            const { client, token } = await AuthService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: {
                    client,
                    token
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Login
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const { client, token } = await AuthService.login(username, password);
            
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    client,
                    token
                }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get current profile (Protected)
    static async getProfile(req, res) {
        try {
            const client = await ClientModel.getById(req.client.id);
            delete client.password;
            res.json({
                success: true,
                data: client
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update client
    static async update(req, res) {
        try {
            const updated = await ClientModel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }
            res.json({
                success: true,
                message: 'Client updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete client
    static async delete(req, res) {
        try {
            const deleted = await ClientModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }
            res.json({
                success: true,
                message: 'Client deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ClientController;