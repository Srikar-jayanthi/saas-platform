import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [loading, setLoading] = useState(true);

  // Retrieve user for Role-Based UI logic
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Optimized Fetch Function with Nested Data Handling
  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      // API 14: Fetch specific project metadata
      const pRes = await api.get(`/projects/${projectId}`); 
      // API 17: Fetch tasks for this project
      const tRes = await api.get(`/projects/${projectId}/tasks`);
      
      setProject(pRes.data?.data || pRes.data);
      setTasks(tRes.data?.data?.tasks || tRes.data?.tasks || []);
    } catch (err) { 
      console.error("Error fetching project details:", err);
      // Data Isolation: Redirect if access denied
      if (err.response?.status === 403 || err.response?.status === 404) {
        alert("Project not found or access denied.");
        navigate('/projects');
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, navigate]);

  useEffect(() => { 
    fetchDetails(); 
  }, [fetchDetails]);

  // 2. API 18: Task Status Update
  const updateStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/projects/tasks/${taskId}/status`, { status: newStatus });
      // Re-fetch to sync Audit Logs and Dashboard metrics
      fetchDetails();
    } catch (err) { 
      alert(err.response?.data?.message || "Failed to update status"); 
    }
  };

  // 3. API 16: Task Creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${projectId}/tasks`, newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'medium' }); 
      fetchDetails();
    } catch (err) { 
      // Handle tenant-specific validation errors
      alert(err.response?.data?.message || "Error creating task"); 
    }
  };

  if (loading) return <div className="main-content" style={{ padding: '2rem' }}>Loading Project...</div>;
  if (!project) return <div className="main-content" style={{ padding: '2rem' }}>Project not found.</div>;

  return (
    <div className="project-details-container">
      {/* Header Section with Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button onClick={() => navigate('/projects')} style={{ background: 'none', color: '#2563eb', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '1rem' }}>
            &larr; Back to Projects
          </button>
          <h2 style={{ margin: 0 }}>{project.name}</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>{project.description}</p>
        </div>

        {/* Role-Based UI: Only Admin/Creator can add tasks */}
        {(user?.role === 'tenant_admin' || user?.role === 'super_admin' || user?.id === project.created_by) && (
          <button 
            onClick={() => setShowTaskModal(true)} 
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 20px', cursor: 'pointer' }}
          >
            + Add Task
          </button>
        )}
      </div>

      {/* Kanban Board Layout */}
      <div className="kanban-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {['todo', 'in_progress', 'completed'].map(status => (
          <div key={status} className="kanban-column" style={{ minHeight: '500px', background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ textTransform: 'capitalize', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
              {status.replace('_', ' ')}
              <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            
            {tasks.filter(t => t.status === status).map(task => (
              <div 
                key={task.id} 
                className="task-card" 
                style={{ 
                  marginTop: '15px', 
                  borderLeft: task.priority === 'high' ? '4px solid #ef4444' : task.priority === 'medium' ? '4px solid #f59e0b' : '4px solid #10b981',
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>{task.title}</h4>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>{task.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold', color: '#4b5563', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>
                      {task.priority}
                    </span>
                    
                    {/* Status update restricted to tenant users */}
                    <select 
                      value={task.status} 
                      onChange={(e) => updateStatus(task.id, e.target.value)}
                      style={{ fontSize: '0.75rem', padding: '4px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      <option value="todo">Todo</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* New Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ width: '450px', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Task Title</label>
                <input 
                  required 
                  className="form-input"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  placeholder="Task title..."
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})} 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Description</label>
                <textarea 
                  className="form-input"
                  placeholder="Task details..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', minHeight: '80px' }}
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})} 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Priority</label>
                <select 
                  className="form-input"
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value})} 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 2, padding: '0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                  Create Task
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)} 
                  style={{ flex: 1, background: '#9ca3af', border: 'none', color: 'white', borderRadius: '0.375rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;