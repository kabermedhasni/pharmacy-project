document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Here you would typically send the form data to your server
    // For this example, we'll just show a success message

    const formData = new FormData(form);
    const name = formData.get("name");

    // Animate form submission
    form.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    form.style.opacity = "0";
    form.style.transform = "translateY(-20px)";

    setTimeout(() => {
      form.innerHTML = `<h2>Thank you, ${name}!</h2><p>Your message has been sent. We'll get back to you soon.</p>`;
      form.style.opacity = "1";
      form.style.transform = "translateY(0)";
    }, 500);
  });

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(
      ".info-item, .contact-form input, .contact-form textarea, .contact-form button"
    )
    .forEach((el) => {
      observer.observe(el);
    });
});
