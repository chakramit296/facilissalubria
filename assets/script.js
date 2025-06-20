//script.js file
// HTML include logic
function includeHTML() {
  const elements = document.querySelectorAll("[include-html]");
  elements.forEach((el) => {
    const file = el.getAttribute("include-html");
    if (file) {
      fetch(file)
        .then((res) => {
          if (!res.ok) throw new Error("File not found: " + file);
          return res.text();
        })
        .then((data) => {
          el.innerHTML = data;
          el.removeAttribute("include-html");
          includeHTML(); // recursively include nested includes if any
          initPageScripts(); // re-initialize after each include
        })
        .catch((err) => {
          el.innerHTML = "Include failed.";
          console.error(err);
        });
    }
  });
}

// Initialization logic
function initPageScripts() {
  // Header scroll transparency
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      const opacity = Math.min(window.scrollY / 300, 1);
      header.style.background = `rgba(255, 255, 255, ${opacity})`;
    });
  }

  // Form validation
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.querySelector("input[name='name']").value.trim();
      const email = form.querySelector("input[name='email']").value.trim();
      const message = form
        .querySelector("textarea[name='message']")
        .value.trim();

      if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
      }

      alert(
        "Thank you for contacting us, " +
          name +
          "! We will get back to you soon."
      );
      form.reset();
    });
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  includeHTML();
});
