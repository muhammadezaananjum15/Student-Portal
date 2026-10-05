const express = require('express');
const multer = require('multer');
const Student = require('../models/Student');
const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// CREATE
router.post('/', upload.single('image'), async (req, res) => {
  const { studentId,  studentName,  studentAge,  studentDepartment } = req.body;
  const image = req.file ? req.file.filename : null;

  const newStudent = new Student({
    studentId,
  studentName,
  studentAge,
  studentDepartment,
  image
  });
 
  await newStudent.save();
  res.json(newStudent);
});

// READ
router.get('/', async (req, res) => {
  const student = await Student.find();
  res.json(student);
});

// UPDATE
router.put('/:id', upload.single('image'), async (req, res) => {
  const {  studentId,  studentName,  studentAge,  studentDepartment} = req.body;
  const image = req.file ? req.file.filename : undefined;

  const updateFields = {
     studentId,
  studentName,
  studentAge,
  studentDepartment,
  };

  if (image) {
    updateFields.image = image;
  }

  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true }
  );

  res.json(updatedStudent);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: 'Student Removed' });
});

module.exports = router;