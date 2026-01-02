const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all schemes with budget allocation
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT s.*, h.name as hod_name, h.department,
             c.name as category_name,
             COALESCE(SUM(sba.allocated_amount), 0) as budget_allocated,
             COALESCE(SUM(sba.spent_amount), 0) as budget_utilized
      FROM schemes s 
      LEFT JOIN hods h ON s.hod_id = h.id 
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN scheme_budget_allocation sba ON s.id = sba.scheme_id
      GROUP BY s.id
      ORDER BY s.name
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get scheme by ID with full details
router.get('/:id', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT s.*, h.name as hod_name, h.department 
      FROM schemes s 
      LEFT JOIN hods h ON s.hod_id = h.id 
      WHERE s.id = ?
    `, [req.params.id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    
    // Get budget allocations for this scheme
    const [budgetAllocations] = await db.query(
      'SELECT * FROM scheme_budget_allocation WHERE scheme_id = ?',
      [req.params.id]
    );
    
    res.json({ ...results[0], budget_allocations: budgetAllocations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get schemes by HOD
router.get('/hod/:hodId', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT s.*, 
             COALESCE(SUM(sba.allocated_amount), 0) as budget_allocated,
             COALESCE(SUM(sba.spent_amount), 0) as budget_utilized
      FROM schemes s 
      LEFT JOIN scheme_budget_allocation sba ON s.id = sba.scheme_id
      WHERE s.hod_id = ?
      GROUP BY s.id
    `, [req.params.hodId]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create scheme
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      hod_id,
      category_id,
      scheme_description, 
      scheme_objective, 
      scheme_benefits_desc, 
      scheme_benefits_person,
      total_budget, 
      start_date, 
      end_date, 
      status, 
      scheme_category 
    } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO schemes (name, hod_id, category_id, scheme_description, scheme_objective, scheme_benefits_desc, 
       scheme_benefits_person, total_budget, start_date, end_date, status, scheme_category) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, hod_id, category_id || null, scheme_description, scheme_objective, scheme_benefits_desc, 
       scheme_benefits_person || 0, total_budget || 0, start_date, end_date, status || 'PLANNED', scheme_category]
    );
    res.status(201).json({ id: result.insertId, message: 'Scheme created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update scheme
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, 
      hod_id,
      category_id,
      scheme_description, 
      scheme_objective, 
      scheme_benefits_desc, 
      scheme_benefits_person,
      total_budget, 
      start_date, 
      end_date, 
      status, 
      scheme_category 
    } = req.body;
    
    await db.query(
      `UPDATE schemes SET name = ?, hod_id = ?, category_id = ?, scheme_description = ?, scheme_objective = ?, 
       scheme_benefits_desc = ?, scheme_benefits_person = ?, total_budget = ?, start_date = ?, 
       end_date = ?, status = ?, scheme_category = ? WHERE id = ?`,
      [name, hod_id, category_id || null, scheme_description, scheme_objective, scheme_benefits_desc, 
       scheme_benefits_person, total_budget, start_date, end_date, status, scheme_category, req.params.id]
    );
    res.json({ message: 'Scheme updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete scheme
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM schemes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Scheme deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SCHEME BUDGET ALLOCATION ROUTES ============

// Get all budget allocations
router.get('/budget-allocations/all', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT sba.*, s.name as scheme_name, s.scheme_category
      FROM scheme_budget_allocation sba
      LEFT JOIN schemes s ON sba.scheme_id = s.id
      ORDER BY sba.created_at DESC
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get budget allocations for a specific scheme
router.get('/:schemeId/budget-allocations', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT * FROM scheme_budget_allocation WHERE scheme_id = ?',
      [req.params.schemeId]
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create budget allocation
router.post('/:schemeId/budget-allocations', async (req, res) => {
  try {
    const { hod_id, hod_name, allocated_amount, spent_amount, financial_year } = req.body;
    const [result] = await db.query(
      `INSERT INTO scheme_budget_allocation (scheme_id, hod_id, hod_name, allocated_amount, spent_amount, financial_year) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.params.schemeId, hod_id, hod_name, allocated_amount || 0, spent_amount || 0, financial_year]
    );
    res.status(201).json({ id: result.insertId, message: 'Budget allocation created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update budget allocation
router.put('/budget-allocations/:id', async (req, res) => {
  try {
    const { hod_id, hod_name, allocated_amount, spent_amount, financial_year } = req.body;
    await db.query(
      `UPDATE scheme_budget_allocation SET hod_id = ?, hod_name = ?, allocated_amount = ?, 
       spent_amount = ?, financial_year = ? WHERE id = ?`,
      [hod_id, hod_name, allocated_amount, spent_amount, financial_year, req.params.id]
    );
    res.json({ message: 'Budget allocation updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete budget allocation
router.delete('/budget-allocations/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM scheme_budget_allocation WHERE id = ?', [req.params.id]);
    res.json({ message: 'Budget allocation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
