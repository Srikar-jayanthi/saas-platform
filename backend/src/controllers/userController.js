const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.addUser = async (req, res) => {
    const { tenantId } = req.params;
    const { email, password, fullName, role } = req.body;

    try {
        // 1. Get Tenant Plan Limits
        const tenantRes = await db.query('SELECT max_users FROM tenants WHERE id = $1', [tenantId]);
        const maxUsers = tenantRes.rows[0].max_users;

        // 2. Count Current Users
        const countRes = await db.query('SELECT COUNT(*) FROM users WHERE tenant_id = $1', [tenantId]);
        if (parseInt(countRes.rows[0].count) >= maxUsers) {
            return res.status(403).json({ success: false, message: 'Subscription limit reached: Max users exceeded' });
        }

        // 3. Create User
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.query(
            'INSERT INTO users (tenant_id, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, role',
            [tenantId, email, hashedPassword, fullName, role || 'user']
        );

        res.status(201).json({ success: true, data: newUser.rows[0] });
    } catch (error) {
        res.status(409).json({ success: false, message: "User already exists in this tenant" });
    }
};

exports.listUsers = async (req, res) => {
    const { tenantId } = req.params;
    try {
        const result = await db.query(
            'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE tenant_id = $1',
            [tenantId]
        );
        res.json({ success: true, data: { users: result.rows } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};