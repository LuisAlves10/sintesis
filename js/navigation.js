const interactiveSelector = "button, a, input, textarea, select, [contenteditable='true']";

export function setupNavigation(machine) {
  const previousButton = document.getElementById("previousButton");
  const nextButton = document.getElementById("nextButton");
  const fullscreenButton = document.getElementById("fullscreenButton");
  const notesButton = document.getElementById("notesButton");
  const closeNotesButton = document.getElementById("closeNotesButton");
  const notesDrawer = document.getElementById("notesDrawer");
  let touchStart = null;

  const setNotesOpen = (open) => {
    notesDrawer.classList.toggle("is-open", open);
    notesDrawer.setAttribute("aria-hidden", String(!open));
    notesDrawer.inert = !open;
    notesButton.setAttribute("aria-pressed", String(open));
    if (open) closeNotesButton.focus({ preventScroll: true });
    else if (notesDrawer.contains(document.activeElement)) notesButton.focus({ preventScroll: true });
  };

  const toggleNotes = () => setNotesOpen(!notesDrawer.classList.contains("is-open"));

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else document.body.classList.toggle("presenting");
    } catch {
      document.body.classList.toggle("presenting");
    }
  };

  previousButton.addEventListener("click", () => machine.back());
  nextButton.addEventListener("click", () => machine.advance());
  fullscreenButton.addEventListener("click", toggleFullscreen);
  notesButton.addEventListener("click", toggleNotes);
  closeNotesButton.addEventListener("click", () => setNotesOpen(false));

  document.querySelectorAll("[data-slide-target]").forEach((button) => {
    button.addEventListener("click", () => machine.goTo(Number(button.dataset.slideTarget), 0));
  });

  document.querySelectorAll("[data-influence-state]").forEach((button) => {
    button.addEventListener("click", () => machine.setState(Number(button.dataset.influenceState)));
  });

  document.addEventListener("fullscreenchange", () => {
    const active = Boolean(document.fullscreenElement);
    document.body.classList.toggle("presenting", active);
    fullscreenButton.textContent = active ? "SALIR" : "PRESENTAR";
  });

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
    if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    const targetIsInteractive = event.target instanceof Element && event.target.closest(interactiveSelector);
    if (targetIsInteractive && ["Enter", " "].includes(event.key)) return;

    if (["ArrowRight", " ", "Enter", "PageDown"].includes(event.key)) {
      event.preventDefault();
      machine.advance();
    } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
      event.preventDefault();
      machine.back();
    } else if (event.key === "Home") {
      event.preventDefault();
      machine.goTo(0, 0);
    } else if (event.key === "End") {
      event.preventDefault();
      machine.goTo(machine.slides.length - 1, 0);
    } else if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      toggleFullscreen();
    } else if (event.key.toLowerCase() === "n") {
      event.preventDefault();
      toggleNotes();
    } else if (event.key === "Escape") {
      setNotesOpen(false);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else document.body.classList.remove("presenting");
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest(".deck")) return;
    if (event.pointerType === "mouse" || (event.target instanceof Element && event.target.closest(interactiveSelector))) return;
    touchStart = { x: event.clientX, y: event.clientY, time: performance.now() };
  }, { passive: true });

  document.addEventListener("pointerup", (event) => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    const quickEnough = performance.now() - touchStart.time < 900;
    if (quickEnough && Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.35) {
      if (dx < 0) machine.advance();
      else machine.back();
    }
    touchStart = null;
  }, { passive: true });
  document.addEventListener("pointercancel", () => { touchStart = null; }, { passive: true });

}
