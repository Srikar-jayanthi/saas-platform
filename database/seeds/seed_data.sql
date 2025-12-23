-- Create Demo Tenant
INSERT INTO tenants (id, name, subdomain, status, subscription_plan, max_users, max_projects)
VALUES ('d0e4c6b0-7164-4f23-9c71-3a059c3d4e0a', 'Demo Company', 'demo', 'active', 'pro', 25, 15);

-- Create Super Admin (tenant_id is NULL)
-- Password: Admin@123
INSERT INTO users (email, password_hash, full_name, role, tenant_id)
VALUES ('superadmin@system.com', '$2b$10$YourHashedPasswordHere', 'System Admin', 'super_admin', NULL);

-- Create Tenant Admin
-- Password: Demo@123
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
VALUES ('a1e4c6b0-7164-4f23-9c71-3a059c3d4e0b', 'd0e4c6b0-7164-4f23-9c71-3a059c3d4e0a', 'admin@demo.com', '$2b$10$YourHashedPasswordHere', 'Demo Admin', 'tenant_admin');

-- Create Sample Project
INSERT INTO projects (id, tenant_id, name, description, status, created_by)
VALUES ('p1e4c6b0-7164-4f23-9c71-3a059c3d4e0c', 'd0e4c6b0-7164-4f23-9c71-3a059c3d4e0a', 'Project Alpha', 'First demo project', 'active', 'a1e4c6b0-7164-4f23-9c71-3a059c3d4e0b');