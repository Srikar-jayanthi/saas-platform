const db = require('../config/db');

exports.getTenants = async (req, res) => {
    try {
        // Only Super Admin can see all tenants
        const result = await db.query(
            `SELECT t.*, 
            (SELECT COUNT(*) FROM users WHERE tenant_id = t.id) as total_users,
            (SELECT COUNT(*) FROM projects WHERE tenant_id = t.id) as total_projects
            FROM tenants t ORDER BY t.created_at DESC`
        );
        res.json({ success: true, data: { tenants: result.rows } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTenantDetails = async (req, res) => {
    const { tenantId } = req.params;
    try {
        // Isolation Check: User must belong to the tenant unless Super Admin
        if (req.user.role !== 'super_admin' && req.user.tenantId !== tenantId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        const result = await db.query('SELECT * FROM tenants WHERE id = $1', [tenantId]);
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};