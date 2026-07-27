const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { auth, isAdmin, isSuperAdmin } = require('../middleware/auth');

// =========================================================
// PUBLIC ROUTES (No Authentication)
// =========================================================

// Create Super Admin (First time setup - only if no super admin exists)
router.post('/setup', AdminController.createSuperAdmin);

// Admin login
router.post('/login', AdminController.login);

// =========================================================
// PROTECTED ROUTES (Admin Authentication Required)
// =========================================================

// Profile
router.get('/profile', auth, isAdmin, AdminController.getProfile);

// Dashboard Stats
router.get('/stats', auth, isAdmin, AdminController.getStats);

// =========================================================
// ADMIN MANAGEMENT (Super Admin Only)
// =========================================================

// Get all admins
router.get('/admins', auth, isSuperAdmin, AdminController.getAllAdmins);

// Get pending admins
router.get('/admins/pending', auth, isSuperAdmin, AdminController.getPendingAdmins);

// Approve admin
router.put('/admins/:id/approve', auth, isSuperAdmin, AdminController.approveAdmin);

// Delete admin
router.delete('/admins/:id', auth, isSuperAdmin, AdminController.deleteAdmin);

// =========================================================
// CLIENT MANAGEMENT
// =========================================================

// Get all clients (All Admins)
router.get('/clients', auth, isAdmin, AdminController.getAllClients);

// Toggle client status (All Admins)
router.patch('/clients/:id/toggle', auth, isAdmin, AdminController.toggleClientStatus);

// Delete client (Super Admin Only)
router.delete('/clients/:id', auth, isSuperAdmin, AdminController.deleteClient);

// =========================================================
// PROPERTY MANAGEMENT
// =========================================================

// Get all properties (All Admins)
router.get('/properties', auth, isAdmin, AdminController.getAllProperties);

// Approve property (All Admins)
router.patch('/properties/:id/approve', auth, isAdmin, AdminController.approveProperty);

// Reject property (All Admins - soft reject)
router.patch('/properties/:id/reject', auth, isAdmin, AdminController.rejectProperty);

// Delete property (Super Admin Only)
router.delete('/properties/:id', auth, isSuperAdmin, AdminController.deleteProperty);

// =========================================================
// AD MANAGEMENT
// =========================================================

// Get all ads (All Admins)
router.get('/ads', auth, isAdmin, AdminController.getAllAds);

// Get pending ads (All Admins)
router.get('/ads/pending', auth, isAdmin, AdminController.getPendingAds);

// Approve ad (All Admins)
router.patch('/ads/:id/approve', auth, isAdmin, AdminController.approveAd);

// Reject ad (All Admins - soft reject)
router.patch('/ads/:id/reject', auth, isAdmin, AdminController.rejectAd);

// Delete ad (Super Admin Only)
router.delete('/ads/:id', auth, isSuperAdmin, AdminController.deleteAd);

// =========================================================
// PAYMENT MANAGEMENT (All Admins - View Only)
// =========================================================

// Get all payments
router.get('/payments', auth, isAdmin, AdminController.getAllPayments);

// Get payment stats
router.get('/payments/stats', auth, isAdmin, AdminController.getPaymentStats);

module.exports = router;