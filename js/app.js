import { influenceStates, slideAnnouncements } from "./data.js";
import { DeckStateMachine } from "./state-machine.js";
import { setupNavigation } from "./navigation.js";
import { setupAtmosphere } from "./fx.js";
import { mountChapters, setupChapterInteractions } from "./chapters.js";
import { mountSpeakerNotes } from "./speaker-notes.js";

mountChapters();
mountSpeakerNotes();
const slides = document.querySelectorAll(".slide");
const machine = new DeckStateMachine(slides);
setupNavigation(machine);
setupChapterInteractions(machine);
setupAtmosphere(machine);

const slideNumber = document.getElementById("slideNumber");
const stateLabel = document.getElementById("stateLabel");
const stateProgress = document.getElementById("stateProgress");
const liveRegion = document.getElementById("liveRegion");
const notesContent = document.getElementById("notesContent");
const notesSpeaker = document.getElementById("notesSpeaker");
const nextButton = document.getElementById("nextButton");
const actNumber = document.querySelector(".act-label span");
const actTitle = document.querySelector(".act-label b");

function updateInfluence(state) {
  const content = influenceStates[state] || influenceStates[0];
  document.getElementById("influenceIndex").textContent = content.index;
  document.getElementById("influenceName").textContent = content.name;
  document.getElementById("influenceIdea").textContent = content.idea;
}

function syncInterface({ index, state, maxState, slide, announce }) {
  document.body.dataset.slide = String(index + 1);
  slideNumber.textContent = String(index + 1).padStart(2, "0");
  stateLabel.textContent = `ESTADO ${String(state).padStart(2, "0")} / ${String(maxState).padStart(2, "0")}`;
  stateProgress.max = maxState;
  stateProgress.value = state;
  nextButton.setAttribute("aria-label", state < maxState ? "Revelar el estado siguiente" : "Ir a la diapositiva siguiente");
  nextButton.disabled = index === slides.length - 1 && state === maxState;
  document.getElementById("previousButton").disabled = index === 0 && state === 0;
  if (nextButton.disabled) nextButton.setAttribute("aria-label", "Fin de la presentación");

  const currentAct = slide.dataset.act || "I";
  document.body.dataset.act = currentAct;
  actNumber.textContent = `ACTO ${currentAct}`;
  actTitle.textContent = slide.dataset.actTitle || "ANTES DE LOS ANCESTROS";

  document.querySelectorAll(".rail-stop").forEach((button, buttonIndex) => {
    const active = buttonIndex === index;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-current", active ? "step" : "false");
  });

  const notes = slide.querySelector(".speaker-notes");
  notesContent.innerHTML = notes ? notes.innerHTML : "";
  notesSpeaker.textContent = slide.dataset.speaker || "";

  if (index === 2) updateInfluence(state);
  if (announce) liveRegion.textContent = `${slideAnnouncements[index] || `${slide.dataset.title}. Presenta ${slide.dataset.speaker}.`} Estado ${state} de ${maxState}.`;
}

machine.addEventListener("deckchange", (event) => syncInterface(event.detail));
machine.render(false);
