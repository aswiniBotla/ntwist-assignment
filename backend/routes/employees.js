const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Employee = require('../models/Employee');

// Create Employee
router.post('/',
    [
        body('name').not().isEmpty().withMessage('Name is required'),
        body('position').not().isEmpty().withMessage('Position is required'),
        body('department').not().isEmpty().withMessage('Department is required'),
        body('salary').isInt({ min: 0 }).withMessage('Salary must be a positive integer'),
        body('dateOfHire').isISO8601().toDate().withMessage('Date of Hire must be a valid date')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, position, department, salary, dateOfHire } = req.body;
        try {
            const newEmployee = await Employee.create({ name, position, department, salary, dateOfHire });
            res.status(201).json(newEmployee);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// Get All Employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Employee
router.put('/:id',
    [
        body('name').not().isEmpty().withMessage('Name is required'),
        body('position').not().isEmpty().withMessage('Position is required'),
        body('department').not().isEmpty().withMessage('Department is required'),
        body('salary').isInt({ min: 0 }).withMessage('Salary must be a positive integer'),
        body('dateOfHire').isISO8601().toDate().withMessage('Date of Hire must be a valid date')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, position, department, salary, dateOfHire } = req.body;
        try {
            const employee = await Employee.findByPk(req.params.id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });

            employee.name = name;
            employee.position = position;
            employee.department = department;
            employee.salary = salary;
            employee.dateOfHire = dateOfHire;
            await employee.save();

            res.status(200).json(employee);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// Delete Employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        await employee.destroy();
        res.status(204).json();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
