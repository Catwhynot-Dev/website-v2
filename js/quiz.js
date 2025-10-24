(function () {
  if (!window.QUIZ_DATA) {
    console.error("Quiz data is missing. Ensure /js/quiz-data.js loads before /js/quiz.js.");
    const stage = document.getElementById("stage");
    if (stage) {
      const message = document.createElement("div");
      message.className = "quiz-error";
      message.innerHTML =
        "<strong>Quiz data unavailable.</strong><br />Refresh the page or confirm that <code>js/quiz-data.js</code> is deployed.";
      stage.replaceChildren(message);
    }
    return;
    throw new Error("Quiz data is missing");
  }

  const {
    IMAGES,
    BACKGROUND_LAYOUTS,
    VIEW_LABELS,
    SKULL_VIEWS,
    SPINE_VIEWS,
    DEFAULT_SKULL_VIEW,
    DEFAULT_SPINE_VIEW,
    LABELS,
    COORDS,
  } = window.QUIZ_DATA;

  const SUBSCRIPT_MAP = {
    "₀": "0",
    "₁": "1",
    "₂": "2",
    "₃": "3",
    "₄": "4",
    "₅": "5",
    "₆": "6",
    "₇": "7",
    "₈": "8",
    "₉": "9",
    "₋": "-",
  };

  const replaceSubscripts = (value) =>
    value.replace(/[₀₁₂₃₄₅₆₇₈₉₋]/g, (char) => SUBSCRIPT_MAP[char] || char);

  const OPTIONAL_PREFIXES = new Set([
    "anterior",
    "atlas",
    "axis",
    "cervical",
    "coccygeal",
    "lumbar",
    "coccyx",
    "lumbar",
    "posterior",
    "sacral",
    "thoracic",
  ]);

  const stripOptionalQualifiers = (text) => {
    const words = text.split(" ").filter(Boolean);
    while (words.length > 1 && OPTIONAL_PREFIXES.has(words[0])) {
      const qualifier = words[0];
      const remainder = words.slice(1).join(" ");
      if (
        (qualifier === "sacral" && /\b(foramina|hiatus)\b/.test(remainder)) ||
        ((qualifier === "atlas" || qualifier === "axis") && /\barticulation\b/.test(remainder))
      ) {
        break;
      }
      words.shift();
    }
    return words.join(" ");
  };

  const norm = (s) =>
    stripOptionalQualifiers(
      replaceSubscripts(s)
        .toLowerCase()
        .replace(/\bsub\s*(\d)/g, "$1")
        .replace(/\bregion\b/g, "")
        .replace(/\bodontoid(?: process)?\b/g, "dens")
        .replace(/articulates?\s+with\s+(axis|atlas)/g, "$1 articulation")
        .replace(/\([^)]*\)/g, "")
        .replace(/[–—−-]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\s+bone$/, "")
    );

  const IMAGES = {
    anterior: "https://raw.githubusercontent.com/Catwhynot-Dev/stuffsforschool/main/anteriorskull.png",
    inferior: "https://raw.githubusercontent.com/Catwhynot-Dev/stuffsforschool/main/inferiorskull.png",
    lateral: "https://raw.githubusercontent.com/Catwhynot-Dev/stuffsforschool/main/lateralskull.png",
  };

  const LABELS = {
    anterior: [
      "Parietal bone",
      "Sphenoid",
      "Temporal bone",
      "Ethmoid",
      "Lacrimal bone",
      "Palatine bone",
      "Zygomatic bone",
      "Nasal bone",
      "Maxilla",
      "Inferior nasal concha",
      "Mandible",
      "Sagittal suture",
      "Coronal suture",
      "Supra-orbital foramen",
      "Optic canal",
      "Superior orbital fissure",
      "Temporal process of zygomatic bone",
      "Mastoid process of temporal bone",
      "Infra-orbital foramen",
      "Middle nasal concha (part of ethmoid)",
      "Perpendicular plate of ethmoid",
      "Vomer",
      "Nasal septum (bony portion)",
    ],
    inferior: [
      "Frontal bone",
      "Zygomatic bone",
      "Vomer",
      "Sphenoid",
      "Maxilla",
      "Palatine bone",
      "Zygomatic arch",
      "Styloid process",
      "Mandibular fossa",
      "External acoustic meatus",
      "Temporal bone",
      "Mastoid process",
      "Lambdoid suture",
      "Occipital bone",
      "External occipital protuberance",
      "Occipital condyle",
      "Foramen magnum",
    ],
    lateral: [
      "Sphenoid",
      "Ethmoid",
      "Lacrimal bone",
      "Nasal bone",
      "Zygomatic bone",
      "Maxilla",
      "Mastoid process",
      "Styloid process",
      "Zygomatic process of temporal bone",
      "Temporal process of zygomatic bone",
      "Zygomatic arch",
      "Coronoid process",
      "External acoustic meatus",
      "Supra-orbital foramen",
      "Infra-orbital foramen",
      "Lambdoid suture",
      "Squamous suture",
      "Coronal suture",
    ],
  };

  const COORDS_ANTERIOR = {
    "Parietal bone": { x: 35.6481, y: 19.3107 },
    "Sphenoid": { x: 28.7037, y: 36.483 },
    "Temporal bone": { x: 27.1605, y: 38.5395 },
    "Ethmoid": { x: 37.4228, y: 43.3724 },
    "Lacrimal bone": { x: 37.963, y: 44.9148 },
    "Palatine bone": { x: 36.1111, y: 44.184 },
    "Zygomatic bone": { x: 28.3179, y: 50.2619 },
    "Nasal bone": { x: 40.8179, y: 42.6526 },
    "Maxilla": { x: 35.8025, y: 54.992 },
    "Inferior nasal concha": { x: 39.3519, y: 52.9354 },
    "Mandible": { x: 33.4105, y: 68.1539 },
    "Sagittal suture": { x: 41.7438, y: 16.4316 },
    "Coronal suture": { x: 48.0035, y: 19.4155 },
    "Supra-orbital foramen": { x: 48.071, y: 36.0717 },
    "Optic canal": { x: 46.4506, y: 41.7272 },
    "Superior orbital fissure": { x: 47.8395, y: 43.2696 },
    "Temporal process of zygomatic bone": { x: 56.4043, y: 49.7478 },
    "Mastoid process of temporal bone": { x: 55.4784, y: 54.7863 },
    "Infra-orbital foramen": { x: 48.7654, y: 50.6732 },
    "Middle nasal concha (part of ethmoid)": { x: 42.9784, y: 48.3082 },
    "Perpendicular plate of ethmoid": { x: 41.5895, y: 51.0845 },
    "Vomer": { x: 41.5123, y: 54.8891 },
    "Nasal septum (bony portion)": { x: 41.4931, y: 48.8137 },
  };

  const COORDS_INFERIOR = {
    "Frontal bone": { x: 38.676697678036156, y: 19.945987507149024 },
    "Zygomatic bone": { x: 35.37808656692505, y: 24.459876396037913 },
    "Vomer": { x: 49.35378101136949, y: 39.73765417381569 },
    "Sphenoid": { x: 39.19753101136949, y: 35.223765284926806 },
    "Maxilla": { x: 52.56558656692505, y: 19.0200615812231 },
    "Palatine bone": { x: 52.13155878914727, y: 28.047839359000875 },
    "Zygomatic arch": { x: 67.58294767803616, y: 29.783950470111986 },
    "Styloid process": { x: 39.19753101136949, y: 47.60802454418606 },
    "Mandibular fossa": { x: 37.54822545581394, y: 48.76543195159347 },
    "External acoustic meatus": { x: 35.11766990025838, y: 50.38580232196384 },
    "Temporal bone": { x: 68.62461434470283, y: 51.42746898863051 },
    "Mastoid process": { x: 66.8885032335917, y: 55.24691343307495 },
    "Lambdoid suture": { x: 33.72878101136949, y: 70.29320972937124 },
    "Occipital bone": { x: 43.364197678036156, y: 75.15432084048236 },
    "External occipital protuberance": { x: 50.308642122480606, y: 78.9737652849268 },
    "Occipital condyle": { x: 57.16628101136949, y: 56.63580232196384 },
    "Foramen magnum": { x: 50.048225455813935, y: 55.01543195159348 },
  };

  const COORDS_LATERAL = {
    "Sphenoid": { x: 64.22372227579557, y: 39.08711025393764 },
    "Ethmoid": { x: 71.45612343297975, y: 44.35872709739633 },
    "Lacrimal bone": { x: 73.67405978784957, y: 43.84442301510768 },
    "Nasal bone": { x: 78.68852459016394, y: 38.95853423336548 },
    "Zygomatic bone": { x: 70.29893924783028, y: 52.587592414014786 },
    "Maxilla": { x: 76.08486017357762, y: 54.25908068145291 },
    "Mastoid process": { x: 44.06943105110897, y: 68.14529090324655 },
    "Styloid process": { x: 53.23047251687561, y: 68.2738669238187 },
    "Zygomatic process of temporal bone": { x: 60.84860173577628, y: 54.25908068145291 },
    "Temporal process of zygomatic bone": { x: 64.80231436837029, y: 54.001928640308584 },
    "Zygomatic arch": { x: 43.49083895853423, y: 82.41722918675667 },
    "Coronoid process": { x: 64.80231436837029, y: 60.045001607200255 },
    "External acoustic meatus": { x: 50.72324011571842, y: 59.787849566055925 },
    "Supra-orbital foramen": { x: 75.89199614271939, y: 32.9154612664738 },
    "Infra-orbital foramen": { x: 76.08486017357762, y: 51.173256187720995 },
    "Lambdoid suture": { x: 25.747348119575697, y: 51.68756027000965 },
    "Squamous suture": { x: 47.251687560270014, y: 33.55834136933462 },
    "Coronal suture": { x: 54.09836065573771, y: 10.286081645773065 },
  };

  const norm = (s) =>
    s
      .toLowerCase()
      .replace(/\([^)]*\)/g, "")
      .replace(/-/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\s+bone$/, "");

  const shuffle = (array) => {
    const clone = [...array];
    for (let i = clone.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  };

  const makeDots = (labels, coords) =>
    labels.map((key) => ({
      key,
      x: (coords[key]?.x) || 50,
      y: (coords[key]?.y) || 50,
      correct: false,
      wrong: false,
    }));

  const VIEW_KEYS = Object.keys(LABELS);

  const state = {
    view: DEFAULT_SKULL_VIEW,
    skullView: DEFAULT_SKULL_VIEW,
    spineView: DEFAULT_SPINE_VIEW,
    mode: "click",
    dots: {},
    order: {},
    wrongStreak: {},
    typeWrong: {},
    review: {},
    inReview: false,
    completedViews: new Set(),
  };

  const initViewState = (key) => {
    state.dots[key] = makeDots(LABELS[key], COORDS[key] || {});
    state.order[key] = shuffle(LABELS[key]);
    state.wrongStreak[key] = 0;
    state.typeWrong[key] = 0;
    state.review[key] = [];
  };

  VIEW_KEYS.forEach(initViewState);

  const wrap = document.querySelector(".wrap");
  const stage = document.getElementById("stage");
  const bgStrip = document.getElementById("bgStrip");
  const viewBtn = document.getElementById("viewBtn");
  const viewMenu = document.getElementById("viewMenu");
  const viewLabel = document.getElementById("viewLabel");
  const spineBtn = document.getElementById("spineBtn");
  const spineMenu = document.getElementById("spineMenu");
  const spineLabel = document.getElementById("spineLabel");
  const modeClick = document.getElementById("modeClick");
  const modeType = document.getElementById("modeType");
  const modeDrag = document.getElementById("modeDrag");

  const state = {
    view: "anterior",
    mode: "click",
    dots: {
      anterior: makeDots(LABELS.anterior, COORDS_ANTERIOR),
      inferior: makeDots(LABELS.inferior, COORDS_INFERIOR),
      lateral: makeDots(LABELS.lateral, COORDS_LATERAL),
    },
    order: {
      anterior: shuffle(LABELS.anterior),
      inferior: shuffle(LABELS.inferior),
      lateral: shuffle(LABELS.lateral),
    },
    wrongStreak: { anterior: 0, inferior: 0, lateral: 0 },
    typeWrong: { anterior: 0, inferior: 0, lateral: 0 },
    review: { anterior: [], inferior: [], lateral: [] },
    inReview: false,
  };

  const bg = document.getElementById("bg");
  const stage = document.getElementById("stage");
  const viewBtn = document.getElementById("viewBtn");
  const viewMenu = document.getElementById("viewMenu");
  const viewLabel = document.getElementById("viewLabel");
  const modeClick = document.getElementById("modeClick");
  const modeType = document.getElementById("modeType");
  const promptBox = document.getElementById("prompt");
  const targetEl = document.getElementById("target");
  const wrongStreakEl = document.getElementById("wrongStreak");
  const typeForm = document.getElementById("typeForm");
  const answerInput = document.getElementById("answer");
  const typeWrongEl = document.getElementById("typeWrong");
  const progressEl = document.getElementById("progress");
  const startReviewBtn = document.getElementById("startReview");
  const reviewCount = document.getElementById("reviewCount");
  const reviewBadge = document.getElementById("reviewBadge");
  const dragMessage = document.getElementById("dragMessage");
  const dragPanel = document.getElementById("dragPanel");
  const dragViewLabel = document.getElementById("dragViewLabel");
  const coordOutput = document.getElementById("coordOutput");
  const copyCoordsBtn = document.getElementById("copyCoords");
  const copyStatus = document.getElementById("copyStatus");
  const wordList = document.getElementById("wordList");
  const wordCount = document.getElementById("wordCount");
  const good = document.getElementById("good");
  const bad = document.getElementById("bad");
  const celebration = document.getElementById("celebration");
  const confettiBox = document.getElementById("confetti");
  const playAgainBtn = document.getElementById("playAgain");
  const celebrationTitle = document.getElementById("celebrationTitle");
  const celebrationMessage = document.getElementById("celebrationMessage");

  const firstUnansweredIndex = (dots) => {
    for (let i = 0; i < dots.length; i += 1) {
      if (!dots[i].correct) {
        return i;
      }
    }
    return null;
  };

  const flashBadge = (text, x, y, color = "") => {
    const badge = document.createElement("div");
    badge.className = "badge";
    badge.style.left = `${x}%`;
    badge.style.top = `${y - 3}%`;
    badge.style.color = color || "#c7d2fe";
    badge.textContent = text;
    stage.appendChild(badge);
    setTimeout(() => badge.remove(), 950);
  };

  const resetView = (view) => {
    if (!VIEW_KEYS.includes(view)) return;
    initViewState(view);
    state.completedViews.delete(view);
  };

  const hideCelebration = () => {
    if (celebration) celebration.hidden = true;
    if (confettiBox) confettiBox.innerHTML = "";
  };

  const triggerCelebration = (view) => {
    if (!celebration || !confettiBox) return;
    state.completedViews.add(view);
    confettiBox.innerHTML = "";
    if (celebrationTitle) {
      celebrationTitle.textContent = "Great work!";
    }
    if (celebrationMessage) {
      const viewName = VIEW_LABELS[view] || view;
      celebrationMessage.textContent = `You've completed the ${viewName} diagram.`;
    }
    const pieces = 120;
    for (let i = 0; i < pieces; i += 1) {
      const shard = document.createElement("span");
      shard.className = "confetti-piece";
      shard.style.setProperty("--left", `${Math.random() * 100}%`);
      shard.style.setProperty("--delay", `${(Math.random() * 0.8).toFixed(2)}s`);
      shard.style.setProperty("--duration", `${(2.2 + Math.random() * 1.8).toFixed(2)}s`);
      shard.style.setProperty("--hue", `${Math.floor(Math.random() * 360)}`);
      confettiBox.appendChild(shard);
    }
    celebration.hidden = false;
  };

  const applySingleAspectRatio = (img) => {
    if (!stage) return;
    const { naturalWidth, naturalHeight } = img;
    if (naturalWidth && naturalHeight) {
      stage.style.aspectRatio = `${naturalWidth} / ${naturalHeight}`;
    }
  };

  const renderBackgrounds = () => {
    if (!bgStrip || !stage) return;
    const backgrounds = BACKGROUND_LAYOUTS[state.view] || [];
    const isMulti = backgrounds.length > 1;

    stage.classList.toggle("multi", isMulti);
    stage.classList.toggle("single", !isMulti);
    if (wrap) {
      wrap.classList.toggle("spine-mode", isMulti);
    }
    if (isMulti) {
      stage.style.removeProperty("aspect-ratio");
    }

    bgStrip.innerHTML = "";
    bgStrip.classList.toggle("single", !isMulti);

    backgrounds.forEach(({ key, src }) => {
      const img = document.createElement("img");
      img.className = "bg-image";
      if (key === state.view) {
        img.classList.add("active");
      }
      img.draggable = false;
      img.alt = `${VIEW_LABELS[key] || key} diagram`;
      img.src = src;
      if (!isMulti) {
        const updateAspect = () => applySingleAspectRatio(img);
        if (img.complete && img.naturalWidth) {
          updateAspect();
        } else {
          img.addEventListener("load", updateAspect, { once: true });
        }
      }
      bgStrip.appendChild(img);
    });

    if (!backgrounds.length && !isMulti) {
      stage.style.removeProperty("aspect-ratio");
    }
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const stripParenthetical = (value) => value.replace(/\s*\([^)]*\)/g, "").trim();

  const GROUPED_VIEWS = new Set(["vertebraes", "sacralc1c2"]);

  const getDisplayLabel = (view, key) => (GROUPED_VIEWS.has(view) ? stripParenthetical(key) : key);

  const buildCoordMap = (view) => {
    if (GROUPED_VIEWS.has(view)) {
  const getDisplayLabel = (view, key) => (view === "vertebraes" ? stripParenthetical(key) : key);

  const buildCoordMap = (view) => {
    if (view === "vertebraes") {
      const grouped = {};
      state.dots[view].forEach((dot) => {
        const label = getDisplayLabel(view, dot.key);
        const point = {
          x: Number(dot.x.toFixed(4)),
          y: Number(dot.y.toFixed(4)),
        };
        if (grouped[label]) {
          if (Array.isArray(grouped[label])) {
            grouped[label].push(point);
          } else {
            grouped[label] = [grouped[label], point];
          }
        } else {
          grouped[label] = point;
        }
      });
      return grouped;
    }

    const map = {};
    state.dots[view].forEach((dot) => {
      map[dot.key] = {
        x: Number(dot.x.toFixed(4)),
        y: Number(dot.y.toFixed(4)),
      };
    });
    return map;
  };

  const updateCoordPreview = () => {
    if (!coordOutput) return;
    if (state.mode !== "drag") {
      coordOutput.value = "";
      if (copyStatus) {
        copyStatus.textContent = "";
      }
      return;
    }
    if (dragViewLabel) {
      dragViewLabel.textContent = VIEW_LABELS[state.view] || state.view;
    }
    coordOutput.value = JSON.stringify(buildCoordMap(state.view), null, 2);
  };

  let dragState = null;

  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", () => {
      const currentView = state.view;
      resetView(currentView);
      state.inReview = false;
      hideCelebration();
      render();
    });
  }

  const startDrag = (event, index) => {
    if (state.mode !== "drag") return;
    event.preventDefault();
    const rect = stage.getBoundingClientRect();
    dragState = {
      pointerId: event.pointerId,
      index,
      view: state.view,
      rect,
    };
    const target = event.currentTarget;
    target.classList.add("dragging");
    target.setPointerCapture(event.pointerId);
    target.addEventListener("pointermove", handleDragMove);
    target.addEventListener("pointerup", handleDragEnd);
    target.addEventListener("pointercancel", handleDragEnd);
  };

  const handleDragMove = (event) => {
    if (state.mode !== "drag") return;
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const { rect, index, view } = dragState;
    const rawX = ((event.clientX - rect.left) / rect.width) * 100;
    const rawY = ((event.clientY - rect.top) / rect.height) * 100;
    const x = clamp(rawX, 0, 100);
    const y = clamp(rawY, 0, 100);
    const dot = state.dots[view][index];
    dot.x = Number(x.toFixed(4));
    dot.y = Number(y.toFixed(4));
    const target = event.currentTarget;
    target.style.left = `${dot.x}%`;
    target.style.top = `${dot.y}%`;
    updateCoordPreview();
  };

  const handleDragEnd = (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const target = event.currentTarget;
    target.releasePointerCapture(event.pointerId);
    target.classList.remove("dragging");
    target.removeEventListener("pointermove", handleDragMove);
    target.removeEventListener("pointerup", handleDragEnd);
    target.removeEventListener("pointercancel", handleDragEnd);
    dragState = null;
    updateCoordPreview();
  };

  const markMissedIfNeeded = (label) => {
    const view = state.view;
    const hadWrong = state.mode === "click" ? state.wrongStreak[view] > 0 : state.typeWrong[view] > 0;
    if (hadWrong && !state.review[view].includes(label)) {
      state.review[view].push(label);
    }
  };

  const advanceOrder = () => {
    const view = state.view;
    state.order[view] = state.order[view].slice(1);
    state.wrongStreak[view] = 0;
    state.typeWrong[view] = 0;
  };

  const render = () => {
    const { view, mode } = state;
    const dots = state.dots[view];
    const labels = LABELS[view];
    const wrong = state.wrongStreak[view];
    const tWrong = state.typeWrong[view];
    const isClick = mode === "click";
    const isType = mode === "type";
    const isDrag = mode === "drag";
    const activeIdx = firstUnansweredIndex(dots);

    if (SKULL_VIEWS.includes(view) && state.skullView !== view) {
      state.skullView = view;
    }
    if (SPINE_VIEWS.includes(view) && state.spineView !== view) {
      state.spineView = view;
    }

    const activeLabel = VIEW_LABELS[view] || view;

    if (viewLabel) {
      viewLabel.textContent = VIEW_LABELS[state.skullView] || state.skullView;
    }
    if (spineLabel) {
      spineLabel.textContent = VIEW_LABELS[state.spineView] || state.spineView;
    }
    if (dragViewLabel) {
      dragViewLabel.textContent = activeLabel;
    }
    if (viewBtn) {
      const skullActive = state.view === state.skullView;
      viewBtn.classList.toggle("primary", skullActive);
      viewBtn.setAttribute("aria-pressed", skullActive ? "true" : "false");
    }
    if (spineBtn) {
      const spineActive = state.view === state.spineView;
      spineBtn.classList.toggle("primary", spineActive);
      spineBtn.setAttribute("aria-pressed", spineActive ? "true" : "false");
    }

    modeClick.classList.toggle("primary", isClick);
    modeType.classList.toggle("primary", isType);
    modeDrag.classList.toggle("primary", isDrag);

    promptBox.hidden = !isClick;
    if (dragMessage) dragMessage.hidden = !isDrag;
    if (dragPanel) dragPanel.hidden = !isDrag;
    if (copyCoordsBtn) copyCoordsBtn.disabled = !isDrag;

    if (typeForm) {
      typeForm.hidden = !isType;
      typeForm.setAttribute("aria-hidden", (!isType).toString());
      typeForm.style.display = isType ? "flex" : "none";
    }
    
    if (typeForm) {
      typeForm.hidden = !isType;
      typeForm.style.display = isType ? "flex" : "none";
    }
    if (dragMessage) dragMessage.hidden = !isDrag;
    if (dragPanel) dragPanel.hidden = !isDrag;
    if (copyCoordsBtn) copyCoordsBtn.disabled = !isDrag;

    if (answerInput) {
      answerInput.disabled = !isType;
      answerInput.setAttribute("aria-disabled", (!isType).toString());
      if (!isType) {
        if (answerInput.value) {
          answerInput.value = "";
        }

        answerInput.blur();
      }
    }

    if (isClick) {
      const currentTarget = state.order[view][0];
      targetEl.textContent = currentTarget ? getDisplayLabel(view, currentTarget) : "—";
      wrongStreakEl.textContent = wrong > 0 ? `Wrong ×${wrong}` : "";
    } else {
      targetEl.textContent = "—";
      wrongStreakEl.textContent = "";
    }

    if (isType) {
      const activeDot = activeIdx !== null ? dots[activeIdx] : null;
      if (typeWrongEl) {
        if (tWrong >= 3 && activeDot) {
          const answerText = getDisplayLabel(view, activeDot.key);
          typeWrongEl.textContent = `Wrong ×${tWrong} — Answer: ${answerText}`;
        } else {
          typeWrongEl.textContent = tWrong > 0 ? `Wrong ×${tWrong}` : "";
        }
      }
      setTimeout(() => {
        if (answerInput) answerInput.focus();
      }, 0);
    } else if (typeWrongEl) {
      typeWrongEl.textContent = "";
    }

    const correctCount = dots.filter((dot) => dot.correct).length;
    progressEl.textContent = `${correctCount}/${labels.length}`;

    const reviewList = state.review[view];
    const allCorrect = dots.every((dot) => dot.correct);
    const showReviewButton = !isDrag && allCorrect && reviewList.length > 0 && !state.inReview;
    startReviewBtn.hidden = !showReviewButton;
    reviewCount.textContent = reviewList.length ? `(${reviewList.length})` : "";
    reviewBadge.hidden = isDrag || !state.inReview;

    const viewCompleted =
      allCorrect && !state.inReview && reviewList.length === 0 && state.mode !== "drag";
    if (viewCompleted) {
      if (!state.completedViews.has(view)) {
        triggerCelebration(view);
      }
    } else if (celebration && !celebration.hidden && state.view === view) {
      if (!state.completedViews.has(view)) {
        hideCelebration();
      }
    }

    renderBackgrounds();

    const { view } = state;
    const dots = state.dots[view];
    const labels = LABELS[view];
    const order = state.order[view];
    const clickTarget = order[0];
    const wrong = state.wrongStreak[view];
    const tWrong = state.typeWrong[view];

    viewLabel.textContent = view;
    modeClick.classList.toggle("primary", state.mode === "click");
    modeType.classList.toggle("primary", state.mode === "type");

    if (state.mode === "click") {
      typeForm.hidden = true;
      promptBox.hidden = false;
      targetEl.textContent = clickTarget || "—";
      wrongStreakEl.textContent = wrong > 0 ? `Wrong ×${wrong}` : "";
    } else {
      typeForm.hidden = false;
      promptBox.hidden = true;
      typeWrongEl.textContent = tWrong > 0 ? `Wrong ×${tWrong}` : "";
      setTimeout(() => answerInput.focus(), 0);
    }

    const correctCount = dots.filter((d) => d.correct).length;
    progressEl.textContent = `${correctCount}/${labels.length}`;

    const reviewList = state.review[view];
    const allCorrect = dots.every((d) => d.correct);
    const showReviewButton = allCorrect && reviewList.length > 0 && !state.inReview;
    startReviewBtn.hidden = !showReviewButton;
    reviewCount.textContent = reviewList.length ? `(${reviewList.length})` : "";
    reviewBadge.hidden = !state.inReview;

    bg.src = IMAGES[view];
    bg.alt = `${view} skull view`;

    wordList.innerHTML = "";
    labels.forEach((label) => {
      const li = document.createElement("li");
      li.textContent = `• ${getDisplayLabel(view, label)}`;
      li.textContent = `• ${label}`;
      wordList.appendChild(li);
    });
    wordCount.textContent = labels.length;

    stage.classList.toggle("drag-mode", isDrag);
    stage.querySelectorAll(".dot, .badge").forEach((el) => el.remove());
    dots.forEach((dot, index) => {
      const classes = ["dot"];
      if (dot.correct) classes.push("correct");
      if (dot.wrong && isClick) classes.push("wrong");
      if (isType && activeIdx === index) classes.push("active");
      if (isDrag) classes.push("draggable");

      const el = document.createElement("div");
      el.className = classes.join(" ");
      el.style.left = `${dot.x}%`;
      el.style.top = `${dot.y}%`;
      el.title = getDisplayLabel(view, dot.key);
      el.addEventListener("click", () => {
        if (!isClick) return;
        if (dot.correct) return;
        const currentTarget = state.order[view][0];
        if (!currentTarget) return;
        const ok = norm(dot.key) === norm(currentTarget);
    stage.querySelectorAll(".dot, .badge").forEach((el) => el.remove());
    const activeIdx = firstUnansweredIndex(dots);
    dots.forEach((dot, index) => {
      const el = document.createElement("div");
      el.className = [
        "dot",
        dot.correct ? "correct" : "",
        dot.wrong && state.mode === "click" ? "wrong" : "",
        state.mode === "type" && activeIdx === index ? "active" : "",
      ]
        .filter(Boolean)
        .join(" ");
      el.style.left = `${dot.x}%`;
      el.style.top = `${dot.y}%`;
      el.title = dot.key;
      el.addEventListener("click", () => {
        if (state.mode !== "click") return;
        if (dot.correct) return;
        if (!order[0]) return;
        const ok = norm(dot.key) === norm(order[0]);
        if (ok) {
          dot.correct = true;
          dot.wrong = false;
          try {
            good.currentTime = 0;
            void good.play();
          } catch (err) {
            // ignore autoplay issues
          }
          flashBadge("Correct!", dot.x, dot.y, "#86efac");
          markMissedIfNeeded(currentTarget);
          markMissedIfNeeded(order[0]);
          advanceOrder();
        } else {
          dot.wrong = true;
          state.wrongStreak[view] += 1;
          try {
            bad.currentTime = 0;
            void bad.play();
          } catch (err) {
            // ignore autoplay issues
          }
          flashBadge("Incorrect", dot.x, dot.y, "#fda4af");
        }
        render();
      });
      el.addEventListener("pointerdown", (event) => {
        startDrag(event, index);
      });
      stage.appendChild(el);
    });

    updateCoordPreview();
      stage.appendChild(el);
    });
  };

  typeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.mode !== "type") return;
    const view = state.view;
    const dots = state.dots[view];
    const idx = firstUnansweredIndex(dots);
    if (idx === null) return;
    const dot = dots[idx];
    const userAnswer = norm(answerInput.value);
    const ok = userAnswer === norm(dot.key);
    if (ok) {
      dot.correct = true;
      dot.wrong = false;
      state.typeWrong[view] = 0;
      answerInput.value = "";
      try {
        good.currentTime = 0;
        void good.play();
      } catch (err) {
        // ignore autoplay issues
      }
      flashBadge("Correct!", dot.x, dot.y, "#86efac");
      markMissedIfNeeded(dot.key);
    } else {
      state.typeWrong[view] += 1;
      try {
        bad.currentTime = 0;
        void bad.play();
      } catch (err) {
        // ignore autoplay issues
      }
      flashBadge("Incorrect", dot.x, dot.y, "#fda4af");
    }
    render();
  });

  startReviewBtn.addEventListener("click", () => {
    const view = state.view;
    const list = state.review[view];
    if (!list.length) return;
    state.dots[view].forEach((dot) => {
      if (list.includes(dot.key)) {
        dot.correct = false;
        dot.wrong = false;
      }
    });
    state.order[view] = [...list];
    state.inReview = true;
    state.completedViews.delete(view);
    hideCelebration();
    render();
  });

  modeClick.addEventListener("click", () => {
    hideCelebration();
    state.mode = "click";
    render();
  });

  modeType.addEventListener("click", () => {
    hideCelebration();
    state.mode = "type";
    render();
  });

  modeDrag.addEventListener("click", () => {
    hideCelebration();
    state.mode = "drag";
    state.inReview = false;
    if (copyStatus) {
      copyStatus.textContent = "";
    }
    render();
  });

  if (copyCoordsBtn) {
    copyCoordsBtn.addEventListener("click", async () => {
      if (state.mode !== "drag" || !coordOutput.value) return;
      try {
        await navigator.clipboard.writeText(coordOutput.value);
        if (copyStatus) {
          copyStatus.textContent = "Copied!";
        }
      } catch (err) {
        try {
          coordOutput.focus();
          coordOutput.select();
          coordOutput.setSelectionRange(0, coordOutput.value.length);
          const successful = document.execCommand("copy");
          if (copyStatus) {
            copyStatus.textContent = successful ? "Copied!" : "Press Ctrl+C to copy.";
          }
        } catch (fallbackError) {
          if (copyStatus) {
            copyStatus.textContent = "Press Ctrl+C to copy.";
          }
        }
      }
      if (copyStatus && copyStatus.textContent) {
        setTimeout(() => {
          copyStatus.textContent = "";
        }, 2500);
      }
    });
  }

  if (viewBtn && viewMenu) {
    viewBtn.addEventListener("click", () => {
      viewMenu.hidden = !viewMenu.hidden;
      if (!viewMenu.hidden && spineMenu) {
        spineMenu.hidden = true;
      }
    });
  }

  if (viewMenu) {
    viewMenu.querySelectorAll(".menu-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedView = btn.getAttribute("data-view");
        state.skullView = selectedView;
        state.view = selectedView;
        state.inReview = false;
        hideCelebration();
        viewMenu.hidden = true;
        if (spineMenu) spineMenu.hidden = true;
        render();
      });
    });
  }

  if (spineBtn && spineMenu) {
    spineBtn.addEventListener("click", () => {
      spineMenu.hidden = !spineMenu.hidden;
      if (!spineMenu.hidden && viewMenu) {
        viewMenu.hidden = true;
      }
    });
  }

  if (spineMenu) {
    spineMenu.querySelectorAll(".menu-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedView = btn.getAttribute("data-view");
        state.spineView = selectedView;
        state.view = selectedView;
        state.inReview = false;
        hideCelebration();
        spineMenu.hidden = true;
        if (viewMenu) viewMenu.hidden = true;
        render();
      });
    });
  }

  document.addEventListener("click", (event) => {
    if (viewBtn && viewMenu && !viewBtn.contains(event.target) && !viewMenu.contains(event.target)) {
      viewMenu.hidden = true;
    }
    if (spineBtn && spineMenu && !spineBtn.contains(event.target) && !spineMenu.contains(event.target)) {
      spineMenu.hidden = true;
    }
  viewBtn.addEventListener("click", () => {
    viewMenu.hidden = !viewMenu.hidden;
  });

  viewMenu.querySelectorAll(".menu-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedView = btn.getAttribute("data-view");
      state.view = selectedView;
      viewLabel.textContent = selectedView;
      viewMenu.hidden = true;
      render();
    });
  });

  document.addEventListener("click", (event) => {
    if (!viewBtn.contains(event.target) && !viewMenu.contains(event.target)) {
      viewMenu.hidden = true;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (viewMenu) viewMenu.hidden = true;
      if (spineMenu) spineMenu.hidden = true;
      viewMenu.hidden = true;
    }
  });

  const initialize = () => {
    render();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
