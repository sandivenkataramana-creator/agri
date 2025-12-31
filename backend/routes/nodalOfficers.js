const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all nodal officers
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT n.*, s.name as scheme_name 
      FROM nodal_officers n 
      LEFT JOIN schemes s ON n.scheme_id = s.id 
      ORDER BY n.name
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nodal officer by ID
router.get('/:id', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT n.*, s.name as scheme_name 
      FROM nodal_officers n 
      LEFT JOIN schemes s ON n.scheme_id = s.id 
      WHERE n.id = ?
    `, [req.params.id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Nodal officer not found' });
    }
    res.json(results[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create nodal officer
router.post('/', async (req, res) => {
  try {
    const { name, designation, department, scheme_id, email, phone, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO nodal_officers (name, designation, department, scheme_id, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, designation, department, scheme_id, email, phone, status || 'active']
    );
    res.status(201).json({ id: result.insertId, message: 'Nodal officer created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update nodal officer
router.put('/:id', async (req, res) => {
  try {
    const { name, designation, department, scheme_id, email, phone, status } = req.body;
    await db.query(
      'UPDATE nodal_officers SET name = ?, designation = ?, department = ?, scheme_id = ?, email = ?, phone = ?, status = ? WHERE id = ?',
      [name, designation, department, scheme_id, email, phone, status, req.params.id]
    );
    res.json({ message: 'Nodal officer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete nodal officer
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM nodal_officers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Nodal officer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
