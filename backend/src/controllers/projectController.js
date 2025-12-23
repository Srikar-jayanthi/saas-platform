const db = require('../config/db');

exports.createProject = async (req, res) => {
    const { name, description, status } = req.body;
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;

    try {
        // 1. Check Plan Limits
        const tenantRes = await db.query('SELECT max_projects FROM tenants WHERE id = $1', [tenantId]);
        const countRes = await db.query('SELECT COUNT(*) FROM projects WHERE tenant_id = $1', [tenantId]);

        if (parseInt(countRes.rows[0].count) >= tenantRes.rows[0].max_projects) {
            return res.status(403).json({ success: false, message: 'Project limit reached for your plan' });
        }

        // 2. Create Project
        const result = await db.query(
            'INSERT INTO projects (tenant_id, name, description, status, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [tenantId, name, description, status || 'active', userId]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.listProjects = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT p.*, u.full_name as creator_name,
            (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count
            FROM projects p
            JOIN users u ON p.created_by = u.id
            WHERE p.tenant_id = $1`,
            [req.user.tenantId]
        );
        res.json({ success: true, data: { projects: result.rows } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};