/* ============================================================
   SQUARE ART 2.0 — shared motion rig
   GSAP + ScrollTrigger + Lenis · one easing language
   ============================================================ */
(function () {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EASE = "power4.out";
  const EASE_IO = "power3.inOut";
  window.SA = { EASE, EASE_IO, reduced, lenis: null };

  if (reduced) document.documentElement.classList.add("reduced");

  /* graceful photo fallback */
  window.phFail = function (img) {
    const ph = img.closest(".ph");
    if (ph) ph.classList.add("noimg");
    img.remove();
  };

  /* ---------- smooth scroll ---------- */
  if (!reduced && window.Lenis && window.gsap) {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    SA.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  if (window.gsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- split text into masked lines ---------- */
  window.splitLines = function (el) {
    const text = el.textContent.trim();
    el.innerHTML = text.split(/\s+/).map((w) => `<span class="w" style="display:inline-block">${w}</span>`).join(" ");
    const words = [...el.querySelectorAll(".w")];
    const lines = [];
    let top = null, cur = [];
    words.forEach((w) => {
      if (top === null || Math.abs(w.offsetTop - top) > 4) { if (cur.length) lines.push(cur); cur = []; top = w.offsetTop; }
      cur.push(w.textContent);
    });
    if (cur.length) lines.push(cur);
    el.innerHTML = lines.map((ws) => `<span class="line-mask"><span class="line">${ws.join(" ")}</span></span>`).join("");
    return [...el.querySelectorAll(".line")];
  };

  document.addEventListener("DOMContentLoaded", () => {
    const $ = (s, c) => (c || document).querySelector(s);
    const $$ = (s, c) => [...(c || document).querySelectorAll(s)];

    /* ---------- header state ---------- */
    const hd = $(".hd");
    if (hd) addEventListener("scroll", () => hd.classList.toggle("scrolled", scrollY > 40), { passive: true });

    /* ---------- mobile menu ---------- */
    const burger = $(".hd-burger");
    if (burger) burger.addEventListener("click", () => document.body.classList.toggle("menu-open"));
    $$(".m-menu a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

    /* ---------- preloader + hero entrance ---------- */
    const pre = $(".preloader");
    const heroH1 = $("[data-hero-title]");
    let heroLines = [];
    if (heroH1 && !reduced) {
      heroLines = heroH1.hasAttribute("data-premask") ? $$(".line", heroH1) : splitLines(heroH1);
    }

    function heroIn(delay) {
      if (!window.gsap || reduced) return;
      const tl = gsap.timeline({ delay: delay || 0 });
      if (heroLines.length) tl.from(heroLines, { yPercent: 112, duration: 1.15, stagger: 0.09, ease: EASE });
      tl.from("[data-hero-fade]", { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: EASE }, "-=0.55");
    }

    const seen = sessionStorage.getItem("sa-seen");
    if (pre && window.gsap && !reduced && !seen) {
      sessionStorage.setItem("sa-seen", "1");
      const count = { v: 0 };
      const cEl = $(".pre-count");
      gsap.timeline()
        .to(count, {
          v: 100, duration: 1.7, ease: "power2.inOut",
          onUpdate: () => { if (cEl) cEl.textContent = Math.round(count.v); },
        })
        .to(".pre-label span", { autoAlpha: 0.25, stagger: 0.08, duration: 0.2 }, 0.4)
        .to(pre, { yPercent: -100, duration: 0.9, ease: EASE_IO })
        .add(() => heroIn(0), "-=0.45");
    } else {
      if (pre) pre.style.display = "none";
      heroIn(0.15);
    }

    /* ---------- page wipe transitions ---------- */
    const wipe = $(".wipe");
    if (wipe && window.gsap && !reduced) {
      $$('a[href$=".html"]').forEach((a) => {
        if (a.hostname && a.hostname !== location.hostname) return;
        a.addEventListener("click", (e) => {
          const href = a.getAttribute("href");
          if (!href || href.startsWith("#")) return;
          e.preventDefault();
          document.body.classList.remove("menu-open");
          gsap.to(wipe, { scaleY: 1, transformOrigin: "bottom", duration: 0.5, ease: EASE_IO, onComplete: () => (location.href = href) });
        });
      });
      addEventListener("pageshow", () => gsap.set(wipe, { scaleY: 0 }));
      gsap.to(wipe, { scaleY: 0, transformOrigin: "top", duration: 0.65, ease: EASE_IO, delay: 0.05 });
    }

    /* ---------- universal reveals ---------- */
    if (window.gsap && !reduced) {
      $$("[data-reveal]").forEach((el) => {
        const t = el.dataset.reveal;
        const from = t === "fade" ? { autoAlpha: 0 } : t === "scale" ? { scale: 0.94, autoAlpha: 0 } : t === "lines" ? null : { y: 54, autoAlpha: 0 };
        if (t === "lines") {
          const ls = splitLines(el);
          gsap.from(ls, { yPercent: 112, duration: 1.05, stagger: 0.08, ease: EASE, scrollTrigger: { trigger: el, start: "top 86%" } });
        } else {
          gsap.from(el, { ...from, duration: 1.1, ease: EASE, delay: +(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: "top 86%" } });
        }
      });

      /* word-scrub manifesto */
      $$("[data-words]").forEach((el) => {
        el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w" style="display:inline-block">${w}&nbsp;</span>`).join("");
        gsap.to(el.querySelectorAll(".w"), {
          opacity: 1, stagger: 0.04, ease: "none",
          scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 45%", scrub: true },
        });
      });

      /* counters */
      $$("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count);
        ScrollTrigger.create({
          trigger: el, start: "top 88%", once: true,
          onEnter: () => gsap.fromTo(el, { textContent: 0 }, { textContent: end, duration: 1.7, snap: { textContent: 1 }, ease: "power2.out" }),
        });
      });
    } else {
      $$("[data-words]").forEach((el) => (el.style.opacity = 1));
    }

    /* ---------- marquee (velocity-reactive) ---------- */
    $$(".marquee").forEach((mq) => {
      const track = $(".m-track", mq);
      if (!track) return;
      while (track.scrollWidth < innerWidth * 2.2) track.innerHTML += track.innerHTML;
      let x = 0, speed = 1;
      if (SA.lenis) SA.lenis.on("scroll", (e) => (speed = 1 + Math.min(Math.abs(e.velocity || 0) * 0.35, 6)));
      const step = () => {
        x -= 0.045 * speed;
        if (x <= -50) x += 50;
        track.style.transform = `translateX(${x}%)`;
        speed += (1 - speed) * 0.05;
      };
      if (window.gsap && !reduced) gsap.ticker.add(step);
    });

    /* ---------- custom cursor + magnetic ---------- */
    if (matchMedia("(pointer:fine)").matches && window.gsap && !reduced) {
      const dot = document.createElement("div");
      dot.className = "cursor";
      document.body.appendChild(dot);
      const sx = gsap.quickTo(dot, "x", { duration: 0.32, ease: "power3" });
      const sy = gsap.quickTo(dot, "y", { duration: 0.32, ease: "power3" });
      addEventListener("mousemove", (e) => { sx(e.clientX); sy(e.clientY); });
      const hoverables = "a, button, [data-hover]";
      document.addEventListener("mouseover", (e) => { if (e.target.closest(hoverables)) dot.classList.add("is-hover"); });
      document.addEventListener("mouseout", (e) => { if (e.target.closest(hoverables)) dot.classList.remove("is-hover"); });

      $$("[data-magnetic]").forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4 });
        });
        el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1,.45)" }));
      });
    }

    /* ---------- project row hover previews ---------- */
    const preview = $(".proj-preview");
    if (preview && window.gsap && !reduced && matchMedia("(pointer:fine)").matches) {
      const px = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3" });
      const py = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3" });
      addEventListener("mousemove", (e) => { px(e.clientX + 30); py(e.clientY - 100); });
      $$(".proj-row").forEach((row) => {
        row.addEventListener("mouseenter", () => {
          const tpl = $("template", row);
          if (tpl) preview.innerHTML = tpl.innerHTML;
          gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.4, ease: EASE });
        });
        row.addEventListener("mouseleave", () => gsap.to(preview, { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: EASE }));
      });
    }

    /* ---------- quote form -> opens the visitor's own email app ---------- */
    const INBOX = "squareartltd@gmail.com";
    const form = $("#quote-form");
    if (form) {
      // pill selection (project type = multi, target start = single)
      $$(".pill", form).forEach((p) =>
        p.addEventListener("click", (e) => {
          e.preventDefault();
          const group = p.parentElement;
          if (group && group.hasAttribute("data-single")) {
            $$(".pill", group).forEach((o) => { if (o !== p) o.classList.remove("on"); });
          }
          p.classList.toggle("on");
        })
      );

      const picked = (sel) => {
        const g = $(sel, form);
        if (!g) return "";
        return $$(".pill.on", g).map((p) => p.textContent.trim()).join(", ");
      };
      const val = (id) => { const el = $("#" + id, form); return el ? el.value.trim() : ""; };

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = val("name"), phone = val("phone"), email = val("email");
        const loc = val("loc"), msg = val("msg");
        const type = picked("#pills-type"), start = picked("#pills-start");

        const subject = "Quote request" + (type ? " — " + type : "") + (name ? " — " + name : "");
        const lines = [
          "Hi Square Art Construction,",
          "",
          "I'd like a quote on a project. Here are my details:",
          "",
          "Name:             " + (name || "—"),
          "Phone:            " + (phone || "—"),
          "Email:            " + (email || "—"),
          "Project location: " + (loc || "—"),
          "Project type:     " + (type || "—"),
          "Target start:     " + (start || "—"),
          "",
          "Project details:",
          msg || "—",
          "",
          "(Sent from squareartconstruction website)",
        ];
        const href =
          "mailto:" + INBOX +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(lines.join("\r\n"));

        const fb = $("#mailto-fallback");
        if (fb) fb.setAttribute("href", href);

        const ok = $("#form-ok");
        if (ok) { ok.style.display = "block"; ok.scrollIntoView({ behavior: "smooth", block: "center" }); }

        // open the user's mail client
        window.location.href = href;
      });
    }

    /* ---------- footer year ---------- */
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

    /* console easter egg */
    console.log("%c SQUARE ART — built plumb, level & square. Check our corners: they're 90°. ", "background:#E85D2F;color:#F7F2E8;padding:6px 10px;border-radius:4px;font-family:monospace");
  });
})();
