import { projectMapPoint } from "./map-projection.js";

const moment = (from, to, className, html) => `<div class="state-item chapter-moment ${className}" data-show-from="${from}" ${to == null ? "" : `data-hide-from="${to}"`}>${html}</div>`;
const kicker = (text) => `<p class="chapter-kicker">${text}</p>`;
const heading = (text) => `<h2 class="chapter-title">${text}</h2>`;
const caption = (text) => `<p class="chapter-caption">${text}</p>`;
const circle = (x, y, r, cls = "") => `<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>`;

const orishas = [
  ["Yemayá", "Asaramawa", "Orishas · grabación de 1997", "También aparece en Iyaoromi y Awoyó Yemayá."],
  ["Changó", "Wemilere", "Ancestros III · sesiones de 2003", "También aparece en Rezo Changó y Changó La Meta."],
  ["Ochún", "Ochihe Iwama", "Orishas · grabación de 1997", "También aparece la grafía Oshún. Iyamilé continúa este vínculo."],
  ["Oyá", "Oyá", "Ancestros · grabación de 1987", "El nombre aparece en Oyá, Oyadde y Oyá Wimiloro."],
  ["Elegguá", "Ibara Ago", "Orishas · grabación de 1997", "Una figura vinculada a caminos y comunicación. No es una figura diabólica."],
  ["Oggún", "Ogun Mariwo", "Orishas · grabación de 1997", "También aparece en Aguanileo y Aguanileó Oggún."],
  ["Ochosi", "Yaku Ma", "Orishas · grabación de 1997", "Aparece en Ancestros III y en Yakuma Kareré, del proyecto sinfónico."],
  ["Obatalá", "Eru Aye", "Orishas · grabación de 1997", "Ochanla y Orichaó Babá aparecen también en el repertorio."]
];

function rhythmChapter() {
  const names = ["CANTO", "BATÁ", "BAJO", "GUITARRA", "BATERÍA · SINTETIZADOR · CORO"];
  const waves = names.map((name, i) => `<div class="score-layer state-item" data-show-from="${i}" data-hide-from="5" style="--layer:${i}"><span>${name}</span><svg viewBox="0 0 700 48" aria-hidden="true">${i === 1 ? Array.from({length:12}, (_, n) => circle(22+n*57,24,[0,3,5,8,10].includes(n)?6:2)).join("") : `<path d="M0 24 Q35 ${i%2?4:44} 70 24 T140 24 T210 24 T280 24 T350 24 T420 24 T490 24 T560 24 T630 24 T700 24"/>`}</svg></div>`).join("");
  const beats = [0,3,5,8,10].map((n,i)=>`<i style="--beat-x:${8+n*7.6}%;--pitch:${[0,-24,13,-16,0][i]}px"></i>`).join("");
  return moment(0,5,"score-scene",`${kicker("06 · DE LA CEREMONIA AL ROCK")}${heading("Canto, batá<br><em>y rock.</em>")}<div class="layer-score">${waves}</div>${caption("Cada capa entra para mostrar cómo se relacionan los instrumentos.")}`)
    + moment(5,null,"rhythm-transfer",`${kicker("UNA IDEA DESCRITA POR EL GUITARRISTA ERNESTO BLANCO")}<div class="transfer-labels"><span>BATÁ</span><span>CÉLULA RÍTMICA</span><span>GUITARRA</span></div><div class="rhythm-lab" role="img" aria-label="Los mismos cinco acentos pasan de pulsos de percusión a una figura de guitarra"><div class="beat-guide"></div>${beats}<svg viewBox="0 0 800 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60 H60 L64 38 L69 82 L75 60 H238 L244 12 L250 65 L256 36 L264 60 H359 L366 95 L372 28 L378 60 H541 L548 15 L555 78 L561 60 H664 L671 26 L678 85 L685 60 H800"/></svg></div>${moment(5,6,"transfer-thesis",`${heading("El mismo patrón<br><em>en otro instrumento.</em>")}`)}${moment(6,null,"transfer-thesis",`${heading("La guitarra conserva<br><em>los acentos.</em>")}`)}`);
}

function orishaChapter() {
  const nodes = orishas.map(([name],i)=>`<button type="button" class="orisha-node" data-orisha="${i}" aria-pressed="false" style="--angle:${i*45-90}deg"><span>${name.toUpperCase()}</span></button>`).join("");
  return `<div class="orisha-intro">${kicker("07 · LOS ORISHAS")}${heading("Nombres presentes<br><em>en las canciones.</em>")}<p class="cultural-note">Orishas: divinidades de tradiciones de raíz yoruba.<br>En Cuba, el repertorio Lucumí tiene su propia historia.</p></div><div class="orisha-atlas"><div class="atlas-orbit" aria-hidden="true"></div><div class="atlas-core" aria-hidden="true">CANCIONES<br>Y NOMBRES</div>${nodes}</div>${moment(0,1,"atlas-introduction",`<p>Aquí relacionamos canciones<br>y nombres del repertorio.</p><small>AVANZA O ELIGE UN NOMBRE</small>`)}${moment(1,null,"orisha-detail",`<small id="orishaRecord"></small><h3 id="orishaName"></h3><p class="track-name" id="orishaTrack"></p><p id="orishaContext"></p>`)}<p class="atlas-footnote">Las grafías varían entre tradiciones y ediciones.</p>`;
}

function diasporaChapter() {
  const pair = (a,b) => `<div class="cultural-pair"><strong>${a}</strong><i aria-hidden="true">↔</i><strong>${b}</strong></div>`;
  return `<div class="diaspora-water" aria-hidden="true"><i></i><i></i><i></i></div>${kicker("08 · CUBA Y BRASIL")}<div class="shore-labels"><span>CUBA<small>REGLA DE OCHA · LUCUMÍ</small></span><span>BRASIL<small>TRADICIONES AFROBRASILEÑAS</small></span></div>`
    + moment(0,1,"diaspora-origin",`${heading("Cuba y Brasil:<br><em>historias distintas.</em>")}<p>La trata esclavista llevó personas, lenguas y memorias de África a las Américas.</p>`)
    + moment(1,2,"pair-scene",pair("Yemayá","Iemanjá"))
    + moment(2,3,"pair-scene",pair("Changó","Xangô")+pair("Ochún","Oxum"))
    + moment(3,4,"pair-scene",pair("Oyá","Iansã")+pair("Oggún","Ogum")+pair("Ochosi","Oxóssi"))
    + moment(4,null,"exu-scene",`<div class="exu-names"><strong>Elegguá<br><em>Eshú</em></strong><i aria-hidden="true">↔</i><strong>Exu</strong></div><p>En el Candomblé, Exu es un orixá. En la Umbanda, el nombre también designa entidades espirituales: no es el mismo uso.</p><b>No se asocia con el diablo.</b>`)
    + `<p class="diaspora-caution">Correspondencias históricas aproximadas. Ocha, Candomblé y Umbanda son tradiciones distintas.</p>`;
}

function familyChapter() {
  return `${kicker("09 · UNA BANDA, UNA FAMILIA")}${heading("La familia también forma<br><em>parte de la historia.</em>")}<div class="family-tree"><svg viewBox="0 0 800 380" aria-hidden="true"><path class="family-root" d="M240 65 H560"/><path class="branch-x" d="M400 65 V140 Q400 180 220 180 V235"/><path class="branch-eme" d="M400 140 Q400 180 580 180 V235"/><path class="family-return" d="M220 255 Q220 340 400 340 Q580 340 580 255"/></svg><div class="parent parent-carlos"><small>VOZ · BAJO · DIRECCIÓN</small><strong>Carlos Alfonso</strong></div><span class="family-plus">+</span><div class="parent parent-ele"><small>VOZ · TECLADOS</small><strong>Ele Valdés</strong></div><div class="family-child child-x state-item" data-show-from="1"><small>HIJO</small><strong>X Alfonso</strong><span class="state-item" data-show-from="3">compositor · productor<br>camino propio</span></div><div class="family-child child-eme state-item" data-show-from="2"><small>HIJA</small><strong>Eme Alfonso</strong><span class="state-item" data-show-from="3">cantante · compositora<br>camino propio</span></div><div class="family-reunion state-item" data-show-from="4"><small>REUNIÓN EN 2022</small><strong>Ancestros Sinfónico · 2022</strong></div></div><p class="family-caveat">La familia es parte de la historia, pero muchos otros músicos también pasaron por Síntesis.</p>`;
}

function worldChapter() {
  const places = [["EUROPA",6.91,46.43,1,0,-15,"middle"],["EE. UU.",-98,38,2,-12,0,"end"],["CANADÁ",-106,56,2,0,-15,"middle"],["MÉXICO",-102,23.5,2,-10,25,"end"],["BRASIL",-43.17,-22.91,3,13,7,"start"]];
  const [hx,hy] = projectMapPoint(-82.3666,23.1136);
  const map = `<svg class="world-map" viewBox="0 0 900 440" role="img" aria-label="Mapa mundial: circulación desde La Habana hacia Europa, Estados Unidos, Canadá, México y Brasil. Contornos Natural Earth 110m."><g class="map-graticule">${[-60,-30,0,30,60].map(lat=>`<path d="M18 ${projectMapPoint(0,lat)[1]} H882"/>`).join("")}${[-120,-60,0,60,120].map(lon=>`<path d="M${projectMapPoint(lon,0)[0]} 16 V424"/>`).join("")}</g><image class="map-land" href="./assets/images/world-natural-earth-110m.svg" width="900" height="440"/><g class="map-routes">${places.map(([name,lon,lat,s,dx,dy,anchor])=>{const [x,y]=projectMapPoint(lon,lat);return `<g class="state-item" data-show-from="${s}"><path d="M${hx} ${hy} Q${(hx+x)/2} ${Math.min(y,hy)-65} ${x} ${y}"/>${circle(x,y,4)}<text x="${x+dx}" y="${y+dy}" text-anchor="${anchor}">${name}</text></g>`;}).join("")}</g>${circle(hx,hy,5,"havana-dot")}<text class="havana-label" x="${hx+14}" y="${hy+15}">LA HABANA</text></svg>`;
  const discs = [["1978","En busca de una nueva flor","rock sinfónico"],["1987","Ancestros","grabación · EGREM"],["1997","Orishas","grabación · California"],["2022","Ancestros Sinfónico","relectura orquestal"]];
  return moment(0,4,"world-scene",`${kicker("10 · SÍNTESIS EN EL MUNDO")}${heading("Desde La Habana.")}<div class="map-wrap">${map}</div><div class="map-caption">${moment(0,1,"",`<strong>Presentaciones<br>fuera de Cuba.</strong>`)}${moment(1,2,"",`<strong>Europa</strong><span>Montreux · Nice Jazz · España</span>`)}${moment(2,3,"",`<strong>Las Américas</strong><span>Estados Unidos · Canadá · México</span>`)}${moment(3,4,"",`<strong>Brasil</strong><span>Rock in Rio III · 2001<br>Festival Internacional de la Bahía · PercPan</span>`)}</div>`)
    + moment(4,6,"discography-scene",`${kicker("DISCOS Y FECHAS CLAVE")}${heading("Cuatro discos para<br><em>ubicar la historia.</em>")}<div class="discography-strip">${discs.map(([year,name,idea],i)=>`<div class="disc-spine" style="--disc:${i}"><small>${year}</small><strong>${name}</strong><span>${idea}</span></div>`).join("")}</div>${moment(5,6,"edition-note",`<b>GRABACIÓN ≠ EDICIÓN ≠ REEDICIÓN</b><p>Ancestros: sesiones de 1987; la cronología oficial lista 1989.<br>Orishas: grabado en 1997; edición mexicana de 1998.</p>`)}`)
    + moment(6,null,"quiz-scene",`${kicker("UNA PREGUNTA SOBRE DISCOGRAFÍA")}${heading("¿Cuál NO pertenece<br>al Síntesis cubano?")}<div class="quiz-options" role="group" aria-label="Elige un disco">${["Ancestros","Conexión","Orishas"].map((x,i)=>`<button type="button" data-quiz="${i}"><small>0${i+1}</small><strong>${x}</strong></button>`).join("")}</div><p id="quizFeedback" class="quiz-feedback" role="status">Pausa para el público. Elige una respuesta.</p>${moment(7,null,"quiz-explanation",`<h3>Conexión no es del<br><em>Síntesis cubano.</em></h3><p>Es de otra banda con el mismo nombre.</p>`)}`);
}

function symphonyChapter() {
  const seats = Array.from({length:100}, (_,i)=>{const row=Math.floor(i/20); const a=Math.PI*(1.12+(i%20)/19*.76); return circle(500+Math.cos(a)*(150+row*43),355+Math.sin(a)*(150+row*43),3.5+row*.3);}).join("");
  return `${kicker("11 · ANCESTROS SINFÓNICO")}`
    + moment(0,3,"symphony-scene",`<div class="symphony-title">${heading("Ancestros con<br><em>coro y orquesta.</em>")}<p>CARLOS · ELE · X · EME</p></div><svg class="orchestra" viewBox="0 0 1000 430" role="img" aria-label="Un núcleo de cuatro artistas se amplía visualmente en coro y orquesta"><g class="orchestra-seats">${seats}</g><g class="orchestra-core">${[455,485,515,545].map(x=>circle(x,345,7)).join("")}</g><path class="orchestra-arc" d="M175 345 A325 325 0 0 1 825 345"/></svg>${moment(0,1,"symphony-caption",`<strong>2022</strong><span>Un nuevo álbum, dirigido musicalmente y producido por X Alfonso.</span>`)}${moment(1,2,"symphony-caption",`<strong>Portugal ↔ La Habana</strong><span>Asesoría general: Leo Brouwer<br>Religiones afrocubanas: Natalia Bolívar</span>`)}${moment(2,3,"symphony-caption",`<strong>Más de 100 intérpretes</strong><span>Montaje de 2023 · Coro Nacional de Cuba + Orquesta del Lyceum de La Habana</span>`)}`)
    + moment(3,4,"award-scene",`${kicker("RECONOCIMIENTO AL ÁLBUM DE 2022")}<div class="award-orbit" aria-hidden="true"><i></i><i></i><i></i></div>${heading("LATIN<br><em>GRAMMY</em>")}<strong>2022</strong><p>MEJOR ÁLBUM FOLCLÓRICO</p><span>Ancestros Sinfónico · Síntesis, X Alfonso y Eme Alfonso</span>`)
    + moment(4,null,"anniversary-scene",`<span class="anniversary-years">1976—2026</span>${heading("50")}<em class="anniversary-unit">años de Síntesis.</em><p>Carlos y Ele celebraron el aniversario en Jazz Plaza, La Habana.</p>`);
}

function finaleChapter() {
  const words = [["VOCES",14,24],["ROCK",78,21],["CANTO",23,66],["RITMO",75,68],["FAMILIA",49,12],["MEMORIA",49,82]];
  return moment(0,1,"final-question",`${kicker("12 · CIERRE")}${heading("¿Qué significa<br><em>Síntesis?</em>")}`)
    + `<div class="final-orbits" aria-hidden="true"><i></i><i></i><i></i></div><div class="final-concepts state-item" data-show-from="1" data-hide-from="3">${words.map(([name,x,y])=>`<span style="--x:${x}%;--y:${y}%">${name}</span>`).join("")}</div>`
    + moment(2,null,"final-name",`<h2>SÍNTESIS</h2><div class="final-frequency" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>`)
    + moment(3,4,"final-meaning",`<p>Con el tiempo, “Síntesis” también describió<br><em>la forma de hacer música del grupo.</em></p>`)
    + moment(4,null,"final-colophon",`<strong>1976—2026</strong><p>Gracias por escuchar.</p><small>LUIS · JOSÉ · GABRIEL · DAVI</small><a href="./fuentes.html" target="_blank" rel="noopener">Fuentes y archivo documental ↗</a>`);
}

const chapters = [
  { number: 6, speaker: "José", maxState: 6, act: "III", actTitle: "ANCESTROS", title: "De la ceremonia al rock", theme: "rhythm", build: rhythmChapter, source: "Síntesis · AM:PM / Ernesto Blanco" },
  { number: 7, speaker: "Gabriel", maxState: 5, act: "IV", actTitle: "RAÍCES Y DIÁSPORAS", title: "Los Orishas", theme: "orishas", build: orishaChapter, source: "AM:PM / Natalia Bolívar · Smithsonian" },
  { number: 8, speaker: "Gabriel", maxState: 4, act: "IV", actTitle: "RAÍCES Y DIÁSPORAS", title: "Cuba ↔ Brasil", theme: "diaspora", build: diasporaChapter, source: "Smithsonian · literatura afrodiaspórica · fuentes seleccionadas" },
  { number: 9, speaker: "Gabriel", maxState: 4, act: "V", actTitle: "EXPANSIÓN Y LEGADO", title: "Una banda, una familia", theme: "family", build: familyChapter, source: "Síntesis · AM:PM · créditos de Ancestros Sinfónico" },
  { number: 10, speaker: "Davi", maxState: 7, act: "V", actTitle: "EXPANSIÓN Y LEGADO", title: "Síntesis en el mundo", theme: "world", build: worldChapter, source: "Biografía oficial · AM:PM · fuentes discográficas" },
  { number: 11, speaker: "Davi", maxState: 4, act: "V", actTitle: "EXPANSIÓN Y LEGADO", title: "Ancestros Sinfónico y 50 años", theme: "symphony", build: symphonyChapter, source: "Recording Academy · Solar Latin Club · OnCuba / EFE" },
  { number: 12, speaker: "Davi", maxState: 4, act: "V", actTitle: "EXPANSIÓN Y LEGADO", title: "¿Qué significa Síntesis?", theme: "finale", build: finaleChapter, source: "Síntesis · Carlos Alfonso / AM:PM" }
];

function renderChapter({ number, speaker, maxState, act, actTitle, title, theme, build, source }) {
  return `<section class="slide slide-${number} chapter-slide" data-title="${title}" data-speaker="${speaker}" data-max-state="${maxState}" data-act="${act}" data-act-title="${actTitle}" aria-label="Diapositiva ${number}: ${title}; presenta ${speaker}"><div class="slide-frame chapter-frame ${theme}-frame">${build()}<div class="slide-meta"><span>${String(number).padStart(2,"0")}</span><b>${speaker.toUpperCase()}</b><small>${actTitle}</small></div><div class="source-line">Fuentes: ${source}</div></div><aside class="speaker-notes" role="note" aria-label="Notas de ${speaker}" hidden></aside></section>`;
}

export function mountChapters() {
  const deck = document.querySelector(".deck");
  deck.insertAdjacentHTML("beforeend", chapters.map(renderChapter).join(""));
  const rail = document.querySelector(".chapter-rail");
  deck.querySelector(".family-tree svg").setAttribute("preserveAspectRatio", "none");
  deck.querySelector(".orisha-detail").setAttribute("aria-live", "polite");
  rail.querySelector(".rail-future").remove();
  chapters.forEach(({number,speaker}) => rail.insertAdjacentHTML("beforeend",`<button class="rail-stop" type="button" data-slide-target="${number-1}" aria-label="Ir a la diapositiva ${number}, ${speaker}"><span>${String(number).padStart(2,"0")}</span><b>${speaker}</b></button>`));
}

export function setupChapterInteractions(machine) {
  const setOrisha = (index) => {
    const [name,track,record,context] = orishas[index];
    document.getElementById("orishaName").textContent = name;
    document.getElementById("orishaTrack").textContent = `«${track}»`;
    document.getElementById("orishaRecord").textContent = record;
    document.getElementById("orishaContext").textContent = context;
    document.querySelectorAll("[data-orisha]").forEach((button,i) => button.setAttribute("aria-pressed",String(i === index)));
  };
  document.querySelectorAll("[data-orisha]").forEach(button=>button.addEventListener("click",()=>{
    const index=Number(button.dataset.orisha);
    machine.setState(Math.min(index+1,5));
    setOrisha(index);
  }));
  document.querySelectorAll("[data-quiz]").forEach(button=>button.addEventListener("click",()=>{
    if(machine.state===7) return;
    const isCorrect=button.dataset.quiz === "1";
    if(isCorrect) machine.setState(7);
    else document.getElementById("quizFeedback").textContent="Ese disco sí pertenece al grupo cubano. Prueba otra vez.";
    button.dataset.result=isCorrect?"correct":"incorrect";
  }));
  machine.addEventListener("deckchange",({detail:{index,state}})=>{
    if(index===6) {
      if(state>0) setOrisha(state-1);
      else document.querySelectorAll("[data-orisha]").forEach(button=>button.setAttribute("aria-pressed","false"));
    }
    if(index===9) {
      document.querySelectorAll("[data-quiz]").forEach(button=>{
        button.disabled=state===7;
        button.dataset.result=state===7 && button.dataset.quiz==="1"?"correct":"";
      });
      document.getElementById("quizFeedback").textContent=state===7?"Respuesta: Conexión. El nombre del artista puede engañar.":"Pausa para el público. Elige una respuesta.";
    }
  });
}
