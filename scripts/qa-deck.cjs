// playwright-cli run-code --filename scripts/qa-deck.cjs
// Uses the current page: the same suite tests localhost and GitHub Pages.
async (page) => {
  const errors = [], failures = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if(m.type()==="error") errors.push(m.text()); });
  page.on("response", r => { if(r.status()>=400) errors.push(`${r.status()} ${r.url()}`); });
  await page.reload();
  await page.waitForSelector(".slide-12", {state:"attached"});
  const slides=await page.locator(".slide").evaluateAll(es=>es.map(e=>({max:Number(e.dataset.maxState),speaker:e.dataset.speaker})));
  if(slides.length!==12) throw Error("Expected exactly 12 slides");
  const expect=async(i,s,label)=>{
    const actual=await page.locator(".slide.is-active").evaluate(e=>({i:[...e.parentElement.children].indexOf(e),s:Number(e.dataset.state)}));
    if(actual.i!==i||actual.s!==s) failures.push({label,expected:{i,s},actual});
  };
  const rail=async i=>{await page.locator(`[data-slide-target="${i}"]`).click();await page.waitForTimeout(500);};
  await page.setViewportSize({width:1366,height:768});
  await page.keyboard.press("Home");
  await page.waitForTimeout(500);
  let states=0;
  for(let i=0;i<12;i++) for(let s=0;s<=slides[i].max;s++) {
    await expect(i,s,"forward"); states++;
    if(i!==11||s!==slides[i].max) {await page.keyboard.press(["ArrowRight","Space","Enter"][s%3]);if(s===slides[i].max) await page.waitForTimeout(500);}
  }
  for(let i=11;i>=0;i--) for(let s=slides[i].max;s>=0;s--) {
    await expect(i,s,"reverse");
    if(i!==0||s!==0) {await page.keyboard.press("ArrowLeft");if(s===0) await page.waitForTimeout(500);}
  }
  if(await page.locator(".slide:not(.is-active)").evaluateAll(es=>es.some(e=>!e.inert))) failures.push("Inactive slide not inert");
  for(let i=0;i<12;i++) {
    await rail(i); await expect(i,0,"rail");
    if(await page.locator("#notesSpeaker").textContent()!==["Luis","José","Gabriel","Davi"][Math.floor(i/3)]) failures.push(`Speaker ${i+1}`);
    await page.locator("#notesButton").click();
    await page.locator("#notesDrawer").waitFor({state:"visible"});
    if(!await page.locator("#notesDrawer").isVisible()) failures.push(`Notes ${i+1}`);
    if((await page.locator("#notesContent").innerText()).length<300) failures.push(`Short notes ${i+1}`);
    await page.keyboard.press("Escape");
  }
  await page.keyboard.press("End"); await expect(11,0,"End");
  await page.keyboard.press("Home"); await page.waitForTimeout(500);
  await page.locator("#nextButton").click(); await expect(0,1,"next button");
  await page.locator("#previousButton").click(); await expect(0,0,"previous button");
  await rail(6);
  for(let i=0;i<8;i++) {
    await page.locator(`[data-orisha="${i}"]`).click();
    if(await page.locator(`[data-orisha="${i}"]`).getAttribute("aria-pressed")!=="true") failures.push(`Orisha ${i}`);
  }
  await rail(9);
  for(let i=0;i<6;i++) await page.keyboard.press("ArrowRight");
  await page.locator('[data-quiz="0"]').click(); await expect(9,6,"wrong answer");
  if(!(await page.locator("#quizFeedback").innerText()).includes("Prueba")) failures.push("Wrong feedback");
  await page.locator('[data-quiz="1"]').click(); await expect(9,7,"correct answer");
  await page.keyboard.press("ArrowLeft");
  if(await page.locator('[data-quiz="1"]').isDisabled()) failures.push("Quiz not reversible");
  await page.keyboard.press("n"); await page.keyboard.press("Escape");
  await page.locator("#fullscreenButton").click(); await page.waitForTimeout(500);
  const fullscreen=await page.evaluate(()=>({native:!!document.fullscreenElement,presenting:document.body.classList.contains("presenting")}));
  if(!fullscreen.presenting) failures.push("Presentation mode");
  await page.keyboard.press("f"); await page.waitForTimeout(400);
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.keyboard.press("Home"); await page.waitForTimeout(500);
  if(!await page.locator("#atmosphere").evaluate(e=>getComputedStyle(e).display==="none")) failures.push("Reduced motion");
  await page.keyboard.press("ArrowRight"); await expect(0,1,"reduced navigation");
  await page.emulateMedia({reducedMotion:"no-preference"});
  return {statesForward:states,statesBackward:states,railStops:12,fullscreen,errors,failures};
}
