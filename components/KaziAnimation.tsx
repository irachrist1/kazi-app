"use client";

import { useEffect } from "react";

const REMOVE_CLASSES = [
  "visible","draw","fade-out","dim",
  "khighlight-border","khighlight-line","khighlight-text","kpulse",
];

export default function KaziAnimation() {
  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const $ = (id: string) => document.getElementById(id);
    const $$ = (sel: string) => Array.from(document.querySelectorAll(sel));

    const add = (id: string, cls: string) => $(id)?.classList.add(cls);
    const rem = (id: string, cls: string) => $(id)?.classList.remove(cls);

    const mouse = $("k-cursor")!;
    let mx = 1100, my = 600;

    async function moveMouse(x: number, y: number, ms = 800) {
      mx = x; my = y;
      if (!mouse) return;
      mouse.style.transition = `transform ${ms}ms cubic-bezier(0.25,1,0.5,1)`;
      mouse.style.transform = `translate(${x}px,${y}px)`;
      await wait(ms);
    }

    async function click() {
      if (!mouse) return;
      mouse.style.transition = "transform 0.1s ease";
      mouse.style.transform = `translate(${mx}px,${my}px) scale(0.85)`;
      await wait(100);
      mouse.style.transform = `translate(${mx}px,${my}px) scale(1)`;
      await wait(200);
    }

    function reset() {
      // Use classList.remove — SVG className is SVGAnimatedString, not a plain string
      $$(".kanim, .kline").forEach((el) => {
        (el as HTMLElement).style.transition = "none";
        REMOVE_CLASSES.forEach((c) => el.classList.remove(c));
      });
      void document.body.offsetHeight;
      $$(".kanim, .kline").forEach((el) => { (el as HTMLElement).style.transition = ""; });
      if (mouse) {
        mouse.style.transition = "none";
        mouse.style.transform = "translate(1100px,600px)";
      }
      void document.body.offsetHeight;
    }

    async function run() {
      while (!cancelled) {
        reset();
        await wait(500);

        // ── PHASE 1: BEFORE ──
        const title = $("k-title");
        if (title) {
          title.textContent = "BEFORE KAZI: THE MANUAL SCRAMBLE";
          title.setAttribute("fill", "#1c1b1b");
          title.classList.add("visible");
        }
        await wait(600);

        ["k-browser","k-jobs-header","k-job1","k-job2","k-job3"]
          .forEach((id) => add(id,"visible"));
        await wait(500);

        add("k-raw1","visible"); await wait(400);
        add("k-raw2","visible"); await wait(400);
        add("k-raw3","visible"); await wait(800);

        add("k-cursor","visible");
        await moveMouse(160, 290, 1000);
        await click();

        add("k-messy","visible");
        $$("#k-messy .kline").forEach((l) => l.classList.add("draw"));
        await wait(1000);

        await moveMouse(860, 140, 600); await click();
        $$(".k-cross")[0]?.classList.add("visible"); await wait(400);
        await moveMouse(860, 460, 600); await click();
        $$(".k-cross")[2]?.classList.add("visible"); await wait(400);
        await moveMouse(860, 300, 600); await click();
        $$(".k-cross")[1]?.classList.add("visible"); await wait(1500);

        $$(".kanim").forEach((el) => el.classList.remove("visible"));
        await wait(1000);

        // ── PHASE 2: AFTER ──
        reset();
        if (title) {
          title.textContent = "WITH KAZI: AI-POWERED MATCHING";
          title.setAttribute("fill", "#00685f");
          title.classList.add("visible");
        }
        await wait(600);

        ["k-browser","k-raw1","k-raw2","k-raw3","k-match-btn",
         "k-jobs-header","k-job1","k-job2","k-job3"]
          .forEach((id) => add(id,"visible"));

        add("k-cursor","visible");
        await moveMouse(160, 418, 1200);
        await click();
        moveMouse(50, 550, 1500);

        add("k-match-btn","fade-out");
        add("k-raw1","fade-out"); add("k-raw2","fade-out"); add("k-raw3","fade-out");
        await wait(400);

        add("k-line-in","draw"); await wait(700);
        add("k-ai","visible"); add("k-ai-pulse","kpulse"); await wait(900);

        add("k-skills-header","visible"); add("k-ai-skills","visible");
        add("k-ai-sk1","draw"); add("k-skill1","visible"); await wait(250);
        add("k-ai-sk2","draw"); add("k-skill2","visible"); await wait(250);
        add("k-ai-sk3","draw"); add("k-skill3","visible"); await wait(800);

        add("k-skills-jobs","visible");
        add("k-sk1j1","draw"); add("k-sk2j2","draw"); add("k-sk3j3","draw");
        await wait(1200);

        rem("k-ai-pulse","kpulse");

        ["k-job1","k-job3","k-skill1","k-skill3","k-ai-sk1","k-ai-sk3","k-sk1j1","k-sk3j3"]
          .forEach((id) => add(id,"dim"));

        $("k-job2-rect")?.classList.add("khighlight-border");
        $("k-skill2-rect")?.classList.add("khighlight-border");
        $("k-sk2j2")?.classList.add("khighlight-line");
        $("k-skill2-text")?.classList.add("khighlight-text");
        $("k-job2-title")?.classList.add("khighlight-text");

        await wait(500);
        add("k-check","draw");
        await wait(5000);
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <svg viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", display: "block", fontFamily: "Georgia, serif" }}>

        <text id="k-title" className="kanim kfade" x="500" y="50" textAnchor="middle"
          fontSize="14" fontWeight="bold" letterSpacing="2" fill="#0059bb" />

        <g id="k-browser" className="kanim kfade">
          <rect x="40" y="120" width="240" height="340" rx="3" fill="none" stroke="#1c1b1b" strokeWidth="1.5"/>
          <circle cx="55" cy="135" r="3" fill="#1c1b1b" opacity="0.4"/>
          <circle cx="68" cy="135" r="3" fill="#1c1b1b" opacity="0.4"/>
          <circle cx="81" cy="135" r="3" fill="#1c1b1b" opacity="0.4"/>
          <line x1="40" y1="150" x2="280" y2="150" stroke="#1c1b1b" strokeWidth="1.5" opacity="0.2"/>
          <text x="160" y="180" textAnchor="middle" fontSize="10" opacity="0.5" fontWeight="bold" letterSpacing="1.5">RAW PROFILE</text>
          <g id="k-match-btn" className="kanim kfade">
            <rect x="100" y="400" width="120" height="36" rx="4" fill="#0059bb"/>
            <text x="160" y="423" textAnchor="middle" fontSize="12" fill="#fcf9f8" fontWeight="bold" letterSpacing="1">FIND MATCH</text>
          </g>
        </g>

        <text id="k-raw1" className="kanim kfade" x="160" y="230" textAnchor="middle" fontSize="15" fontStyle="italic">&ldquo;youth trainer&rdquo;</text>
        <text id="k-raw2" className="kanim kfade" x="160" y="290" textAnchor="middle" fontSize="15" fontStyle="italic">&ldquo;ran a savings group&rdquo;</text>
        <text id="k-raw3" className="kanim kfade" x="160" y="350" textAnchor="middle" fontSize="15" fontStyle="italic">&ldquo;community organiser&rdquo;</text>

        <g id="k-messy" className="kanim kfade">
          <line className="kline" x1="280" y1="230" x2="760" y2="140" stroke="#b3b0af" strokeWidth="1.5" opacity="0.6"/>
          <line className="kline" x1="280" y1="230" x2="760" y2="300" stroke="#b3b0af" strokeWidth="1.5" opacity="0.6"/>
          <line className="kline" x1="280" y1="290" x2="760" y2="140" stroke="#b3b0af" strokeWidth="1.5" opacity="0.6"/>
          <line className="kline" x1="280" y1="290" x2="760" y2="460" stroke="#b3b0af" strokeWidth="1.5" opacity="0.6"/>
          <line className="kline" x1="280" y1="350" x2="760" y2="300" stroke="#b3b0af" strokeWidth="1.5" opacity="0.6"/>
          <line className="kline" x1="280" y1="350" x2="760" y2="460" stroke="#b3b0af" strokeWidth="1.5" opacity="0.6"/>
        </g>

        <line id="k-line-in" className="kanim kline" x1="280" y1="300" x2="370" y2="300" stroke="#0059bb" strokeWidth="1.5"/>
        <g id="k-ai" className="kanim kfade">
          <circle id="k-ai-pulse" className="kanim" cx="400" cy="300" r="30" fill="none" stroke="#0059bb" strokeWidth="1.5" style={{ transformOrigin: "400px 300px" }}/>
          <circle cx="400" cy="300" r="30" fill="#fcf9f8" stroke="#0059bb" strokeWidth="1.5"/>
          <text x="400" y="304" textAnchor="middle" fontSize="12" fill="#0059bb" fontWeight="bold" letterSpacing="1">AI</text>
        </g>

        <g id="k-ai-skills" className="kanim kfade">
          <line id="k-ai-sk1" className="kanim kline" x1="430" y1="300" x2="490" y2="198" stroke="#0059bb" strokeWidth="1.5" opacity="0.6"/>
          <line id="k-ai-sk2" className="kanim kline" x1="430" y1="300" x2="490" y2="248" stroke="#0059bb" strokeWidth="1.5" opacity="0.6"/>
          <line id="k-ai-sk3" className="kanim kline" x1="430" y1="300" x2="490" y2="348" stroke="#0059bb" strokeWidth="1.5" opacity="0.6"/>
        </g>

        <text id="k-skills-header" className="kanim kfade" x="580" y="140" textAnchor="middle" fontSize="10" opacity="0.5" fontWeight="bold" letterSpacing="1.5">STRUCTURED SKILLS</text>
        <g id="k-skill1" className="kanim kslide-r">
          <rect x="490" y="180" width="180" height="36" rx="2" fill="#fcf9f8" stroke="#1c1b1b" strokeWidth="1.5"/>
          <text x="580" y="203" textAnchor="middle" fontSize="13">Program Coordination</text>
        </g>
        <g id="k-skill2" className="kanim kslide-r">
          <rect id="k-skill2-rect" x="490" y="230" width="180" height="36" rx="2" fill="#fcf9f8" stroke="#1c1b1b" strokeWidth="1.5"/>
          <text id="k-skill2-text" x="580" y="253" textAnchor="middle" fontSize="13">Stakeholder Comm.</text>
        </g>
        <g id="k-skill3" className="kanim kslide-r">
          <rect x="490" y="330" width="180" height="36" rx="2" fill="#fcf9f8" stroke="#1c1b1b" strokeWidth="1.5"/>
          <text x="580" y="353" textAnchor="middle" fontSize="13">Community Engagement</text>
        </g>

        <g id="k-skills-jobs" className="kanim kfade">
          <line id="k-sk1j1" className="kanim kline" x1="670" y1="198" x2="760" y2="140" stroke="#0059bb" strokeWidth="1.5" opacity="0.4"/>
          <line id="k-sk2j2" className="kanim kline" x1="670" y1="248" x2="760" y2="300" stroke="#0059bb" strokeWidth="1.5" opacity="0.4"/>
          <line id="k-sk3j3" className="kanim kline" x1="670" y1="348" x2="760" y2="460" stroke="#0059bb" strokeWidth="1.5" opacity="0.4"/>
        </g>

        <text id="k-jobs-header" className="kanim kfade" x="860" y="80" textAnchor="middle" fontSize="10" opacity="0.5" fontWeight="bold" letterSpacing="1.5">LIVE OPPORTUNITIES</text>
        <g id="k-job1" className="kanim kslide-l">
          <rect x="760" y="100" width="200" height="80" rx="2" fill="#fcf9f8" stroke="#1c1b1b" strokeWidth="1.5"/>
          <circle cx="785" cy="140" r="12" fill="none" stroke="#1c1b1b" strokeWidth="1" opacity="0.3"/>
          <text x="810" y="135" fontSize="14" fontWeight="bold">Data Entry Clerk</text>
          <text x="810" y="155" fontSize="11" opacity="0.7">Acme Corp • Kigali</text>
          <path className="k-cross kanim kfade" d="M930 130 L950 150 M950 130 L930 150" stroke="#d94838" strokeWidth="2.5" fill="none"/>
        </g>
        <g id="k-job2" className="kanim kslide-l">
          <rect id="k-job2-rect" x="760" y="260" width="200" height="80" rx="2" fill="#fcf9f8" stroke="#1c1b1b" strokeWidth="1.5"/>
          <circle cx="785" cy="300" r="12" fill="none" stroke="#1c1b1b" strokeWidth="1" opacity="0.3"/>
          <text id="k-job2-title" x="810" y="295" fontSize="14" fontWeight="bold">Community Lead</text>
          <text x="810" y="315" fontSize="11" opacity="0.7">Inclusivity NGO • Kigali</text>
          <path className="k-cross kanim kfade" d="M930 290 L950 310 M950 290 L930 310" stroke="#d94838" strokeWidth="2.5" fill="none"/>
          <path id="k-check" className="kanim kline" d="M925 300 L933 308 L947 292" stroke="#00685f" strokeWidth="3" fill="none"/>
        </g>
        <g id="k-job3" className="kanim kslide-l">
          <rect x="760" y="420" width="200" height="80" rx="2" fill="#fcf9f8" stroke="#1c1b1b" strokeWidth="1.5"/>
          <circle cx="785" cy="460" r="12" fill="none" stroke="#1c1b1b" strokeWidth="1" opacity="0.3"/>
          <text x="810" y="455" fontSize="14" fontWeight="bold">Social Media Mgr</text>
          <text x="810" y="475" fontSize="11" opacity="0.7">Creative Hub • Kigali</text>
          <path className="k-cross kanim kfade" d="M930 450 L950 470 M950 450 L930 470" stroke="#d94838" strokeWidth="2.5" fill="none"/>
        </g>

        <g id="k-cursor" className="kanim kfade" style={{ transform: "translate(1100px,600px)" }}>
          <path d="M0,0 L0,22 L6,16 L10,25 L14,23 L10,14 L17,14 Z" fill="#1c1b1b" stroke="#fcf9f8" strokeWidth="1.5"/>
        </g>
      </svg>
    </div>
  );
}
