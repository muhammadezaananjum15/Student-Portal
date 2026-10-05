import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    studentId: "",
    studentName: "",
    studentAge: "",
    studentDepartment: "",
    image: null,
  });

  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await fetch("http://localhost:5000/api/students");
    const data = await res.json();
    setStudents(data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files[0]) {
      setForm({ ...form, image: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const formData = new FormData();
    formData.append("studentId", form.studentId);
    formData.append("studentName", form.studentName);
    formData.append("studentAge", form.studentAge);
    formData.append("studentDepartment", form.studentDepartment);

    if (form.image) {
      formData.append("image", form.image);
    }

    if (isEditing) {
      await fetch(`http://localhost:5000/api/students/${editingId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      await fetch("http://localhost:5000/api/students", {
        method: "POST",
        body: formData,
      });
    }

    setForm({
 studentId: "",
    studentName: "",
    studentAge: "",
    studentDepartment: "",
    image: null,
    });

    setPreviewImage(null);
    setIsEditing(false);
    setEditingId(null);

    fetchStudents();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });

    fetchStudents();
  };

  const handleEdit = (student) => {
    setForm({
      studentId: student.studentId,
      studentName: student.studentName,
      studentAge: student.studentAge,
      studentDepartment: student.studentDepartment,
      image: null,
    });

    setPreviewImage(
      `http://localhost:5000/uploads/${student.image}`
    );

    setEditingId(student._id);
    setIsEditing(true);
  };

 return (
    <div className="student-portal">
      <div className="portal-header text-center py-5">
        <h1 className="portal-title">🎓 Student Portal</h1>
        <p className="portal-subtitle">Manage student records with ease</p>
      </div>

      <div className="container pb-5">
        <form onSubmit={handleSubmit} className="student-form card p-4 mb-5 shadow-lg">
          <h4 className="form-heading mb-4">
            {isEditing ? "Update Student" : "Add New Student"}
          </h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Student ID</label>
              <input
                type="text"
                name="studentId"
                className="form-control custom-input"
                placeholder="e.g. STD-001"
                value={form.studentId}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Student Name</label>
              <input
                type="text"
                name="studentName"
                className="form-control custom-input"
                placeholder="Full Name"
                value={form.studentName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Age</label>
              <input
                type="date"
                name="studentAge"
                className="form-control custom-input"
                placeholder="Age"
                value={form.studentAge}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="studentDepartment"
                className="form-control custom-input"
                placeholder="e.g. Computer Science"
                value={form.studentDepartment}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Student Photo</label>
              <input
                type="file"
                name="image"
                className="form-control custom-input"
                onChange={handleChange}
                accept="image/*"
              />
            </div>

            {previewImage && (
              <div className="col-md-6 mb-3 d-flex align-items-end">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="img-thumbnail preview-img"
                />
              </div>
            )}
          </div>

          <button className="btn btn-submit mt-2">
            {isEditing ? "Update Student" : "Add Student"}
          </button>
        </form>

        <h3 className="section-title mb-4">All Students</h3>

        <div className="row">
          {students.length === 0 && (
            <p className="text-muted text-center">No students added yet.</p>
          )}

          {students.map((student) => (
            <div className="col-md-4 mb-4" key={student._id}>
              <div className="student-card card shadow-sm h-100">
                <img
                  src={
                    student.image
                      ? `http://localhost:5000/uploads/${student.image}`
                      : "https://via.placeholder.com/300x220?text=No+Image"
                  }
                  alt={student.studentName}
                  className="card-img-top student-img"
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="student-name">{student.studentName}</h5>

                  <p className="mb-1">
                    <span className="badge-label">ID:</span> {student.studentId}
                  </p>
                  <p className="mb-1">
                    <span className="badge-label">Age:</span> {student.studentAge}
                  </p>
                  <p className="mb-3">
                    <span className="badge-label">Department:</span>{" "}
                    {student.studentDepartment}
                  </p>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-edit flex-fill"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete flex-fill"
                      onClick={() => handleDelete(student._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;