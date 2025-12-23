const express = require('express');
const router = express.Router();
const projCtrl = require('../controllers/projectController');
const taskCtrl = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, projCtrl.createProject);
router.get('/', authenticate, projCtrl.listProjects);
router.post('/:projectId/tasks', authenticate, taskCtrl.createTask);
router.patch('/tasks/:taskId/status', authenticate, taskCtrl.updateTaskStatus);

module.exports = router;