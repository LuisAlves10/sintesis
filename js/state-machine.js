export class DeckStateMachine extends EventTarget {
  constructor(slides) {
    super();
    this.slides = Array.from(slides);
    this.index = 0;
    this.locked = false;
    this.slides.forEach((slide, index) => {
      slide.dataset.state = "0";
      slide.inert = index !== 0;
      if (index === 0) slide.removeAttribute("aria-hidden");
      else slide.setAttribute("aria-hidden", "true");
      slide.querySelectorAll("[data-show-from]").forEach((element) => {
        element.setAttribute("aria-hidden", "true");
      });
    });
    this.render();
  }

  get currentSlide() { return this.slides[this.index]; }
  get state() { return Number(this.currentSlide.dataset.state || 0); }
  get maxState() { return Number(this.currentSlide.dataset.maxState || 0); }

  setState(nextState, announce = true) {
    const next = Math.max(0, Math.min(this.maxState, Number(nextState) || 0));
    this.currentSlide.dataset.state = String(next);
    this.render(announce);
  }

  advance() {
    if (this.locked) return;
    if (this.state < this.maxState) {
      this.setState(this.state + 1);
      return;
    }
    if (this.index < this.slides.length - 1) this.goTo(this.index + 1, 0);
  }

  back() {
    if (this.locked) return;
    if (this.state > 0) {
      this.setState(this.state - 1);
      return;
    }
    if (this.index > 0) {
      const previous = this.slides[this.index - 1];
      this.goTo(this.index - 1, Number(previous.dataset.maxState || 0));
    }
  }

  goTo(nextIndex, nextState = 0) {
    const next = Math.max(0, Math.min(this.slides.length - 1, Number(nextIndex) || 0));
    if (next === this.index) {
      this.setState(nextState);
      return;
    }

    this.locked = true;
    const outgoing = this.currentSlide;
    const portal = (this.index === 3 && this.state === 5 && next === 4 && nextState === 0)
      || (this.index === 4 && this.state === 0 && next === 3 && nextState === 5);
    this.slides.forEach(slide => slide.classList.remove("portal-handoff"));
    if (portal) outgoing.classList.add("portal-handoff");
    outgoing.classList.remove("is-active");
    outgoing.inert = true;
    outgoing.setAttribute("aria-hidden", "true");
    this.index = next;
    const incoming = this.currentSlide;
    incoming.inert = false;
    incoming.scrollTop = 0;
    if (portal) incoming.classList.add("portal-handoff");
    incoming.dataset.state = String(Math.max(0, Math.min(Number(incoming.dataset.maxState || 0), nextState)));
    incoming.classList.add("is-active");
    incoming.removeAttribute("aria-hidden");
    this.render();
    window.setTimeout(() => { this.locked = false; }, 480);
  }

  render(announce = true) {
    const slide = this.currentSlide;
    const state = this.state;

    slide.querySelectorAll("[data-show-from]").forEach((element) => {
      const showFrom = Number(element.dataset.showFrom || 0);
      const hideFrom = element.dataset.hideFrom === undefined ? Infinity : Number(element.dataset.hideFrom);
      const visible = state >= showFrom && state < hideFrom;
      element.classList.toggle("is-visible", visible);
      element.setAttribute("aria-hidden", String(!visible));
      element.inert = !visible;
    });

    slide.querySelectorAll("[data-origin-step]").forEach((element) => {
      const visible = Number(element.dataset.originStep) === state;
      element.classList.toggle("is-current", visible);
      element.setAttribute("aria-hidden", String(!visible));
    });

    slide.querySelectorAll("[data-influence-state]").forEach((element) => {
      const selected = Number(element.dataset.influenceState) === state;
      element.classList.toggle("is-selected", selected);
      element.setAttribute("aria-pressed", String(selected));
    });

    this.dispatchEvent(new CustomEvent("deckchange", {
      detail: { index: this.index, state, maxState: this.maxState, slide, announce }
    }));
  }
}
