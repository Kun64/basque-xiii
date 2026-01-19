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
        applyTranslations(content);
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

// Equipes
document.addEventListener("DOMContentLoaded", () => {
  console.log("Script équipes chargé");
  const modal = document.getElementById("equipe-modal");
  const box = document.getElementById("equipe-box");
  const content = document.getElementById("equipe-content");
  const closeBtn = document.getElementById("close-equipe");

  document.querySelectorAll("[data-equipe]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const url = btn.dataset.equipe;
      if (!url) return;

      modal.classList.remove("hidden");
      modal.classList.add("flex");
      content.innerHTML = "<p class='text-center text-gray-500'>Chargement...</p>";

      requestAnimationFrame(() => {
        box.classList.remove("scale-95", "opacity-0");
        box.classList.add("scale-100", "opacity-100");
      });

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erreur chargement");
        const html = await response.text();
        content.innerHTML = html;
        applyTranslations(content);
      } catch {
        content.innerHTML = "<p class='text-red-600 text-center'>Impossible de charger l’équipe</p>";
      }
    });
  });

  const closeModal = () => {
    box.classList.remove("scale-100", "opacity-100");
    box.classList.add("scale-95", "opacity-0");
    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }, 250);
  };

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
});

// Affiche
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-affiche");
  const modal = document.getElementById("affiche-modal");

  if (!openBtn || !modal) return;

  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".zoom-affiche");
  const modal = document.getElementById("affiche-modal");
  const modalImg = document.getElementById("affiche-modal-img");

  // Ouvrir
  if (btn) {
    modalImg.src = btn.dataset.img;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    return;
  }

  // Fermer si clic sur le fond (PAS sur l'image)
  if (modal && !modal.classList.contains("hidden")) {
    if (e.target === modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      modalImg.src = "";
    }
  }
});