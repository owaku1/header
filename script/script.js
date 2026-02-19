/* ==========================================================
   Večerka School — UI interactions + EmailJS
   Template vars: {{name}} {{time}} {{message}}
   ========================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* NAV: hamburger + slide-in */
(() => {
  const hamburger = $("#hamburger");
  const nav = $("#nav");
  if (!hamburger || !nav) return;

  const setOpen = (open) => {
    hamburger.classList.toggle("active", open);
    nav.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  };

  hamburger.addEventListener("click", () => {
    setOpen(!hamburger.classList.contains("active"));
  });

  $$("a", nav).forEach(a => a.addEventListener("click", () => setOpen(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();

/* Scroll progress */
(() => {
  const bar = $("#scrollbarBar");
  if (!bar) return;

  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = `${p}%`;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* Active nav link */
(() => {
  const links = $$("#nav a").filter(a => a.getAttribute("href")?.startsWith("#"));
  const sections = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
  if (!links.length || !sections.length) return;

  const setActive = () => {
    const y = window.scrollY + 150;
    let active = links[0].getAttribute("href");

    for (const sec of sections) {
      if (sec.offsetTop <= y) active = `#${sec.id}`;
    }
    links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === active));
  };

  window.addEventListener("scroll", setActive, { passive: true });
  setActive();
})();

/* Reveal animations */
(() => {
  const nodes = $$(".reveal");
  if (!nodes.length) return;

  if (prefersReduced) {
    nodes.forEach(n => n.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add("is-in");
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });

  nodes.forEach(n => io.observe(n));
})();

/* Hero scroll button */
(() => {
  $("#scrollBtn")?.addEventListener("click", () => {
    $("#obory")?.scrollIntoView({ behavior: "smooth" });
  });
})();

/* Lantern glow follows mouse */
(() => {
  const spot = $("#fxSpot");
  if (!spot || prefersReduced) return;

  let x = window.innerWidth * 0.28;
  let y = window.innerHeight * 0.25;
  let tx = x, ty = y;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  const loop = () => {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    spot.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(loop);
  };
  loop();
})();

/* EmailJS send */
(() => {
  const PUBLIC_KEY = "ODBTs8C0uS-Aoa_Rc";
  const SERVICE_ID = "service_sqlza25";
  const TEMPLATE_ID = "template_ormt11d";

  const form = $("#contactForm");
  const note = $("#formNote");
  const sendBtn = $("#sendBtn");
  const btnText = $("#sendBtnText");
  const spinner = $("#sendSpinner");
  const timeField = $("#timeField");

  if (!form || !note || !sendBtn || !btnText || !spinner || !timeField) return;

  if (!window.emailjs) {
    note.textContent = "❌ EmailJS SDK není načtený (zkontroluj script tag).";
    note.className = "form-note bad";
    return;
  }

  emailjs.init(PUBLIC_KEY);

  const setLoading = (on) => {
    sendBtn.disabled = on;
    spinner.style.display = on ? "inline-block" : "none";
    btnText.textContent = on ? "Odesílám..." : "Odeslat";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    note.textContent = "";
    note.className = "form-note";

    timeField.value = new Date().toLocaleString();

    try {
      setLoading(true);
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
      note.textContent = "✅ Zpráva odeslána!";
      note.className = "form-note ok";
      form.reset();
    } catch (err) {
      console.error("EMAILJS ERROR:", err);
      note.textContent = `❌ Neodeslalo se: ${err?.text || "zkontroluj konzoli (F12)"}`;
      note.className = "form-note bad";
    } finally {
      setLoading(false);
    }
  });
})();
document.getElementById("footerYear").textContent =

  "© " + new Date().getFullYear() + " Večerka Střední škola";
 