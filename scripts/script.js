// Menu burger simple
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
burger.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

// Résumé
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("resume-modal");
  const box = document.getElementById("resume-box");
  const content = document.getElementById("resume-content");
  const closeBtn = document.getElementById("close-modal");

  // Ouvrir le pop-up
  document.querySelectorAll("[data-resume]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const url = btn.dataset.resume;
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      content.innerHTML = "<p class='text-center text-gray-500'>Chargement...</p>";

      // petite animation
      requestAnimationFrame(() => {
        box.classList.remove("scale-95", "opacity-0");
        box.classList.add("scale-100", "opacity-100");
      });

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erreur de chargement");
        const html = await response.text();
        content.innerHTML = html;
      } catch (err) {
        content.innerHTML = "<p class='text-red-600 text-center'>Impossible de charger le résumé 😕</p>";
      }
    });
  });

  // Fermer le pop-up
  function closeModal() {
    box.classList.remove("scale-100", "opacity-100");
    box.classList.add("scale-95", "opacity-0");
    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }, 250);
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
});