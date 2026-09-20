// Chromium touch events, not synthetic DOM pointer events.
async (page) => {
  await page.setViewportSize({width:390,height:844});
  await page.reload();
  await page.waitForSelector(".slide-12", {state:"attached"});
  await page.waitForTimeout(600);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setTouchEmulationEnabled", {enabled:true,maxTouchPoints:1});
  const swipe = async (x1,x2,y1=400,y2=400) => {
    await cdp.send("Input.dispatchTouchEvent", {type:"touchStart",touchPoints:[{x:x1,y:y1}]});
    for(let i=1;i<=5;i++) await cdp.send("Input.dispatchTouchEvent", {type:"touchMove",touchPoints:[{x:x1+(x2-x1)*i/5,y:y1+(y2-y1)*i/5}]});
    await cdp.send("Input.dispatchTouchEvent", {type:"touchEnd",touchPoints:[]});
    await page.waitForTimeout(500);
  };
  const state = () => page.locator(".slide.is-active").getAttribute("data-state");
  const failures=[];
  try {
    await swipe(300,90);
    if(await state()!=="1") failures.push("Swipe forward");
    await swipe(90,300);
    if(await state()!=="0") failures.push("Swipe backward");
    await swipe(200,200,500,280);
    if(await state()!=="0") failures.push("Vertical gesture changed state");
    await page.locator("#notesButton").click();
    await page.locator("#notesDrawer").waitFor({state:"visible"});
    await page.locator("#closeNotesButton").click();
    return {viewport:page.viewportSize(),touch:"forward / reverse / vertical isolation",failures};
  } finally {
    await cdp.send("Emulation.setTouchEmulationEnabled", {enabled:false});
    await cdp.detach();
  }
}
