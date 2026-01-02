import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getNodalOfficers, createNodalOfficer, updateNodalOfficer, deleteNodalOfficer, getSchemes } from '../services/api';

const NodalOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    scheme_id: '',
    email: '',
    phone: '',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [officersRes, schemesRes] = await Promise.all([
        getNodalOfficers(),
        getSchemes()
      ]);
      setOfficers(officersRes.data || []);
      setSchemes(schemesRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch nodal officers. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (officer = null) => {
    if (officer) {
      setEditingOfficer(officer);
      setFormData({
        ...officer,
        scheme_id: officer.scheme_id || ''
      });
    } else {
      setEditingOfficer(null);
      setFormData({ name: '', designation: '', scheme_id: '', email: '', phone: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOfficer(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        scheme_id: Number(formData.scheme_id)
      };
      
      if (editingOfficer) {
        await updateNodalOfficer(editingOfficer.id, submitData);
      } else {
        await createNodalOfficer(submitData);
      }
      fetchData(); // Refresh the list
      handleCloseModal();
    } catch (err) {
      console.error('Error saving nodal officer:', err);
      alert('Failed to save nodal officer. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this nodal officer?')) {
      try {
        await deleteNodalOfficer(id);
        fetchData(); // Refresh the list
      } catch (err) {
        console.error('Error deleting nodal officer:', err);
        alert('Failed to delete nodal officer. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        {/* <Header title="Nodal Officers Management" /> */}
        <div className="loading-message">Loading nodal officers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        {/* <Header title="Nodal Officers Management" /> */}
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* <Header title="Nodal Officers Management" /> */}

      <div className="table-card">
        <div className="table-header">
          <h3>All Nodal Officers ({officers.length})</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <FiPlus /> Add Nodal Officer
          </button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Scheme</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {officers.map((officer) => (
                <tr key={officer.id}>
                  <td>{officer.name}</td>
                  <td>{officer.designation}</td>
                  <td>{officer.scheme_name}</td>
                  <td>{officer.email}</td>
                  <td>{officer.phone}</td>
                  <td>
                    <span className={`status-badge ${officer.status}`}>{officer.status}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => handleOpenModal(officer)}>
                        <FiEdit2 />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(officer.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingOfficer ? 'Edit Nodal Officer' : 'Add New Nodal Officer'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingOfficer ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Scheme</label>
            <select name="scheme_id" value={formData.scheme_id} onChange={handleChange} required>
              <option value="">Select Scheme</option>
              {schemes.map(scheme => (
                <option key={scheme.id} value={scheme.id}>{scheme.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NodalOfficers;
