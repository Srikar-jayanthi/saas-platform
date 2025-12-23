import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data.projects);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Check your subscription limits');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Organization Projects</h2>
        <button onClick={() => setShowModal(true)} style={{ width: 'auto', padding: '10px 20px' }}>+ New Project</button>
      </div>

      <div style={{ background: 'white', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Project Name</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Tasks</th>
              <th style={{ padding: '1rem' }}>Created By</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{p.name}</td>
                <td style={{ padding: '1rem' }}><span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>{p.status}</span></td>
                <td style={{ padding: '1rem' }}>{p.task_count} tasks</td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>{p.creator_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="auth-card" style={{ width: '400px' }}>
            <h3>Create New Project</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label>Name</label><input required onChange={e => setNewProject({...newProject, name: e.target.value})} /></div>
              <div className="form-group"><label>Description</label><input onChange={e => setNewProject({...newProject, description: e.target.value})} /></div>
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: '#9ca3af', marginTop: '10px' }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
