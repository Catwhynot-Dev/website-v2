(function () {
  if (!window.QUIZ_DATA) {
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

    wordList.innerHTML = "";
    labels.forEach((label) => {
      const li = document.createElement("li");
      li.textContent = `• ${getDisplayLabel(view, label)}`;
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
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (viewMenu) viewMenu.hidden = true;
      if (spineMenu) spineMenu.hidden = true;
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
