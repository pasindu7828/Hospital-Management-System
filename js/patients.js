// Patients Management Script with Modal Edit, Search, Validation, and Notifications

document.addEventListener('DOMContentLoaded', function() {
  const patientForm = document.getElementById('patientForm');
  const patientsTableBody = document.querySelector('#patientsTable tbody');
  const patientNameInput = document.getElementById('patientName');
  const patientAgeInput = document.getElementById('patientAge');
  const patientDiseaseInput = document.getElementById('patientDisease');

  // Modal elements
  const editPatientModal = new bootstrap.Modal(document.getElementById('editPatientModal'));
  const editPatientForm = document.getElementById('editPatientForm');
  const editPatientName = document.getElementById('editPatientName');
  const editPatientAge = document.getElementById('editPatientAge');
  const editPatientDisease = document.getElementById('editPatientDisease');
  let editIndex = null;

  // Add search box
  let searchBox = document.getElementById('patientSearchBox');
  if (!searchBox) {
    searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.className = 'form-control mb-3';
    searchBox.placeholder = 'Search patients...';
    searchBox.id = 'patientSearchBox';
    patientForm.parentNode.insertBefore(searchBox, patientForm);
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

  function getPatients() {
    return JSON.parse(localStorage.getItem('patients') || '[]');
  }

  function savePatients(patients) {
    localStorage.setItem('patients', JSON.stringify(patients));
  }

  function renderPatients(filter = '') {
    const patients = getPatients();
    patientsTableBody.innerHTML = '';
    patients.forEach((patient, index) => {
      if (
        filter &&
        !(
          patient.name.toLowerCase().includes(filter) ||
          patient.age.toString().includes(filter) ||
          patient.disease.toLowerCase().includes(filter)
        )
      ) {
        return;
      }
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${patient.name}</td>
        <td>${patient.age}</td>
        <td>${patient.disease}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1" data-action="edit" data-index="${index}">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete" data-index="${index}">Delete</button>
        </td>
      `;
      patientsTableBody.appendChild(row);
    });
  }

  patientForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = patientNameInput.value.trim();
    const age = patientAgeInput.value.trim();
    const disease = patientDiseaseInput.value.trim();
    // Validation
    if (!name || !age || !disease) {
      alert('All fields are required.');
      return;
    }
    if (isNaN(age) || Number(age) <= 0) {
      alert('Age must be a positive number.');
      return;
    }
    const patients = getPatients();
    patients.push({ name, age, disease });
    savePatients(patients);
    renderPatients(searchBox.value.trim().toLowerCase());
    patientForm.reset();
    showAlert('Patient added successfully!');
  });

  patientsTableBody.addEventListener('click', function(e) {
    const action = e.target.getAttribute('data-action');
    const index = e.target.getAttribute('data-index');
    if (action === 'delete') {
      if (confirm('Are you sure you want to delete this patient?')) {
        const patients = getPatients();
        patients.splice(index, 1);
        savePatients(patients);
        renderPatients(searchBox.value.trim().toLowerCase());
        showAlert('Patient deleted successfully!', 'success');
      }
    } else if (action === 'edit') {
      const patients = getPatients();
      const patient = patients[index];
      editPatientName.value = patient.name;
      editPatientAge.value = patient.age;
      editPatientDisease.value = patient.disease;
      editIndex = Number(index);
      editPatientModal.show();
    }
  });

  editPatientForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = editPatientName.value.trim();
    const age = editPatientAge.value.trim();
    const disease = editPatientDisease.value.trim();
    // Validation
    if (!name || !age || !disease) {
      alert('All fields are required.');
      return;
    }
    if (isNaN(age) || Number(age) <= 0) {
      alert('Age must be a positive number.');
      return;
    }
    const patients = getPatients();
    if (editIndex !== null) {
      patients[editIndex] = { name, age, disease };
      savePatients(patients);
      renderPatients(searchBox.value.trim().toLowerCase());
      editIndex = null;
      editPatientModal.hide();
      showAlert('Patient updated successfully!', 'success');
    }
  });

  searchBox.addEventListener('input', function() {
    renderPatients(searchBox.value.trim().toLowerCase());
  });

  renderPatients();
}); 