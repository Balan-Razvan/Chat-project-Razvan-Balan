export function initDropdowns() {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = toggle.closest(".dropdown");

      document.querySelectorAll(".dropdown.active").forEach((d) => {
        if (d !== dropdown) {
          d.classList.remove("active");
        }
      });

      dropdown.classList.toggle("active");
    });
  });
}