const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT a.*, s.name as staff_name, s.employee_id, h.name as hod_name 
      FROM attendance a 
      LEFT JOIN staff s ON a.staff_id = s.id 
      LEFT JOIN hods h ON a.hod_id = h.id 
      ORDER BY a.date DESC
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance by date range
router.get('/range', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const [results] = await db.query(`
      SELECT a.*, s.name as staff_name, s.employee_id, h.name as hod_name 
      FROM attendance a 
      LEFT JOIN staff s ON a.staff_id = s.id 
      LEFT JOIN hods h ON a.hod_id = h.id 
      WHERE a.date BETWEEN ? AND ?
      ORDER BY a.date DESC
    `, [start_date, end_date]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance by HOD
router.get('/hod/:hodId', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT a.*, s.name as staff_name, s.employee_id 
      FROM attendance a 
      LEFT JOIN staff s ON a.staff_id = s.id 
      WHERE a.hod_id = ?
      ORDER BY a.date DESC
    `, [req.params.hodId]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance summary by HOD
router.get('/summary/by-hod', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        h.id as hod_id,
        h.name as hod_name,
        h.department,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN a.status = 'half_day' THEN 1 END) as half_day_count,
        COUNT(CASE WHEN a.status = 'leave' THEN 1 END) as leave_count,
        COUNT(a.id) as total_records
      FROM hods h
      LEFT JOIN attendance a ON h.id = a.hod_id
      GROUP BY h.id, h.name, h.department
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create attendance record
router.post('/', async (req, res) => {
  try {
    const { staff_id, hod_id, date, status, check_in, check_out, remarks } = req.body;
    const [result] = await db.query(
      'INSERT INTO attendance (staff_id, hod_id, date, status, check_in, check_out, remarks) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [staff_id, hod_id, date, status || 'present', check_in, check_out, remarks]
    );
    res.status(201).json({ id: result.insertId, message: 'Attendance recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update attendance record
router.put('/:id', async (req, res) => {
  try {
    const { staff_id, hod_id, date, status, check_in, check_out, remarks } = req.body;
    await db.query(
      'UPDATE attendance SET staff_id = ?, hod_id = ?, date = ?, status = ?, check_in = ?, check_out = ?, remarks = ? WHERE id = ?',
      [staff_id, hod_id, date, status, check_in, check_out, remarks, req.params.id]
    );
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM attendance WHERE id = ?', [req.params.id]);
    res.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
