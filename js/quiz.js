(function () {
  if (!window.QUIZ_DATA) {
    console.error(
      "Quiz data is missing. Ensure /js/quiz-data.js loads before /js/quiz.js.",
    );
    const stage = document.getElementById("stage");
    if (stage) {
      const message = document.createElement("div");
      message.className = "quiz-error";
      message.innerHTML =
        "<strong>Quiz data unavailable.</strong><br />Refresh the page or confirm that <code>js/quiz-data.js</code> is deployed.";
      stage.replaceChildren(message);
    }
    return;
  }

  const {
    IMAGES,
    BACKGROUND_LAYOUTS,
    VIEW_LABELS,
    SKULL_VIEWS,
    SPINE_VIEWS,
    APPENDICULAR_VIEWS,
    UPPER_VIEWS,
    DISTAL_VIEWS,
    DEFAULT_SKULL_VIEW,
    DEFAULT_SPINE_VIEW,
    DEFAULT_APPENDICULAR_VIEW,
    DEFAULT_UPPER_VIEW,
    DEFAULT_DISTAL_VIEW,
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
    "atlas",
    "axis",
    "cervical",
    "coccygeal",
    "lumbar",
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
        ((qualifier === "atlas" || qualifier === "axis") &&
          /\barticulation\b/.test(remainder))
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
        .replace(/\s+bone$/, ""),
    );

  const shuffle = (array) => {
    const clone = [...array];
    for (let i = clone.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  };

  const fallbackPosition = (index, total) => {
    if (total <= 1) {
      return { x: 50, y: 50 };
    }
    const columns = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / columns);
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x =
      columns === 1 ? 50 : 10 + (80 / Math.max(columns - 1, 1)) * column;
    const y = rows === 1 ? 50 : 10 + (80 / Math.max(rows - 1, 1)) * row;
    return { x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) };
  };

  const toCoord = (value) => Number(Number(value).toFixed(4));

  const makeDots = (labels, coords) => {
    const usage = {};
    return labels.map((key, index) => {
      const instance = usage[key] || 0;
      usage[key] = instance + 1;
      const preset = coords[key];
      let position;
      if (Array.isArray(preset)) {
        position = preset[instance] || preset[preset.length - 1];
      } else if (
        preset &&
        typeof preset.x === "number" &&
        typeof preset.y === "number"
      ) {
        position = preset;
      } else {
        position = fallbackPosition(index, labels.length);
      }
      return {
        key,
        instance,
        x: toCoord(position.x),
        y: toCoord(position.y),
        correct: false,
        wrong: false,
      };
    });
  };

  const reindexInstances = (view) => {
    const dots = state.dots[view] || [];
    const seen = {};
    dots.forEach((dot) => {
      const next = seen[dot.key] || 0;
      dot.instance = next;
      seen[dot.key] = next + 1;
    });
  };

  const VIEW_KEYS = Object.keys(LABELS);

  const state = {
    view: DEFAULT_SKULL_VIEW,
    skullView: DEFAULT_SKULL_VIEW,
    spineView: DEFAULT_SPINE_VIEW,
    appendicularView: DEFAULT_APPENDICULAR_VIEW,
    upperView: DEFAULT_UPPER_VIEW,
    distalView: DEFAULT_DISTAL_VIEW,
    mode: "click",
    labels: {},
    dots: {},
    order: {},
    wrongStreak: {},
    typeWrong: {},
    review: {},
    inReview: false,
    completedViews: new Set(),
    studyQueue: [],
    studyTotal: 0,
  };

  VIEW_KEYS.forEach((key) => {
    state.labels[key] = [...(LABELS[key] || [])];
  });

  const initViewState = (key, options = {}) => {
    const { preservePositions = false } = options;
    const labels = state.labels[key] || [];
    const coords = COORDS[key] || {};
    if (preservePositions && state.dots[key]) {
      reindexInstances(key);
      const existing = state.dots[key].map((dot) => ({
        ...dot,
        instance:
          typeof dot.instance === "number" && Number.isFinite(dot.instance)
            ? dot.instance
            : 0,
      }));
      const existingUsage = {};
      state.dots[key] = labels.map((label, index) => {
        const instance = existingUsage[label] || 0;
        existingUsage[label] = instance + 1;
        const foundIndex = existing.findIndex(
          (dot) => dot.key === label && dot.instance === instance,
        );
        let position;
        if (foundIndex !== -1) {
          const found = existing[foundIndex];
          position = { x: found.x, y: found.y };
          return {
            key: label,
            instance,
            x: toCoord(position.x),
            y: toCoord(position.y),
            correct: false,
            wrong: false,
          };
        }
        const preset = coords[label];
        const fallback = fallbackPosition(index, labels.length);
        if (Array.isArray(preset)) {
          position = preset[instance] || preset[preset.length - 1] || fallback;
        } else if (
          preset &&
          typeof preset.x === "number" &&
          typeof preset.y === "number"
        ) {
          position = preset;
        } else {
          position = fallback;
        }
        return {
          key: label,
          instance,
          x: toCoord(position.x),
          y: toCoord(position.y),
          correct: false,
          wrong: false,
        };
      });
    } else {
      state.dots[key] = makeDots(labels, coords);
    }
    state.order[key] = shuffle(labels);
    state.wrongStreak[key] = 0;
    state.typeWrong[key] = 0;
    state.review[key] = [];
  };

  VIEW_KEYS.forEach((key) => initViewState(key));

  const wrap = document.querySelector(".wrap");
  const stage = document.getElementById("stage");
  const bgStrip = document.getElementById("bgStrip");
  const viewBtn = document.getElementById("viewBtn");
  const viewMenu = document.getElementById("viewMenu");
  const viewLabel = document.getElementById("viewLabel");
  const spineBtn = document.getElementById("spineBtn");
  const spineMenu = document.getElementById("spineMenu");
  const spineLabel = document.getElementById("spineLabel");
  const appendBtn = document.getElementById("appendBtn");
  const appendMenu = document.getElementById("appendMenu");
  const appendLabel = document.getElementById("appendLabel");
  const upperBtn = document.getElementById("upperBtn");
  const upperMenu = document.getElementById("upperMenu");
  const upperLabel = document.getElementById("upperLabel");
  const distalBtn = document.getElementById("distalBtn");
  const distalMenu = document.getElementById("distalMenu");
  const distalLabel = document.getElementById("distalLabel");
  const modeClick = document.getElementById("modeClick");
  const modeType = document.getElementById("modeType");
  const modeStudy = document.getElementById("modeStudy");
  const modeDrag = document.getElementById("modeDrag");
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
  const wordEditor = document.getElementById("wordEditor");
  const addWordForm = document.getElementById("addWordForm");
  const newWordInput = document.getElementById("newWord");
  const wordEditorList = document.getElementById("wordEditorList");
  const wordEditorStatus = document.getElementById("wordEditorStatus");
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

  const findActiveDotIndex = (view) => {
    const dots = state.dots[view] || [];
    if (state.mode === "study" && state.studyQueue.length) {
      const target = state.studyQueue[0];
      if (target.view === view) {
        const targetIdx = dots.findIndex(
          (dot) => dot.key === target.key && dot.instance === target.instance,
        );
        if (targetIdx !== -1) {
          return targetIdx;
        }
      }
    }
    const order = state.order[view] || [];
    const currentTarget = order[0];
    if (currentTarget) {
      const targetIdx = dots.findIndex(
        (dot) => !dot.correct && dot.key === currentTarget,
      );
      if (targetIdx !== -1) {
        return targetIdx;
      }
    }
    return firstUnansweredIndex(dots);
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
    initViewState(view, { preservePositions: true });
    state.completedViews.delete(view);
  };

  const hideCelebration = () => {
    if (celebration) celebration.hidden = true;
    if (confettiBox) confettiBox.innerHTML = "";
  };

  const triggerStudyCelebration = () => {
    if (!celebration || !confettiBox) return;
    confettiBox.innerHTML = "";
    if (celebrationTitle) {
      celebrationTitle.textContent = "Study session complete!";
    }
    if (celebrationMessage) {
      celebrationMessage.textContent =
        "You cycled through every term across all diagrams.";
    }
    const pieces = 140;
    for (let i = 0; i < pieces; i += 1) {
      const shard = document.createElement("span");
      shard.className = "confetti-piece";
      shard.style.setProperty("--left", `${Math.random() * 100}%`);
      shard.style.setProperty(
        "--delay",
        `${(Math.random() * 0.8).toFixed(2)}s`,
      );
      shard.style.setProperty(
        "--duration",
        `${(2.2 + Math.random() * 1.8).toFixed(2)}s`,
      );
      shard.style.setProperty("--hue", `${Math.floor(Math.random() * 360)}`);
      confettiBox.appendChild(shard);
    }
    celebration.hidden = false;
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
      shard.style.setProperty(
        "--delay",
        `${(Math.random() * 0.8).toFixed(2)}s`,
      );
      shard.style.setProperty(
        "--duration",
        `${(2.2 + Math.random() * 1.8).toFixed(2)}s`,
      );
      shard.style.setProperty("--hue", `${Math.floor(Math.random() * 360)}`);
      confettiBox.appendChild(shard);
    }
    celebration.hidden = false;
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
      bgStrip.appendChild(img);
    });
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const stripParenthetical = (value) =>
    value.replace(/\s*\([^)]*\)/g, "").trim();

  const GROUPED_VIEWS = new Set([
    "vertebraes",
    "sacralc1c2",
    "claviclescapula",
    "thoraciccage",
    "pelvis",
    "handfoot",
  ]);

  const getDisplayLabel = (view, key) =>
    GROUPED_VIEWS.has(view) ? stripParenthetical(key) : key;

  const selectView = (view) => {
    state.view = view;
    if (SKULL_VIEWS.includes(view)) state.skullView = view;
    if (SPINE_VIEWS.includes(view)) state.spineView = view;
    if (APPENDICULAR_VIEWS.includes(view)) state.appendicularView = view;
    if (UPPER_VIEWS.includes(view)) state.upperView = view;
    if (DISTAL_VIEWS.includes(view)) state.distalView = view;
  };

  const buildStudyQueue = () => {
    const queue = [];
    VIEW_KEYS.forEach((key) => {
      (state.dots[key] || []).forEach((dot) => {
        queue.push({ view: key, key: dot.key, instance: dot.instance });
      });
    });
    return shuffle(queue);
  };

  const advanceStudyQueue = () => {
    if (!state.studyQueue.length) return;
    const finished = state.studyQueue.shift();
    if (finished) {
      state.wrongStreak[finished.view] = 0;
      state.typeWrong[finished.view] = 0;
    }
    if (!state.studyQueue.length) {
      triggerStudyCelebration();
      return;
    }
    const next = state.studyQueue[0];
    selectView(next.view);
  };

  const buildCoordMap = (view) => {
    if (GROUPED_VIEWS.has(view)) {
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

  const showEditorMessage = (message) => {
    if (!wordEditorStatus) return;
    wordEditorStatus.textContent = message || "";
  };

  const renderWordManager = (view, isDrag) => {
    if (!wordEditor) return;
    if (!isDrag) {
      wordEditor.hidden = true;
      if (wordEditorList) {
        wordEditorList.innerHTML = "";
      }
      showEditorMessage("");
      return;
    }
    wordEditor.hidden = false;
    if (!wordEditorList) return;
    wordEditorList.innerHTML = "";
    if (!state.dots[view].length) {
      const empty = document.createElement("li");
      empty.className = "editor-item";
      const label = document.createElement("span");
      label.className = "editor-label";
      label.textContent = "No labels yet. Add one above.";
      empty.appendChild(label);
      wordEditorList.appendChild(empty);
      return;
    }
    state.dots[view].forEach((dot, index) => {
      const item = document.createElement("li");
      item.className = "editor-item";

      const label = document.createElement("span");
      label.className = "editor-label";
      label.textContent = getDisplayLabel(view, dot.key);
      item.appendChild(label);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-ghost remove-btn";
      removeBtn.dataset.index = String(index);
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        const removeIndex = Number(removeBtn.dataset.index);
        const removed = removeLabelFromView(view, removeIndex);
        if (removed) {
          showEditorMessage(
            `Removed \u201c${getDisplayLabel(view, dot.key)}\u201d.`,
          );
          render();
        }
      });
      item.appendChild(removeBtn);

      wordEditorList.appendChild(item);
    });
  };

  const toTitleCase = (value) =>
    value
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b([a-z])/g, (match) => match.toUpperCase());

  const addLabelToView = (view, label) => {
    const labels = state.labels[view];
    if (!labels) return { ok: false, message: "Unknown view." };
    const trimmed = label.trim();
    if (!trimmed) {
      return { ok: false, message: "Enter a label name first." };
    }
    const formatted = toTitleCase(trimmed);
    if (!state.dots[view]) {
      state.dots[view] = [];
    }
    if (!state.order[view]) {
      state.order[view] = [];
    }
    if (!state.review[view]) {
      state.review[view] = [];
    }
    const existingCount = state.dots[view].filter(
      (dot) => dot.key === formatted,
    ).length;
    const dot = {
      key: formatted,
      instance: existingCount,
      x: toCoord(50),
      y: toCoord(50),
      correct: false,
      wrong: false,
    };
    labels.push(formatted);
    state.dots[view].push(dot);
    state.order[view].push(formatted);
    if (!state.inReview) {
      state.order[view] = shuffle(state.order[view]);
    }
    state.review[view] = state.review[view].filter(
      (item) => item !== formatted,
    );
    state.completedViews.delete(view);
    state.inReview = false;
    state.wrongStreak[view] = 0;
    state.typeWrong[view] = 0;
    reindexInstances(view);
    return { ok: true, message: `Added \u201c${formatted}\u201d.` };
  };

  const removeLabelFromView = (view, index) => {
    const labels = state.labels[view];
    const dots = state.dots[view] || [];
    state.dots[view] = dots;
    if (!labels || !dots) return false;
    if (Number.isNaN(index) || index < 0 || index >= labels.length)
      return false;
    const [removed] = labels.splice(index, 1);
    const [removedDot] = dots.splice(index, 1);
    const orderList = state.order[view] || [];
    const orderIndex = orderList.indexOf(removed);
    if (orderIndex !== -1) {
      orderList.splice(orderIndex, 1);
    }
    state.order[view] = orderList;
    state.review[view] = state.review[view].filter((item) => item !== removed);
    if (state.inReview && state.review[view].length === 0) {
      state.inReview = false;
    }
    state.completedViews.delete(view);
    state.inReview = false;
    state.wrongStreak[view] = 0;
    state.typeWrong[view] = 0;
    if (removedDot) {
      reindexInstances(view);
    }
    return true;
  };

  let dragState = null;

  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", () => {
      if (state.mode === "study") {
        VIEW_KEYS.forEach((key) => resetView(key));
        state.completedViews.clear();
        state.inReview = false;
        state.studyQueue = buildStudyQueue();
        state.studyTotal = state.studyQueue.length;
        if (state.studyQueue[0]) {
          selectView(state.studyQueue[0].view);
        }
        hideCelebration();
        render();
        return;
      }
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
    const hadWrong =
      state.mode === "type"
        ? state.typeWrong[view] > 0
        : state.wrongStreak[view] > 0;
    if (hadWrong && !state.review[view].includes(label)) {
      state.review[view].push(label);
    }
  };

  const advanceOrder = () => {
    const view = state.view;
    const current = state.order[view] || [];
    const remaining = current.slice(1);
    state.order[view] = state.inReview ? remaining : shuffle(remaining);
    state.wrongStreak[view] = 0;
    state.typeWrong[view] = 0;
  };

  const render = () => {
    let { view, mode } = state;
    if (mode === "study" && state.studyQueue[0]) {
      const queuedView = state.studyQueue[0].view;
      if (queuedView !== view) {
        selectView(queuedView);
        view = queuedView;
      }
    }
    const dots = state.dots[view] || [];
    state.dots[view] = dots;
    const labels = state.labels[view] || [];
    const order = state.order[view] || [];
    state.order[view] = order;
    const wrong = state.wrongStreak[view];
    const tWrong = state.typeWrong[view];
    const isClick = mode === "click";
    const isStudy = mode === "study";
    const isType = mode === "type";
    const isDrag = mode === "drag";
    const activeIdx = findActiveDotIndex(view);

    if (SKULL_VIEWS.includes(view) && state.skullView !== view) {
      state.skullView = view;
    }
    if (SPINE_VIEWS.includes(view) && state.spineView !== view) {
      state.spineView = view;
    }
    if (APPENDICULAR_VIEWS.includes(view) && state.appendicularView !== view) {
      state.appendicularView = view;
    }
    if (UPPER_VIEWS.includes(view) && state.upperView !== view) {
      state.upperView = view;
    }
    if (DISTAL_VIEWS.includes(view) && state.distalView !== view) {
      state.distalView = view;
    }

    const activeLabel = VIEW_LABELS[view] || view;

    if (viewLabel) {
      viewLabel.textContent = VIEW_LABELS[state.skullView] || state.skullView;
    }
    if (spineLabel) {
      spineLabel.textContent = VIEW_LABELS[state.spineView] || state.spineView;
    }
    if (appendLabel) {
      appendLabel.textContent =
        VIEW_LABELS[state.appendicularView] || state.appendicularView;
    }
    if (upperLabel) {
      upperLabel.textContent = VIEW_LABELS[state.upperView] || state.upperView;
    }
    if (distalLabel) {
      distalLabel.textContent =
        VIEW_LABELS[state.distalView] || state.distalView;
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
    if (appendBtn) {
      const appendActive = state.view === state.appendicularView;
      appendBtn.classList.toggle("primary", appendActive);
      appendBtn.setAttribute("aria-pressed", appendActive ? "true" : "false");
    }
    if (upperBtn) {
      const upperActive = state.view === state.upperView;
      upperBtn.classList.toggle("primary", upperActive);
      upperBtn.setAttribute("aria-pressed", upperActive ? "true" : "false");
    }
    if (distalBtn) {
      const distalActive = state.view === state.distalView;
      distalBtn.classList.toggle("primary", distalActive);
      distalBtn.setAttribute("aria-pressed", distalActive ? "true" : "false");
    }

    modeClick.classList.toggle("primary", isClick);
    modeType.classList.toggle("primary", isType);
    modeDrag.classList.toggle("primary", isDrag);
    if (modeStudy) modeStudy.classList.toggle("primary", isStudy);

    const promptActive = isClick || isStudy;
    promptBox.hidden = !promptActive;
    if (dragMessage) dragMessage.hidden = !isDrag;
    if (dragPanel) dragPanel.hidden = !isDrag;
    if (copyCoordsBtn) copyCoordsBtn.disabled = !isDrag;

    if (typeForm) {
      typeForm.hidden = !isType;
      typeForm.setAttribute("aria-hidden", (!isType).toString());
      typeForm.style.display = isType ? "flex" : "none";
    }

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

    if (promptActive) {
      const currentTarget = isStudy ? state.studyQueue[0]?.key : order[0];
      targetEl.textContent = currentTarget
        ? getDisplayLabel(view, currentTarget)
        : "—";
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
    if (progressEl) {
      if (isStudy) {
        const remaining = state.studyQueue.length;
        const completed = Math.max(state.studyTotal - remaining, 0);
        const total = state.studyTotal || remaining || labels.length;
        progressEl.textContent = `${completed}/${total}`;
      } else {
        progressEl.textContent = `${correctCount}/${labels.length}`;
      }
    }

    const reviewList = state.review[view];
    const allCorrect = dots.every((dot) => dot.correct);
    const showReviewButton =
      !isDrag && allCorrect && reviewList.length > 0 && !state.inReview;
    startReviewBtn.hidden = !showReviewButton;
    reviewCount.textContent = reviewList.length ? `(${reviewList.length})` : "";
    reviewBadge.hidden = isDrag || !state.inReview;

    const viewCompleted =
      allCorrect &&
      !state.inReview &&
      reviewList.length === 0 &&
      state.mode !== "drag" &&
      state.mode !== "study";
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

    if (wordList) {
      wordList.innerHTML = "";
      labels.forEach((label) => {
        const li = document.createElement("li");
        li.textContent = `• ${getDisplayLabel(view, label)}`;
        wordList.appendChild(li);
      });
    }
    if (wordCount) {
      wordCount.textContent = labels.length;
    }

    renderWordManager(view, isDrag);

    stage.classList.toggle("drag-mode", isDrag);
    stage.querySelectorAll(".dot, .badge").forEach((el) => el.remove());
    dots.forEach((dot, index) => {
      const classes = ["dot"];
      if (dot.correct) classes.push("correct");
      if (dot.wrong && promptActive) classes.push("wrong");
      if (isType && activeIdx === index) classes.push("active");
      if (isDrag) classes.push("draggable");

      const el = document.createElement("div");
      el.className = classes.join(" ");
      el.style.left = `${dot.x}%`;
      el.style.top = `${dot.y}%`;
      el.title = getDisplayLabel(view, dot.key);
      el.addEventListener("click", () => {
        if (!promptActive) return;
        const studyTarget = isStudy ? state.studyQueue[0] : null;
        const currentTarget = isStudy ? studyTarget?.key : order[0];
        if (!currentTarget) return;
        const matchesInstance = isStudy
          ? studyTarget && dot.instance === studyTarget.instance
          : true;
        const ok = matchesInstance && norm(dot.key) === norm(currentTarget);
        if (ok) {
          dot.correct = true;
          dot.wrong = false;
          state.wrongStreak[view] = 0;
          state.typeWrong[view] = 0;
          try {
            good.currentTime = 0;
            void good.play();
          } catch (err) {
            // ignore autoplay issues
          }
          flashBadge("Correct!", dot.x, dot.y, "#86efac");
          markMissedIfNeeded(currentTarget);
          if (isStudy) {
            advanceStudyQueue();
          } else {
            advanceOrder();
          }
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
  };

  typeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.mode !== "type") return;
    const view = state.view;
    const dots = state.dots[view];
    const idx = findActiveDotIndex(view);
    if (idx === null) return;
    const dot = dots[idx];
    const order = state.order[view] || [];
    const currentTarget = order[0] || dot.key;
    const userAnswer = norm(answerInput.value);
    const ok = userAnswer === norm(currentTarget);
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
      markMissedIfNeeded(currentTarget);
      advanceOrder();
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
    state.studyQueue = [];
    state.studyTotal = 0;
    render();
  });

  modeType.addEventListener("click", () => {
    hideCelebration();
    state.mode = "type";
    state.studyQueue = [];
    state.studyTotal = 0;
    render();
  });

  if (modeStudy) {
    modeStudy.addEventListener("click", () => {
      hideCelebration();
      state.mode = "study";
      state.inReview = false;
      state.studyQueue = buildStudyQueue();
      state.studyTotal = state.studyQueue.length;
      if (state.studyQueue[0]) {
        selectView(state.studyQueue[0].view);
      }
      render();
    });
  }

  modeDrag.addEventListener("click", () => {
    hideCelebration();
    state.mode = "drag";
    state.studyQueue = [];
    state.studyTotal = 0;
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
            copyStatus.textContent = successful
              ? "Copied!"
              : "Press Ctrl+C to copy.";
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

  if (addWordForm) {
    addWordForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!newWordInput) return;
      if (state.mode !== "drag") {
        showEditorMessage("Switch to drag mode to manage labels.");
        return;
      }
      const value = newWordInput.value.trim();
      const result = addLabelToView(state.view, value);
      showEditorMessage(result.message);
      if (result.ok) {
        newWordInput.value = "";
        render();
      }
    });
  }

  if (viewBtn && viewMenu) {
    viewBtn.addEventListener("click", () => {
      viewMenu.hidden = !viewMenu.hidden;
      if (!viewMenu.hidden) {
        if (spineMenu) spineMenu.hidden = true;
        if (appendMenu) appendMenu.hidden = true;
        if (upperMenu) upperMenu.hidden = true;
        if (distalMenu) distalMenu.hidden = true;
      }
    });
  }

  if (viewMenu) {
    viewMenu.querySelectorAll(".menu-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedView = btn.getAttribute("data-view");
        selectView(selectedView);
        state.inReview = false;
        hideCelebration();
        viewMenu.hidden = true;
        if (spineMenu) spineMenu.hidden = true;
        if (distalMenu) distalMenu.hidden = true;
        render();
      });
    });
  }

  if (spineBtn && spineMenu) {
    spineBtn.addEventListener("click", () => {
      spineMenu.hidden = !spineMenu.hidden;
      if (!spineMenu.hidden) {
        if (viewMenu) viewMenu.hidden = true;
        if (appendMenu) appendMenu.hidden = true;
        if (upperMenu) upperMenu.hidden = true;
        if (distalMenu) distalMenu.hidden = true;
      }
    });
  }

  if (appendBtn && appendMenu) {
    appendBtn.addEventListener("click", () => {
      appendMenu.hidden = !appendMenu.hidden;
      if (!appendMenu.hidden) {
        if (viewMenu) viewMenu.hidden = true;
        if (spineMenu) spineMenu.hidden = true;
        if (upperMenu) upperMenu.hidden = true;
      }
    });
  }

  if (upperBtn && upperMenu) {
    upperBtn.addEventListener("click", () => {
      upperMenu.hidden = !upperMenu.hidden;
      if (!upperMenu.hidden) {
        if (viewMenu) viewMenu.hidden = true;
        if (spineMenu) spineMenu.hidden = true;
        if (appendMenu) appendMenu.hidden = true;
        if (distalMenu) distalMenu.hidden = true;
      }
    });
  }

  if (distalBtn && distalMenu) {
    distalBtn.addEventListener("click", () => {
      distalMenu.hidden = !distalMenu.hidden;
      if (!distalMenu.hidden) {
        if (viewMenu) viewMenu.hidden = true;
        if (spineMenu) spineMenu.hidden = true;
        if (appendMenu) appendMenu.hidden = true;
        if (upperMenu) upperMenu.hidden = true;
      }
    });
  }

  if (spineMenu) {
    spineMenu.querySelectorAll(".menu-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedView = btn.getAttribute("data-view");
        selectView(selectedView);
        state.inReview = false;
        hideCelebration();
        spineMenu.hidden = true;
        if (viewMenu) viewMenu.hidden = true;
        if (appendMenu) appendMenu.hidden = true;
        if (distalMenu) distalMenu.hidden = true;
        render();
      });
    });
  }

  if (appendMenu) {
    appendMenu.querySelectorAll(".menu-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedView = btn.getAttribute("data-view");
        selectView(selectedView);
        state.inReview = false;
        hideCelebration();
        appendMenu.hidden = true;
        if (viewMenu) viewMenu.hidden = true;
        if (spineMenu) spineMenu.hidden = true;
        if (upperMenu) upperMenu.hidden = true;
        if (distalMenu) distalMenu.hidden = true;
        render();
      });
    });
  }

  if (upperMenu) {
    upperMenu.querySelectorAll(".menu-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedView = btn.getAttribute("data-view");
        selectView(selectedView);
        state.inReview = false;
        hideCelebration();
        upperMenu.hidden = true;
        if (viewMenu) viewMenu.hidden = true;
        if (spineMenu) spineMenu.hidden = true;
        if (appendMenu) appendMenu.hidden = true;
        if (distalMenu) distalMenu.hidden = true;
        render();
      });
    });
  }

  if (distalMenu) {
    distalMenu.querySelectorAll(".menu-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedView = btn.getAttribute("data-view");
        selectView(selectedView);
        state.inReview = false;
        hideCelebration();
        distalMenu.hidden = true;
        if (viewMenu) viewMenu.hidden = true;
        if (spineMenu) spineMenu.hidden = true;
        if (appendMenu) appendMenu.hidden = true;
        if (upperMenu) upperMenu.hidden = true;
        render();
      });
    });
  }

  document.addEventListener("click", (event) => {
    if (
      viewBtn &&
      viewMenu &&
      !viewBtn.contains(event.target) &&
      !viewMenu.contains(event.target)
    ) {
      viewMenu.hidden = true;
    }
    if (
      spineBtn &&
      spineMenu &&
      !spineBtn.contains(event.target) &&
      !spineMenu.contains(event.target)
    ) {
      spineMenu.hidden = true;
    }
    if (
      appendBtn &&
      appendMenu &&
      !appendBtn.contains(event.target) &&
      !appendMenu.contains(event.target)
    ) {
      appendMenu.hidden = true;
    }
    if (
      upperBtn &&
      upperMenu &&
      !upperBtn.contains(event.target) &&
      !upperMenu.contains(event.target)
    ) {
      upperMenu.hidden = true;
    }
    if (
      distalBtn &&
      distalMenu &&
      !distalBtn.contains(event.target) &&
      !distalMenu.contains(event.target)
    ) {
      distalMenu.hidden = true;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (viewMenu) viewMenu.hidden = true;
      if (spineMenu) spineMenu.hidden = true;
      if (appendMenu) appendMenu.hidden = true;
      if (upperMenu) upperMenu.hidden = true;
      if (distalMenu) distalMenu.hidden = true;
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
