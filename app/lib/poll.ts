let dayKey = () => new Date().toISOString().slice(0,10);

export function getReqCount() {
  const k = "reqCount-"+dayKey();
  return Number(localStorage.getItem(k) || "0");
}
export function bumpReqCount(n:number=1){
  const k = "reqCount-"+dayKey();
  const v = getReqCount()+n;
  localStorage.setItem(k, String(v));
  return v;
}
export function resetReqCountIfNewDay(){
  const k = "reqCount-"+dayKey();
  if (!localStorage.getItem(k)) localStorage.setItem(k, "0");
}

/** visible tab only polling with hard cap */
export function smartPoll(fn: ()=>Promise<void>|void, baseMs: number, hardCap:number=100){
  let t:any, active=true;
  resetReqCountIfNewDay();
  const strict = (process.env.NEXT_PUBLIC_FREE_MODE_STRICT === "true");

  const tick = async () => {
    if (!active) return;
    if (strict && getReqCount() >= hardCap) return; // hard stop
    await fn();
    t = setTimeout(tick, baseMs);
  };

  const onVis = () => {
    active = document.visibilityState === "visible";
    clearTimeout(t);
    if (active) tick();
  };

  document.addEventListener("visibilitychange", onVis);
  tick();
  return () => { active=false; clearTimeout(t); document.removeEventListener("visibilitychange", onVis); };
}
