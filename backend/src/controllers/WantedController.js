const WantedModel = require('../models/WantedModel');

class WantedController {
    static async getAll(req, res) {
        try {
            const data = await WantedModel.getAll();
            res.json({ success: true, count: data.length, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const data = await WantedModel.getById(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: 'Record not found' });
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getByClient(req, res) {
        try {
            const data = await WantedModel.getByClient(req.params.clientId);
            res.json({ success: true, count: data.length, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async search(req, res) {
        try {
            const data = await WantedModel.search(req.query);
            res.json({ success: true, count: data.length, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async create(req, res) {
        try {
            const id = await WantedModel.create(req.body);
            res.status(201).json({ success: true, message: 'Record created successfully', id });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const updated = await WantedModel.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({ success: false, message: 'Record not found' });
            res.json({ success: true, message: 'Record updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const deleted = await WantedModel.delete(req.params.id);
            if (!deleted) return res.status(404).json({ success: false, message: 'Record not found' });
            res.json({ success: true, message: 'Record deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const updated = await WantedModel.updateStatus(req.params.id, status);
            if (!updated) return res.status(404).json({ success: false, message: 'Record not found' });
            res.json({ success: true, message: 'Status updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = WantedController;