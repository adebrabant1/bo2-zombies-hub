(function () {
  "use strict";

  const data = window.ZOMBIES_DATA;
  const boot = document.getElementById("bootScreen");
  const skipBoot = document.getElementById("skipBoot");
  const menuItems = Array.from(document.querySelectorAll(".menu-item"));
  const links = Array.from(document.querySelectorAll(".link-button"));
  const homeView = document.getElementById("homeView");
  const dynamicView = document.getElementById("dynamicView");
  const sectionKicker = document.getElementById("sectionKicker");
  const sectionTitle = document.getElementById("sectionTitle");
  const sectionText = document.getElementById("sectionText");
  const filters = document.getElementById("filters");
  const grid = document.getElementById("grid");
  const perkRow = document.getElementById("perkRow");
  const audioToggle = document.getElementById("audioToggle");
  const themeToggle = document.getElementById("themeToggle");
  const menuTheme = document.getElementById("menuTheme");
  const hoverSound = document.getElementById("hoverSound");

  let activeSection = "accueil";
  let activeFilter = "Toutes";
  let audioEnabled = false;

  function hideBoot() {
    boot.classList.add("hidden");
  }

  function playHover() {
    if (!audioEnabled || !hoverSound) return;
    hoverSound.currentTime = 0;
    hoverSound.play().catch(() => undefined);
  }

  function card(title, tag, text) {
    const article = document.createElement("article");
    article.className = "card";
    article.innerHTML = `<p>${tag}</p><h2>${title}</h2><span>${text}</span><br><button class="link-button">Ouvrir le dossier →</button>`;
    return article;
  }

  function renderFilters(section) {
    filters.innerHTML = "";
    section.filters.forEach((filter) => {
      const button = document.createElement("button");
      button.className = "filter";
      button.textContent = filter;
      button.classList.toggle("active", filter === activeFilter);
      button.addEventListener("click", () => {
        activeFilter = filter;
        renderSection(activeSection);
        playHover();
      });
      filters.appendChild(button);
    });
  }

  function renderSection(name) {
    const section = data[name];
    if (!section) return;

    activeSection = name;
    if (!section.filters.includes(activeFilter)) {
      activeFilter = section.filters[0];
    }

    sectionKicker.textContent = section.kicker;
    sectionTitle.textContent = section.title;
    sectionText.textContent = section.text;
    renderFilters(section);
    grid.innerHTML = "";

    section.items
      .filter((item) => activeFilter === "Toutes" || item[1] === activeFilter || item[2].includes(activeFilter) || item[0].includes(activeFilter))
      .forEach((item) => grid.appendChild(card(item[0], item[1], item[2])));
  }

  function navigate(name) {
    menuItems.forEach((item) => item.classList.toggle("active", item.dataset.section === name));

    if (name === "accueil") {
      homeView.hidden = false;
      dynamicView.hidden = true;
    } else {
      homeView.hidden = true;
      dynamicView.hidden = false;
      renderSection(name);
    }

    window.location.hash = name;
    document.getElementById("content").focus({ preventScroll: true });
  }

  function renderPerks() {
    const perks = [
      ["J", "jugg"],
      ["S", "speed"],
      ["D", "double"],
      ["St", "stamin"]
    ];

    perkRow.innerHTML = "";
    perks.forEach(([label, className]) => {
      const div = document.createElement("div");
      div.className = `perk ${className}`;
      div.textContent = label;
      perkRow.appendChild(div);
    });
  }

  function setupNavigation() {
    menuItems.forEach((item) => {
      item.addEventListener("mouseenter", playHover);
      item.addEventListener("click", () => navigate(item.dataset.section));
    });

    links.forEach((link) => {
      link.addEventListener("click", () => navigate(link.dataset.section));
    });

    const hash = window.location.hash.replace("#", "");
    if (hash && (hash === "accueil" || data[hash])) navigate(hash);
  }

  function setupAudio() {
    audioToggle.addEventListener("click", () => {
      audioEnabled = !audioEnabled;
      audioToggle.classList.toggle("active", audioEnabled);
      if (audioEnabled) {
        menuTheme.volume = 0.35;
        menuTheme.play().catch(() => undefined);
      } else {
        menuTheme.pause();
      }
    });
  }

  function setupTheme() {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-aether");
      themeToggle.classList.toggle("active");
    });
  }

  function setupStars() {
    const canvas = document.getElementById("starsCanvas");
    const ctx = canvas.getContext("2d");
    const stars = [];

    function resize() {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function reset() {
      stars.length = 0;
      for (let i = 0; i < 220; i += 1) {
        stars.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.4 + 0.2, a: Math.random() * 0.7 + 0.15, s: Math.random() * 0.12 + 0.02 });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      stars.forEach((star) => {
        star.x -= star.s;
        if (star.x < -2) star.x = innerWidth + 2;
        ctx.fillStyle = `rgba(255,213,158,${star.a})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    reset();
    draw();
    addEventListener("resize", () => { resize(); reset(); });
  }

  function setupAsteroids() {
    const canvas = document.getElementById("asteroidsCanvas");
    const ctx = canvas.getContext("2d");
    const rocks = [];

    function resize() {
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function reset() {
      rocks.length = 0;
      for (let i = 0; i < 64; i += 1) {
        const d = Math.random();
        rocks.push({ x: innerWidth * (0.25 + Math.random() * 0.85), y: innerHeight * (0.05 + Math.random() * 0.62), r: 2 + d * 18, sx: -0.05 - d * 0.24, sy: Math.sin(i) * 0.05, rot: Math.random() * 6.28, spin: (Math.random() - 0.5) * 0.01, d });
      }
    }

    function drawRock(rock) {
      ctx.save();
      ctx.translate(rock.x, rock.y);
      ctx.rotate(rock.rot);
      ctx.beginPath();
      for (let i = 0; i < 9; i += 1) {
        const angle = (Math.PI * 2 * i) / 9;
        const radius = rock.r * (0.72 + Math.sin(i * 2.3 + rock.rot) * 0.16);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${24 + rock.d * 35},${20 + rock.d * 24},${17 + rock.d * 16},${0.84 + rock.d * 0.16})`;
      ctx.shadowColor = "rgba(255,111,0,0.18)";
      ctx.shadowBlur = rock.d * 14;
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      rocks.forEach((rock) => {
        rock.x += rock.sx;
        rock.y += rock.sy;
        rock.rot += rock.spin;
        if (rock.x < -80) {
          rock.x = innerWidth + 80;
          rock.y = innerHeight * (0.05 + Math.random() * 0.62);
        }
        drawRock(rock);
      });
      requestAnimationFrame(draw);
    }

    resize();
    reset();
    draw();
    addEventListener("resize", () => { resize(); reset(); });
  }

  function init() {
    renderPerks();
    setupNavigation();
    setupAudio();
    setupTheme();
    setupStars();
    setupAsteroids();
    skipBoot.addEventListener("click", hideBoot);
    setTimeout(hideBoot, 2200);
  }

  init();
}());
