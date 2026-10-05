const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  studentAge: Date,
  studentDepartment: String,
  image: String
});

module.exports = mongoose.model('Student', studentSchema);