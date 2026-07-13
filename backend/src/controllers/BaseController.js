class BaseController {
    constructor(model) {
        this.model = model;
    }

    getAll = async (req, res) => {
        try {
            const data = await this.model.getAll();
            res.json({
                success: true,
                count: data.length,
                data: data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    getById = async (req, res) => {
        try {
            const data = await this.model.getById(req.params.id);
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Record not found'
                });
            }
            res.json({
                success: true,
                data: data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    delete = async (req, res) => {
        try {
            const deleted = await this.model.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Record not found'
                });
            }
            res.json({
                success: true,
                message: 'Record deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = BaseController;