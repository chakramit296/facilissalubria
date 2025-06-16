// ------------------ DOM Ready ------------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointmentForm");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const dateTimeInput = document.getElementById("datetime");

  if (form) {
    form.addEventListener("submit", handleSubmit);
  }

  if (nameInput) {
    nameInput.addEventListener("input", () => {
      nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, "");
      document.getElementById("nameFeedback").textContent = "";
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("beforeinput", (e) => {
      const char = e.data;
      const current = phoneInput.value;
      const selectionStart = phoneInput.selectionStart;
      const nextValue =
        current.slice(0, selectionStart) + char + current.slice(selectionStart);

      // Allow deletion and nav keys
      if (!char) return;

      // Reject non-digit characters
      if (!/^\d$/.test(char)) {
        e.preventDefault();
        return;
      }

      // Limit length to 10 digits
      if (nextValue.length > 10) {
        e.preventDefault();
        return;
      }

      // Block if first digit is not 6–9
      if (nextValue.length === 1 && !/^[6-9]$/.test(char)) {
        e.preventDefault();
        const feedback = document.getElementById("phoneFeedback");
        feedback.textContent = "Number must start with 6, 7, 8, or 9.";
        return;
      }

      // Clear feedback
      document.getElementById("phoneFeedback").textContent = "";
    });

    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
    });
  }

  if (dateTimeInput) {
    // Set minimum datetime to now
    function setMinDateTime() {
      const now = new Date();
      now.setSeconds(0, 0); // remove seconds and ms
      const minDateTime = now.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:MM'
      dateTimeInput.min = minDateTime;
    }

    setMinDateTime();
    setInterval(setMinDateTime, 60000); // refresh every minute

    dateTimeInput.addEventListener("blur", () => {
      const selected = new Date(dateTimeInput.value);
      const now = new Date();
      const feedback = document.getElementById("datetimeFeedback");
      if (selected <= now) {
        feedback.textContent = "Select a future date and time.";
        dateTimeInput.value = "";
      } else {
        feedback.textContent = "";
      }
    });
  }

  // Initialize
  loadAppointments();
  loadConfirmation();
});

// ------------------ Submit Handler ------------------
function handleSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const datetime = document.getElementById("datetime").value.trim();
  const service = document.getElementById("service").value.trim();

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    showError("nameFeedback", "Enter a valid name.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    showError(
      "phoneFeedback",
      "Enter a valid 10-digit mobile number starting with 6-9."
    );
    return;
  }

  if (!/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    showError("emailFeedback", "Enter a valid email address.");
    return;
  }

  if (!datetime || new Date(datetime) <= new Date()) {
    showError("datetimeFeedback", "Select a future date and time.");
    return;
  }

  if (!service) {
    alert("Please select a service.");
    return;
  }

  const appointment = { name, email, phone, datetime, service };

  const allAppointments =
    JSON.parse(localStorage.getItem("appointments")) || [];
  allAppointments.push(appointment);
  localStorage.setItem("appointments", JSON.stringify(allAppointments));
  localStorage.setItem("currentAppointment", JSON.stringify(appointment));

  window.location.href = "confirmation.html";
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = message;
    el.style.color = "red";
  }
}

// ------------------ Load Appointments on Home Page ------------------
function loadAppointments() {
  const listDiv = document.getElementById("appointmentList");
  if (!listDiv) return;

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  if (appointments.length === 0) {
    listDiv.innerHTML = "<p>No previous appointments.</p>";
    return;
  }

  listDiv.innerHTML =
    "<h3>Previous Appointments</h3>" +
    appointments
      .map(
        (app) => `
        <div class="appointment-item">
          <strong>${app.name}</strong><br>
          ${app.service} on ${new Date(app.datetime).toLocaleString()}<br>
          📞 ${app.phone} | ✉️ ${app.email}
        </div>`
      )
      .join("");
}

// ------------------ Load Confirmation Data ------------------
function loadConfirmation() {
  const data = JSON.parse(localStorage.getItem("currentAppointment"));
  if (!data) return;

  const map = {
    userName: data.name,
    "c-name": data.name,
    "c-email": data.email,
    "c-phone": data.phone,
    "c-datetime": new Date(data.datetime).toLocaleString(),
    "c-service": data.service,
  };

  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

// --- Dark Mode Toggle ---
const toggleBtn = document.getElementById("toggle-mode");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const icon = toggleBtn.querySelector("i");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
});
