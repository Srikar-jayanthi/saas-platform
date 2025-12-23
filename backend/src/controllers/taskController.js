const db = require('../config/db');

exports.createTask = async (req, res) => {
    const { projectId } = req.params;
    const { title, description, assignedTo, priority, dueDate } = req.body;

    try {
        // 1. Verify project belongs to user's tenant
        const projectRes = await db.query(
            'SELECT id, tenant_id FROM projects WHERE id = $1 AND tenant_id = $2',
            [projectId, req.user.tenantId]
        );

        if (projectRes.rows.length === 0) {
            return res.status(403).json({ success: false, message: 'Project not found or access denied' });
        }

        // 2. Create Task
        const result = await db.query(
            `INSERT INTO tasks (project_id, tenant_id, title, description, assigned_to, priority, due_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [projectId, req.user.tenantId, title, description, assignedTo, priority || 'medium', dueDate]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    try {
        const result = await db.query(
            'UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3 RETURNING *',
            [status, taskId, req.user.tenantId]
        );

        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Task not found' });

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};