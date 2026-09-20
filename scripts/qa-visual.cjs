// Set viewport with playwright-cli resize WIDTH HEIGHT, then run this function.
async (page) => {
  await page.reload();
  await page.waitForSelector(".slide-12", {state:"attached"});
  const viewport=page.viewportSize();
  const max=await page.locator(".slide").evaluateAll(es=>es.map(e=>Number(e.dataset.maxState)));
  const clipping=[];
  for(let i=0;i<12;i++) {
    // Home/End and sequential keys also work when the desktop rail is hidden.
    for(let s=0;s<=max[i];s++) {
      await page.waitForTimeout(780);
      const defects=await page.locator(".slide.is-active").evaluate(slide=>{
        const bounds=slide.getBoundingClientRect();
        const result=[];
        for(const element of slide.querySelectorAll("*")) {
          if(element.closest('[aria-hidden="true"], [hidden], [inert], svg')) continue;
          const style=getComputedStyle(element);
          if(style.visibility==="hidden"||style.display==="none"||Number(style.opacity)<.2) continue;
          for(const node of element.childNodes) {
            if(node.nodeType!==Node.TEXT_NODE||!node.textContent.trim()) continue;
            const range=document.createRange();range.selectNodeContents(node);
            for(const r of range.getClientRects()) if(r.width && (r.left<bounds.left-3||r.right>bounds.right+3||r.top<bounds.top-3||r.bottom>bounds.bottom+3)) result.push({text:node.textContent.trim(),x:r.x,y:r.y,w:r.width,h:r.height});
          }
        }
        return result;
      });
      if(defects.length) clipping.push({slide:i+1,state:s,defects});
      await page.screenshot({path:`output/playwright/qa-${viewport.width}-${String(i+1).padStart(2,"0")}-${s}.png`});
      if(i!==11||s!==max[i]) await page.keyboard.press("ArrowRight");
    }
  }
  return {viewport,states:max.reduce((n,m)=>n+m+1,0),horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),clipping};
}
