// Appointments Management Script with Modal Edit, Search, Validation, and Notifications

document.addEventListener('DOMContentLoaded', function() {
  const appointmentForm = document.getElementById('appointmentForm');
  const appointmentsTableBody = document.querySelector('#appointmentsTable tbody');
  const appointmentPatientInput = document.getElementById('appointmentPatient');
  const appointmentDoctorInput = document.getElementById('appointmentDoctor');
  const appointmentDateInput = document.getElementById('appointmentDate');

  // Modal elements
  const editAppointmentModal = new bootstrap.Modal(document.getElementById('editAppointmentModal'));
  const editAppointmentForm = document.getElementById('editAppointmentForm');
  const editAppointmentPatient = document.getElementById('editAppointmentPatient');
  const editAppointmentDoctor = document.getElementById('editAppointmentDoctor');
  const editAppointmentDate = document.getElementById('editAppointmentDate');
  let editIndex = null;

  // Add search box
  let searchBox = document.getElementById('appointmentSearchBox');
  if (!searchBox) {
    searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.className = 'form-control mb-3';
    searchBox.placeholder = 'Search appointments...';
    searchBox.id = 'appointmentSearchBox';
    appointmentForm.parentNode.insertBefore(searchBox, appointmentForm);
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

  function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
  }

  function saveAppointments(appointments) {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }

  function renderAppointments(filter = '') {
    const appointments = getAppointments();
    appointmentsTableBody.innerHTML = '';
    appointments.forEach((appointment, index) => {
      if (
        filter &&
        !(
          appointment.patient.toLowerCase().includes(filter) ||
          appointment.doctor.toLowerCase().includes(filter) ||
          appointment.date.toLowerCase().includes(filter)
        )
      ) {
        return;
      }
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${appointment.patient}</td>
        <td>${appointment.doctor}</td>
        <td>${appointment.date}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1" data-action="edit" data-index="${index}">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete" data-index="${index}">Delete</button>
        </td>
      `;
      appointmentsTableBody.appendChild(row);
    });
  }

  appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const patient = appointmentPatientInput.value.trim();
    const doctor = appointmentDoctorInput.value.trim();
    const date = appointmentDateInput.value;
    // Validation
    if (!patient || !doctor || !date) {
      alert('All fields are required.');
      return;
    }
    const appointments = getAppointments();
    appointments.push({ patient, doctor, date });
    saveAppointments(appointments);
    renderAppointments(searchBox.value.trim().toLowerCase());
    appointmentForm.reset();
    showAlert('Appointment added successfully!');
  });

  appointmentsTableBody.addEventListener('click', function(e) {
    const action = e.target.getAttribute('data-action');
    const index = e.target.getAttribute('data-index');
    if (action === 'delete') {
      if (confirm('Are you sure you want to delete this appointment?')) {
        const appointments = getAppointments();
        appointments.splice(index, 1);
        saveAppointments(appointments);
        renderAppointments(searchBox.value.trim().toLowerCase());
        showAlert('Appointment deleted successfully!', 'success');
      }
    } else if (action === 'edit') {
      const appointments = getAppointments();
      const appointment = appointments[index];
      editAppointmentPatient.value = appointment.patient;
      editAppointmentDoctor.value = appointment.doctor;
      editAppointmentDate.value = appointment.date;
      editIndex = Number(index);
      editAppointmentModal.show();
    }
  });

  editAppointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const patient = editAppointmentPatient.value.trim();
    const doctor = editAppointmentDoctor.value.trim();
    const date = editAppointmentDate.value;
    // Validation
    if (!patient || !doctor || !date) {
      alert('All fields are required.');
      return;
    }
    const appointments = getAppointments();
    if (editIndex !== null) {
      appointments[editIndex] = { patient, doctor, date };
      saveAppointments(appointments);
      renderAppointments(searchBox.value.trim().toLowerCase());
      editIndex = null;
      editAppointmentModal.hide();
      showAlert('Appointment updated successfully!', 'success');
    }
  });

  searchBox.addEventListener('input', function() {
    renderAppointments(searchBox.value.trim().toLowerCase());
  });

  renderAppointments();
}); 