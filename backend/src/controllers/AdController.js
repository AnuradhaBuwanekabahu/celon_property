const AdModel = require('../models/AdModel');

class AdController {
    static async getAll(req, res) {
        try {
            const data = await AdModel.getAll();
            res.json({ success: true, count: data.length, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getActive(req, res) {
        try {
            const data = await AdModel.getActive();
            res.json({ success: true, count: data.length, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const data = await AdModel.getById(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: 'Record not found' });
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async create(req, res) {
        try {
            const id = await AdModel.create(req.body);
            res.status(201).json({ success: true, message: 'Ad created successfully', id });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const updated = await AdModel.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({ success: false, message: 'Record not found' });
            res.json({ success: true, message: 'Ad updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async toggleActive(req, res) {
        try {
            const { is_active } = req.body;
            const updated = await AdModel.toggleActive(req.params.id, is_active);
            if (!updated) return res.status(404).json({ success: false, message: 'Record not found' });
            res.json({ success: true, message: 'Ad status updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const deleted = await AdModel.delete(req.params.id);
            if (!deleted) return res.status(404).json({ success: false, message: 'Record not found' });
            res.json({ success: true, message: 'Ad deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = AdController;