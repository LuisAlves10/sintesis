export function setupAtmosphere(machine) {
  const canvas = document.getElementById("atmosphere");
  const context = canvas.getContext("2d", { alpha: true });
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionPreference.matches;
  let width = 0;
  let height = 0;
  let dust = [];
  let running = true;
  let frameId = 0;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(18, Math.min(46, Math.floor((width * height) / 36000)));
    dust = Array.from({ length: count }, (_, index) => ({
      x: (index * 137.5) % width,
      y: (index * 91.7) % height,
      radius: .4 + (index % 4) * .3,
      speed: .04 + (index % 5) * .012,
      phase: index * .83
    }));
  };

  const drawAnalog = (time, opacity = 1) => {
    context.save();
    context.globalAlpha = opacity;
    context.strokeStyle = "rgba(233,223,202,.035)";
    context.lineWidth = 1;
    for (let row = 0; row < 3; row += 1) {
      const y = height * (.24 + row * .25) + Math.sin(time * .00035 + row) * 4;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y + Math.sin(time * .0002 + row) * 3);
      context.stroke();
    }
    dust.forEach((particle) => {
      particle.y = (particle.y + particle.speed + height) % height;
      const x = particle.x + Math.sin(time * .0003 + particle.phase) * 6;
      context.beginPath();
      context.arc(x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(233,223,202,${.035 + (particle.radius * .018)})`;
      context.fill();
    });
    context.restore();
  };

  const drawOrganic = (time, state) => {
    const energy = Math.max(0, (state - 2) / 3);
    for (let layer = 0; layer < 4; layer += 1) {
      context.beginPath();
      for (let x = -20; x <= width + 20; x += 24) {
        const yBase = height * (.3 + layer * .15);
        const wave = Math.sin(x * (.006 + layer * .0015) + time * (.00045 + layer * .00008)) * (8 + energy * 22 + layer * 3);
        if (x === -20) context.moveTo(x, yBase + wave);
        else context.lineTo(x, yBase + wave);
      }
      context.strokeStyle = layer % 2
        ? `rgba(217,152,63,${.035 + energy * .065})`
        : `rgba(116,43,33,${.04 + energy * .08})`;
      context.lineWidth = 1 + energy;
      context.stroke();
    }
  };

  const drawAncestors = (time, state) => {
    const energy = Math.max(.12, state / 4);
    const convergence = state / 4;
    const centerX = width * .56;
    const centerY = height * .5;
    const baseRadius = Math.min(width, height) * .08;

    context.save();
    context.globalCompositeOperation = "screen";

    for (let ring = 0; ring < 5; ring += 1) {
      const pulse = Math.sin(time * (.00045 + ring * .00005) + ring * 1.15) * (2 + energy * 5);
      context.beginPath();
      context.arc(centerX, centerY, baseRadius + ring * Math.min(width, height) * .07 + pulse, 0, Math.PI * 2);
      context.strokeStyle = ring % 2
        ? `rgba(91,32,42,${.035 + energy * .055})`
        : `rgba(195,157,86,${.025 + energy * .05})`;
      context.lineWidth = ring === 0 ? 1.35 : .8;
      context.stroke();
    }

    const colors = ["rgba(223,210,182,.12)", "rgba(195,157,86,.16)", "rgba(91,32,42,.18)"];
    for (let channel = 0; channel < 3; channel += 1) {
      const separateTempo = .00022 + channel * .00013;
      const tempo = separateTempo * (1 - convergence) + .00032 * convergence;
      const yBase = centerY + (channel - 1) * (42 * (1 - convergence));
      context.beginPath();
      for (let x = width * .16; x <= width * .91; x += 28) {
        const envelope = Math.sin(((x - width * .16) / (width * .75)) * Math.PI);
        const wave = Math.sin(x * (.008 + channel * .0012) + time * tempo + channel * (1 - convergence))
          * (5 + energy * 12) * envelope;
        if (x === width * .16) context.moveTo(x, yBase + wave);
        else context.lineTo(x, yBase + wave);
      }
      context.strokeStyle = colors[channel];
      context.lineWidth = 1 + energy * .45;
      context.stroke();
    }

    context.restore();
  };

  const frame = (time = 0) => {
    context.clearRect(0, 0, width, height);
    const ancestorsActive = machine.index === 4;
    drawAnalog(time, ancestorsActive ? Math.max(.14, .48 - machine.state * .085) : 1);
    if (machine.index === 3) drawOrganic(time, machine.state);
    if (ancestorsActive) drawAncestors(time, machine.state);
    if (running && !reducedMotion) frameId = window.requestAnimationFrame(frame);
  };

  window.addEventListener("resize", resize, { passive: true });
  const restart = () => {
    window.cancelAnimationFrame(frameId);
    reducedMotion = motionPreference.matches;
    running = !document.hidden;
    if (running) frame(performance.now());
  };
  document.addEventListener("visibilitychange", restart);
  motionPreference.addEventListener("change", restart);

  resize();
  if (reducedMotion) frame(0);
  else frameId = window.requestAnimationFrame(frame);
}
