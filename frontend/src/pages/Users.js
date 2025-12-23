import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(`/tenants/${currentUser.tenantId}/users`);
        setUsers(res.data.data.users);
      } catch (err) { console.error(err); }
    };
    fetchUsers();
  }, [currentUser.tenantId]);

  return (
    <div>
      <h2>Team Members</h2>
      <div style={{ background: 'white', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Full Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{u.full_name}</td>
                <td style={{ padding: '1rem' }}>{u.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ border: '1px solid #d1d5db', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{u.role}</span>
                </td>
                <td style={{ padding: '1rem' }}>{u.is_active ? '✅ Active' : '❌ Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;