import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getAttendance, createAttendance, updateAttendance, deleteAttendance, getStaff } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    staff_id: '',
    date: '',
    status: 'present',
    check_in: '',
    check_out: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceRes, staffRes] = await Promise.all([
        getAttendance(),
        getStaff()
      ]);
      setAttendance(attendanceRes.data || []);
      setStaffList(staffRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch attendance data. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const present = attendance.filter(a => a.status === 'present').length;
  const absent = attendance.filter(a => a.status === 'absent').length;
  const halfDay = attendance.filter(a => a.status === 'half_day').length;
  const leave = attendance.filter(a => a.status === 'leave').length;

  const chartData = {
    labels: ['Present', 'Absent', 'Half Day', 'Leave'],
    datasets: [{
      label: 'Count',
      data: [present, absent, halfDay, leave],
      backgroundColor: ['#48bb78', '#e53e3e', '#ed8936', '#805ad5']
    }]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'active';
      case 'absent': return 'inactive';
      case 'half_day': return 'pending';
      case 'leave': return 'completed';
      default: return '';
    }
  };

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        staff_id: record.staff_id || '',
        date: record.date || '',
        status: record.status || 'present',
        check_in: record.check_in || '',
        check_out: record.check_out || ''
      });
    } else {
      setEditingRecord(null);
      setFormData({ staff_id: '', date: new Date().toISOString().split('T')[0], status: 'present', check_in: '', check_out: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        staff_id: Number(formData.staff_id)
      };
      
      if (editingRecord) {
        await updateAttendance(editingRecord.id, submitData);
      } else {
        await createAttendance(submitData);
      }
      fetchData(); // Refresh the list
      handleCloseModal();
    } catch (err) {
      console.error('Error saving attendance:', err);
      alert('Failed to save attendance. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await deleteAttendance(id);
        fetchData(); // Refresh the list
      } catch (err) {
        console.error('Error deleting attendance:', err);
        alert('Failed to delete attendance. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        {/* <Header title="Attendance Management" /> */}
        <div className="loading-message">Loading attendance data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        {/* <Header title="Attendance Management" /> */}
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* <Header title="Attendance Management" /> */}

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{present}</h3>
            <p>Present Today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(229, 62, 62, 0.1)', color: 'var(--danger-color)' }}>
            <FiXCircle />
          </div>
          <div className="stat-info">
            <h3>{absent}</h3>
            <p>Absent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <h3>{halfDay}</h3>
            <p>Half Day</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <h3>{leave}</h3>
            <p>On Leave</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <h3>Today's Attendance Summary</h3>
        <div className="chart-container" style={{ height: '250px' }}>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Attendance Records ({attendance.length})</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <FiPlus /> Mark Attendance
          </button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id}>
                  <td><strong>{record.employee_id}</strong></td>
                  <td>{record.staff_name}</td>
                  <td>{record.hod_name}</td>
                  <td>{record.date}</td>
                  <td>{record.check_in || '-'}</td>
                  <td>{record.check_out || '-'}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(record.status)}`}>
                      {record.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => handleOpenModal(record)}>
                        <FiEdit2 />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(record.id)}>
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
        title={editingRecord ? 'Edit Attendance' : 'Mark Attendance'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingRecord ? 'Update' : 'Save'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Staff Member</label>
            <select name="staff_id" value={formData.staff_id} onChange={handleChange} required>
              <option value="">Select Staff</option>
              {staffList.map(staff => (
                <option key={staff.id} value={staff.id}>{staff.employee_id} - {staff.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half_day">Half Day</option>
              <option value="leave">Leave</option>
            </select>
          </div>
          <div className="form-group">
            <label>Check In</label>
            <input type="time" name="check_in" value={formData.check_in} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Check Out</label>
            <input type="time" name="check_out" value={formData.check_out} onChange={handleChange} />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Attendance;
