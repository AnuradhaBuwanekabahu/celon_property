import db from "../../configuration/db.js";

// Get all clients
export const getAllClients = async (req, res) => {
    try {
        const [clients] = await db.query(
            "SELECT id, full_name, email, phone_number, whatsapp_number, is_active, created_at FROM clients ORDER BY created_at DESC"
        );
        res.status(200).json({ success: true, data: clients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error fetching clients" });
    }
};

// Get clients by status
export const getClientsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const isActive = status === 'active' ? 1 : 0;
        
        const [clients] = await db.query(
            "SELECT id, full_name, email, phone_number, whatsapp_number, is_active, created_at FROM clients WHERE is_active = ? ORDER BY created_at DESC",
            [isActive]
        );
        res.status(200).json({ success: true, data: clients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error fetching clients by status" });
    }
};

// Search clients
export const searchClients = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: "Query string is required" });
        }
        
        const searchTerm = `%${q}%`;
        const [clients] = await db.query(
            "SELECT id, full_name, email, phone_number, whatsapp_number, is_active, created_at FROM clients WHERE full_name LIKE ? OR email LIKE ? OR phone_number LIKE ? ORDER BY created_at DESC",
            [searchTerm, searchTerm, searchTerm]
        );
        res.status(200).json({ success: true, data: clients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error searching clients" });
    }
};

// Update client
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, phone_number, whatsapp_number, is_active } = req.body;
        
        const [result] = await db.query(
            "UPDATE clients SET full_name = ?, email = ?, phone_number = ?, whatsapp_number = ?, is_active = ? WHERE id = ?",
            [full_name, email, phone_number, whatsapp_number, is_active ? 1 : 0, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }
        
        res.status(200).json({ success: true, message: "Client updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error updating client" });
    }
};

// Delete client
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.query("DELETE FROM clients WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }
        
        res.status(200).json({ success: true, message: "Client deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error deleting client" });
    }
};