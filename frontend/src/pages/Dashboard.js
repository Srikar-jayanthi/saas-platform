import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, users: 0 });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await api.get('/projects');
        const userRes = await api.get(`/tenants/${user.tenantId}/users`);
        
        setStats({
          projects: projRes.data.data.projects.length,
          tasks: projRes.data.data.projects.reduce((acc, p) => acc + (p.task_count || 0), 0),
          users: userRes.data.data.users.length
        });
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchData();
  }, [user.tenantId]);

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Dashboard Overview</h2>
        <p style={{ color: '#6b7280' }}>Welcome back, {user?.fullName}. Here is your organization's summary.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p>{stats.projects}</p>
        </div>
        <div className="stat-card">
          <h3>Active Tasks</h3>
          <p>{stats.tasks}</p>
        </div>
        <div className="stat-card">
          <h3>Team Capacity</h3>
          <p>{stats.users} Users</p>
        </div>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
        <h3 style={{ marginBottom: '1rem' }}>Subscription Status</h3>
        <p>You are currently on the <strong>Free Plan</strong>.</p>
        <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '0.5rem', color: '#1e40af', fontSize: '0.875rem' }}>
          Limits: 5 Users / 3 Projects
        </div>
      </div>
    </div>
  );
};

export default Dashboard;