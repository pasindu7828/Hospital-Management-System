// Doctors Management Script with Modal Edit, Search, Validation, and Notifications

document.addEventListener('DOMContentLoaded', function() {
  const doctorForm = document.getElementById('doctorForm');
  const doctorsTableBody = document.querySelector('#doctorsTable tbody');
  const doctorNameInput = document.getElementById('doctorName');
  const doctorSpecialtyInput = document.getElementById('doctorSpecialty');
  const doctorContactInput = document.getElementById('doctorContact');

  // Modal elements
  const editDoctorModal = new bootstrap.Modal(document.getElementById('editDoctorModal'));
  const editDoctorForm = document.getElementById('editDoctorForm');
  const editDoctorName = document.getElementById('editDoctorName');
  const editDoctorSpecialty = document.getElementById('editDoctorSpecialty');
  const editDoctorContact = document.getElementById('editDoctorContact');
  let editIndex = null;

  // Add search box
  let searchBox = document.getElementById('doctorSearchBox');
  if (!searchBox) {
    searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.className = 'form-control mb-3';
    searchBox.placeholder = 'Search doctors...';
    searchBox.id = 'doctorSearchBox';
    doctorForm.parentNode.insertBefore(searchBox, doctorForm);
  }

  // Notification helper
  function showAlert(message, type = 'success') {
    let alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = 2000;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      if (alertDiv) alertDiv.remove();
    }, 2000);
  }

  function getDoctors() {
    return JSON.parse(localStorage.getItem('doctors') || '[]');
  }

  function saveDoctors(doctors) {
    localStorage.setItem('doctors', JSON.stringify(doctors));
  }

  function renderDoctors(filter = '') {
    const doctors = getDoctors();
    doctorsTableBody.innerHTML = '';
    doctors.forEach((doctor, index) => {
      if (
        filter &&
        !(
          doctor.name.toLowerCase().includes(filter) ||
          doctor.specialty.toLowerCase().includes(filter) ||
          doctor.contact.toLowerCase().includes(filter)
        )
      ) {
        return;
      }
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${doctor.name}</td>
        <td>${doctor.specialty}</td>
        <td>${doctor.contact}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1" data-action="edit" data-index="${index}">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete" data-index="${index}">Delete</button>
        </td>
      `;
      doctorsTableBody.appendChild(row);
    });
  }

  doctorForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = doctorNameInput.value.trim();
    const specialty = doctorSpecialtyInput.value.trim();
    const contact = doctorContactInput.value.trim();
    // Validation
    if (!name || !specialty || !contact) {
      alert('All fields are required.');
      return;
    }
    const doctors = getDoctors();
    doctors.push({ name, specialty, contact });
    saveDoctors(doctors);
    renderDoctors(searchBox.value.trim().toLowerCase());
    doctorForm.reset();
    showAlert('Doctor added successfully!');
  });

  doctorsTableBody.addEventListener('click', function(e) {
    const action = e.target.getAttribute('data-action');
    const index = e.target.getAttribute('data-index');
    if (action === 'delete') {
      if (confirm('Are you sure you want to delete this doctor?')) {
        const doctors = getDoctors();
        doctors.splice(index, 1);
        saveDoctors(doctors);
        renderDoctors(searchBox.value.trim().toLowerCase());
        showAlert('Doctor deleted successfully!', 'success');
      }
    } else if (action === 'edit') {
      const doctors = getDoctors();
      const doctor = doctors[index];
      editDoctorName.value = doctor.name;
      editDoctorSpecialty.value = doctor.specialty;
      editDoctorContact.value = doctor.contact;
      editIndex = Number(index);
      editDoctorModal.show();
    }
  });

  editDoctorForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = editDoctorName.value.trim();
    const specialty = editDoctorSpecialty.value.trim();
    const contact = editDoctorContact.value.trim();
    // Validation
    if (!name || !specialty || !contact) {
      alert('All fields are required.');
      return;
    }
    const doctors = getDoctors();
    if (editIndex !== null) {
      doctors[editIndex] = { name, specialty, contact };
      saveDoctors(doctors);
      renderDoctors(searchBox.value.trim().toLowerCase());
      editIndex = null;
      editDoctorModal.hide();
      showAlert('Doctor updated successfully!', 'success');
    }
  });

  searchBox.addEventListener('input', function() {
    renderDoctors(searchBox.value.trim().toLowerCase());
  });

  renderDoctors();
}); 