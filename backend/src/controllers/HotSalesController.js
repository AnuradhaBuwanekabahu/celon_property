const HotSalesModel = require('../models/HotSalesModel');

class HotSalesController {
    static async getAll(req, res) {
        try {
            const properties = await HotSalesModel.getAll();
            res.json({
                success: true,
                count: properties.length,
                data: properties
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const property = await HotSalesModel.getById(req.params.id);
            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }
            res.json({
                success: true,
                data: property
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getByClient(req, res) {
        try {
            const properties = await HotSalesModel.getByClient(req.params.clientId);
            res.json({
                success: true,
                count: properties.length,
                data: properties
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async search(req, res) {
        try {
            const properties = await HotSalesModel.search(req.query);
            res.json({
                success: true,
                count: properties.length,
                data: properties
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async create(req, res) {
        try {
            const id = await HotSalesModel.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Property created successfully',
                id: id
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const updated = await HotSalesModel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }
            res.json({
                success: true,
                message: 'Property updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const deleted = await HotSalesModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }
            res.json({
                success: true,
                message: 'Property deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const updated = await HotSalesModel.updateStatus(req.params.id, status);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }
            res.json({
                success: true,
                message: 'Property status updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = HotSalesController;