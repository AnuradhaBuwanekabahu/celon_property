const ClientModel = require('../models/ClientModel');

class ClientController {
    // Get all clients
    static async getAll(req, res) {
        try {
            const clients = await ClientModel.getAll();
            res.json({
                success: true,
                count: clients.length,
                data: clients
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

    // Create new client
    static async create(req, res) {
        try {
            // Check if username exists
            const existingUser = await ClientModel.getByUsername(req.body.username);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists'
                });
            }

            // Check if email exists
            const existingEmail = await ClientModel.getByEmail(req.body.email);
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            const id = await ClientModel.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Client created successfully',
                id: id
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

    // Login
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username and password are required'
                });
            }

            const client = await ClientModel.login(username, password);
            if (!client) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials or account inactive'
                });
            }

            res.json({
                success: true,
                message: 'Login successful',
                data: client
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