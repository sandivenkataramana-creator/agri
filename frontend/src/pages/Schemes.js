import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiUsers, FiUpload, FiFilter, FiX, FiSearch } from 'react-icons/fi';
import { getSchemes, createScheme, updateScheme, deleteScheme, getHODs, getCategories, createCategory } from '../services/api';
import * as XLSX from 'xlsx';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [hods, setHods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [viewingScheme, setViewingScheme] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    schemeName: '',
    hodId: '',
    categoryId: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    scheme_description: '',
    scheme_objective: '',
    scheme_benefits_desc: '',
    scheme_benefits_person: '',
    hod_id: '',
    category_id: '',
    total_budget: '',
    status: 'PLANNED',
    scheme_category: '',
    start_date: '',
    end_date: ''
  });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schemesRes, hodsRes, categoriesRes] = await Promise.all([
        getSchemes(),
        getHODs(),
        getCategories()
      ]);
      setSchemes(schemesRes.data || []);
      setHods(hodsRes.data || []);
      setCategories(categoriesRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch schemes. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await createCategory(newCategory);
      await fetchData();
      setIsCategoryModalOpen(false);
      setNewCategory({ name: '', description: '' });
      alert('Category created successfully!');
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Failed to create category. Please try again.');
    }
  };

  // Filter schemes based on selected filters
  const filteredSchemes = schemes.filter(scheme => {
    const matchesName = !filters.schemeName || 
      scheme.name?.toLowerCase().includes(filters.schemeName.toLowerCase());
    const matchesHod = !filters.hodId || 
      scheme.hod_id?.toString() === filters.hodId;
    const matchesCategory = !filters.categoryId || 
      scheme.category_id?.toString() === filters.categoryId;
    return matchesName && matchesHod && matchesCategory;
  });

  const clearFilters = () => {
    setFilters({ schemeName: '', hodId: '', categoryId: '' });
  };

  const hasActiveFilters = filters.schemeName || filters.hodId || filters.categoryId;

  const formatCurrency = (value) => {
    if (!value) return '₹0';
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const handleOpenModal = (scheme = null) => {
    if (scheme) {
      setEditingScheme(scheme);
      setFormData({
        ...scheme,
        hod_id: scheme.hod_id || ''
      });
    } else {
      setEditingScheme(null);
      setFormData({ 
        name: '', 
        scheme_description: '', 
        scheme_objective: '',
        scheme_benefits_desc: '',
        scheme_benefits_person: '',
        hod_id: '', 
        total_budget: '', 
        status: 'PLANNED', 
        scheme_category: '',
        start_date: '',
        end_date: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingScheme(null);
  };

  const handleViewScheme = (scheme) => {
    setViewingScheme(scheme);
    setIsViewModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        total_budget: Number(formData.total_budget),
        scheme_benefits_person: Number(formData.scheme_benefits_person),
        hod_id: Number(formData.hod_id)
      };
      
      if (editingScheme) {
        await updateScheme(editingScheme.id, submitData);
      } else {
        await createScheme(submitData);
      }
      fetchData(); // Refresh the list
      handleCloseModal();
    } catch (err) {
      console.error('Error saving scheme:', err);
      alert('Failed to save scheme. Please try again.');
    }
  };

  const handleExcelImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          let successCount = 0;
          let errorCount = 0;

          for (const row of jsonData) {
            try {
              const schemeData = {
                name: row['Scheme Name'] || row['name'] || '',
                scheme_description: row['Description'] || row['scheme_description'] || '',
                scheme_objective: row['Objective'] || row['scheme_objective'] || '',
                scheme_benefits_desc: row['Benefits Description'] || row['scheme_benefits_desc'] || '',
                scheme_benefits_person: Number(row['Beneficiaries'] || row['scheme_benefits_person']) || 0,
                hod_id: Number(row['HOD ID'] || row['hod_id']) || '',
                total_budget: Number(row['Total Budget'] || row['total_budget']) || 0,
                status: row['Status'] || row['status'] || 'PLANNED',
                start_date: row['Start Date'] || row['start_date'] || '',
                end_date: row['End Date'] || row['end_date'] || ''
              };

              if (schemeData.name && schemeData.hod_id) {
                await createScheme(schemeData);
                successCount++;
              } else {
                errorCount++;
              }
            } catch (err) {
              errorCount++;
              console.error('Error importing row:', err);
            }
          }

          alert(`Import completed!\nSuccessful: ${successCount}\nFailed: ${errorCount}`);
          fetchData();
        } catch (err) {
          console.error('Error parsing Excel:', err);
          alert('Failed to parse Excel file. Please check the format.');
        }
        setImporting(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('Error reading file:', err);
      alert('Failed to read file.');
      setImporting(false);
    }
    e.target.value = ''; // Reset file input
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        await deleteScheme(id);
        fetchData(); // Refresh the list
      } catch (err) {
        console.error('Error deleting scheme:', err);
        alert('Failed to delete scheme. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        {/* <Header title="Schemes Management" /> */}
        <div className="loading-message">Loading schemes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        {/* <Header title="Schemes Management" /> */}
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* <Header title="Schemes Management" /> */}

      <div className="table-card">
        <div className="table-header">
          <h3>All Schemes ({filteredSchemes.length}{hasActiveFilters ? ` of ${schemes.length}` : ''})</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              className={`btn ${showFilters || hasActiveFilters ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowFilters(!showFilters)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FiFilter /> Filter {hasActiveFilters && `(${[filters.schemeName, filters.hodId, filters.categoryId].filter(Boolean).length})`}
            </button>
            {hasActiveFilters && (
              <button 
                className="btn btn-secondary" 
                onClick={clearFilters}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <FiX /> Clear
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleExcelImport}
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
            />
            <button 
              className="btn btn-secondary" 
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
            >
              <FiUpload /> {importing ? 'Importing...' : 'Import Excel'}
            </button>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <FiPlus /> Add Scheme
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div style={{ 
            padding: '16px 20px', 
            backgroundColor: '#f8f9fa', 
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'flex-end'
          }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                Scheme Name
              </label>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input
                  type="text"
                  placeholder="Search scheme name..."
                  value={filters.schemeName}
                  onChange={(e) => setFilters({ ...filters, schemeName: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px 8px 34px', 
                    borderRadius: '6px', 
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                HOD
              </label>
              <select
                value={filters.hodId}
                onChange={(e) => setFilters({ ...filters, hodId: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">All HODs</option>
                {hods.map(hod => (
                  <option key={hod.id} value={hod.id}>{hod.name} - {hod.department}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                Category
              </label>
              <select
                value={filters.categoryId}
                onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Scheme Name</th>
                <th>Category</th>
                <th>HOD</th>
                <th>Total Budget</th>
                <th>Beneficiaries</th>
                {/* <th>Utilization</th> */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchemes.length > 0 ? (
                filteredSchemes.map((scheme) => {
                const utilizationAmount = scheme.budget_utilized || 0;
                return (
                  <tr key={scheme.id}>
                    <td>
                      <div>
                        <strong>{scheme.name}</strong>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {scheme.scheme_description?.substring(0, 50)}...
                        </p>
                      </div>
                    </td>
                    <td>{scheme.category_name || scheme.scheme_category || '-'}</td>
                    <td>{scheme.hod_name}</td>
                    <td>{formatCurrency(scheme.total_budget)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiUsers style={{ color: 'var(--secondary-color)' }} />
                        {scheme.scheme_benefits_person?.toLocaleString()}
                      </div>
                    </td>
                    {/* <td>
                      <span style={{ fontWeight: '600', color: utilizationAmount > 0 ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
                        {formatCurrency(utilizationAmount)}
                      </span>
                    </td> */}
                    <td>
                      <span className={`status-badge ${scheme.status === 'ACTIVE' ? 'active' : scheme.status === 'PLANNED' ? 'pending' : 'completed'}`}>
                        {scheme.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={() => handleViewScheme(scheme)} title="View Details">
                          <FiEye />
                        </button>
                        <button className="action-btn edit" onClick={() => handleOpenModal(scheme)}>
                          <FiEdit2 />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(scheme.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    {hasActiveFilters ? (
                      <div>
                        <p style={{ marginBottom: '10px' }}>No schemes found matching your filters</p>
                        <button className="btn btn-secondary" onClick={clearFilters} style={{ fontSize: '12px' }}>
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <p>No schemes available</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingScheme ? 'Edit Scheme' : 'Add New Scheme'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingScheme ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Scheme Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="scheme_description" value={formData.scheme_description} onChange={handleChange} rows="3" required />
          </div>
          <div className="form-group">
            <label>Objective *</label>
            <textarea name="scheme_objective" value={formData.scheme_objective} onChange={handleChange} rows="2" required />
          </div>
          <div className="form-group">
            <label>Benefits Description</label>
            <textarea name="scheme_benefits_desc" value={formData.scheme_benefits_desc} onChange={handleChange} rows="2" />
          </div>
          <div className="form-group">
            <label>Target Beneficiaries (Number of Persons)</label>
            <input type="number" name="scheme_benefits_person" value={formData.scheme_benefits_person} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Scheme Category {isAdmin && <button type="button" className="btn-link" onClick={() => setIsCategoryModalOpen(true)} style={{ fontSize: '12px', marginLeft: '8px' }}>+ Create New</button>}</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>HOD *</label>
            <select name="hod_id" value={formData.hod_id} onChange={handleChange} required>
              <option value="">Select HOD</option>
              {hods.map(hod => (
                <option key={hod.id} value={hod.id}>{hod.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Total Budget (₹) *</label>
            <input type="number" name="total_budget" value={formData.total_budget} onChange={handleChange} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="PLANNED">Planned</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* View Scheme Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Scheme Details"
        footer={
          <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>Close</button>
        }
      >
        {viewingScheme && (
          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>{viewingScheme.name}</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>CATEGORY</label>
              <p>{viewingScheme.scheme_category}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>DESCRIPTION</label>
              <p>{viewingScheme.scheme_description}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>OBJECTIVE</label>
              <p>{viewingScheme.scheme_objective}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>BENEFITS</label>
              <p>{viewingScheme.scheme_benefits_desc}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>TARGET BENEFICIARIES</label>
                <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                  {viewingScheme.scheme_benefits_person?.toLocaleString()} persons
                </p>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>TOTAL BUDGET</label>
                <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--accent-color)' }}>
                  {formatCurrency(viewingScheme.total_budget)}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>HOD</label>
                <p>{viewingScheme.hod_name}</p>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>STATUS</label>
                <p><span className={`status-badge ${viewingScheme.status === 'ACTIVE' ? 'active' : viewingScheme.status === 'PLANNED' ? 'pending' : 'completed'}`}>{viewingScheme.status}</span></p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>START DATE</label>
                <p>{viewingScheme.start_date}</p>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>END DATE</label>
                <p>{viewingScheme.end_date}</p>
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-color)', borderRadius: '8px' }}>
              <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>BUDGET UTILIZATION</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span>Allocated: {formatCurrency(viewingScheme.budget_allocated)}</span>
                <span>Utilized: {formatCurrency(viewingScheme.budget_utilized)}</span>
              </div>
              <div className="progress-bar" style={{ marginTop: '8px' }}>
                <div 
                  className="progress-fill green" 
                  style={{ width: `${(viewingScheme.budget_utilized / viewingScheme.budget_allocated) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Schemes;