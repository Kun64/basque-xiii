// ============================================
// UTILITIES - Fonctions réutilisables
// ============================================

/**
 * Ouvre une modal avec animation
 * @param {HTMLElement} modal - L'élément modal principal
 * @param {HTMLElement} box - La boîte à animer
 */
function openModal(modal, box) {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  requestAnimationFrame(() => {
    box.classList.remove("scale-95", "opacity-0");
    box.classList.add("scale-100", "opacity-100");
  });
}

/**
 * Ferme une modal avec animation
 * @param {HTMLElement} modal - L'élément modal principal
 * @param {HTMLElement} box - La boîte à animer
 * @param {number} duration - Durée de l'animation (ms)
 */
function closeModal(modal, box, duration = 250) {
  box.classList.remove("scale-100", "opacity-100");
  box.classList.add("scale-95", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }, duration);
}

/**
 * Charge du contenu HTML depuis une URL et l'insère dans un conteneur
 * @param {string} url - URL du contenu
 * @param {HTMLElement} contentContainer - Élément où insérer le contenu
 * @param {string} errorMsg - Message d'erreur personnalisé
 */
async function loadContent(url, contentContainer, errorMsg) {
  contentContainer.innerHTML = "<p class='text-center text-gray-500'>Chargement...</p>";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur de chargement");
    const html = await response.text();
    contentContainer.innerHTML = html;
    applyTranslations(contentContainer);
  } catch (err) {
    contentContainer.innerHTML = `<p class='text-red-600 text-center'>${errorMsg}</p>`;
  }
}

/**
 * Initialise une modal avec contenu chargeable
 * @param {string} modalId - ID du conteneur modal
 * @param {string} boxId - ID de la boîte à animer
 * @param {string} contentId - ID du conteneur de contenu
 * @param {string} closeBtnId - ID du bouton fermer
 * @param {string} dataAttr - Attribut data des boutons (ex: "data-resume")
 * @param {string} errorMsg - Message d'erreur personnalisé
 */
function initLoadableModal(modalId, boxId, contentId, closeBtnId, dataAttr, errorMsg) {
  const modal = document.getElementById(modalId);
  const box = document.getElementById(boxId);
  const content = document.getElementById(contentId);
  const closeBtn = document.getElementById(closeBtnId);

  if (!modal || !box || !content || !closeBtn) return;

  // Ouvrir la modal via boutons avec data-*
  document.querySelectorAll(`[${dataAttr}]`).forEach(btn => {
    btn.addEventListener("click", async () => {
      const url = btn.getAttribute(dataAttr);
      if (!url) return;
      openModal(modal, box);
      await loadContent(url, content, errorMsg);
    });
  });

  // Fermer via bouton ou clic fond
  const handleCloseModal = () => closeModal(modal, box);
  closeBtn.addEventListener("click", handleCloseModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) handleCloseModal();
  });
}

// ============================================
// Menu burger
// ============================================
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
burger.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// ============================================
// MODALES CHARGABLES
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Résumés de matchs
  initLoadableModal(
    "resume-modal",
    "resume-box",
    "resume-content",
    "close-modal",
    "data-resume",
    "Impossible de charger le résumé 😕"
  );

  // Équipes
  initLoadableModal(
    "equipe-modal",
    "equipe-box",
    "equipe-content",
    "close-equipe",
    "data-equipe",
    "Impossible de charger l'équipe"
  );

  // Affiche (sans contenu à charger, juste image)
  const modal = document.getElementById("affiche-modal");
  const closeAffiBtn = document.getElementById("close-affiche");

  if (closeAffiBtn && modal) {
    const handleCloseAffiche = () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.getElementById("affiche-modal-img").src = "";
    };

    closeAffiBtn.addEventListener("click", handleCloseAffiche);
    modal.addEventListener("click", e => {
      if (e.target === modal) handleCloseAffiche();
    });
  }

  // Gestion des zoom affiches
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".zoom-affiche");
    const affiModal = document.getElementById("affiche-modal");
    const modalImg = document.getElementById("affiche-modal-img");

    if (!affiModal) return;

    // Ouvrir
    if (btn) {
      modalImg.src = btn.dataset.img;
      affiModal.classList.remove("hidden");
      affiModal.classList.add("flex");
      return;
    }

    // Fermer si clic sur le fond (PAS sur l'image)
    if (!affiModal.classList.contains("hidden")) {
      if (e.target === affiModal) {
        affiModal.classList.add("hidden");
        affiModal.classList.remove("flex");
        modalImg.src = "";
      }
    }
  });
});
