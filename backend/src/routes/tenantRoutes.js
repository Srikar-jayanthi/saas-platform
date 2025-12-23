const express = require('express');
const router = express.Router();
const tenantCtrl = require('../controllers/tenantController');
const userCtrl = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('super_admin'), tenantCtrl.getTenants);
router.get('/:tenantId', authenticate, tenantCtrl.getTenantDetails);
router.post('/:tenantId/users', authenticate, authorize('tenant_admin'), userCtrl.addUser);
router.get('/:tenantId/users', authenticate, userCtrl.listUsers);

module.exports = router;