(function () {
  const IMAGES = {
    anterior: "https://raw.githubusercontent.com/Catwhynot-Dev/stuffsforschool/main/anteriorskull.png",
    inferior: "https://raw.githubusercontent.com/Catwhynot-Dev/stuffsforschool/main/inferiorskull.png",
    lateral: "https://raw.githubusercontent.com/Catwhynot-Dev/stuffsforschool/main/lateralskull.png",
    vertebralcolumn: "https://raw.githubusercontent.com/Catwhynot-Dev/stuffsforschool/main/vertebralcolumn.jpeg",
    vertebraes: "https://raw.githubusercontent.com/Catwhynot-Dev/stuffsforschool/main/vertebraes.jpeg",
    sacralc1c2: "https://raw.githubusercontent.com/Catwhynot-Dev/stuffsforschool/main/sacralc1c2.jpeg",
  };

  const SPINE_IMAGE_STRIP = [
    { key: "vertebralcolumn", src: IMAGES.vertebralcolumn },
    { key: "vertebraes", src: IMAGES.vertebraes },
    { key: "sacralc1c2", src: IMAGES.sacralc1c2 },
  ];

  const BACKGROUND_LAYOUTS = {
    anterior: [{ key: "anterior", src: IMAGES.anterior }],
    inferior: [{ key: "inferior", src: IMAGES.inferior }],
    lateral: [{ key: "lateral", src: IMAGES.lateral }],
    vertebralcolumn: SPINE_IMAGE_STRIP,
    vertebraes: SPINE_IMAGE_STRIP,
    sacralc1c2: SPINE_IMAGE_STRIP,
  };

  const VIEW_LABELS = {
    anterior: "Anterior skull",
    inferior: "Inferior skull",
    lateral: "Lateral skull",
    vertebralcolumn: "Vertebral column",
    vertebraes: "Typical vertebra",
    sacralc1c2: "Sacrum / C1 / C2",
  };

  const SKULL_VIEWS = ["anterior", "inferior", "lateral"];
  const SPINE_VIEWS = ["vertebralcolumn", "vertebraes", "sacralc1c2"];
  const DEFAULT_SKULL_VIEW = "anterior";
  const DEFAULT_SPINE_VIEW = "vertebralcolumn";

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
    vertebralcolumn: [
      "Cervical region (C₁–C₇)",
      "Thoracic region (T₁–T₁₂)",
      "Lumbar region (L₁–L₅)",
      "Sacral region",
      "Coccygeal region",
      "Sacrum",
      "Coccyx",
    ],
    vertebraes: [
      "Vertebral arch (cervical)",
      "Vertebral foramen (cervical)",
      "Vertebral body (cervical)",
      "Spinous process (cervical)",
      "Lamina (cervical 1)",
      "Pedicle (cervical 1)",
      "Transverse process (cervical 1)",
      "Superior articular process (cervical 1)",
      "Superior articular facet (cervical 1)",
      "Transverse foramen (cervical 1)",
      "Vertebral foramen (thoracic)",
      "Vertebral body (thoracic)",
      "Spinous process (thoracic)",
      "Transverse process (thoracic 1)",
      "Superior costal facet for superior rib (1)",
      "Transverse costal facet for inferior rib (1)",
      "Vertebral foramen (lumbar)",
      "Vertebral body (lumbar)",
      "Spinous process (lumbar)",
      "Lamina (lumbar 1)",
      "Lamina (lumbar 2)",
      "Pedicle (lumbar 1)",
      "Pedicle (lumbar 2)",
      "Transverse process (lumbar 1)",
      "Transverse process (lumbar 2)",
      "Superior articular process (lumbar 2)",
      "Superior articular facet (lumbar 1)",
      "Superior articular facet (lumbar 2)",
    ],
    sacralc1c2: [
      "Articulates with occipital condyles",
      "Articulates with axis (C₂)",
      "Transverse ligament",
      "Vertebral foramen (atlas)",
      "Anterior arch",
      "Posterior arch",
      "Superior articular facet (atlas 1)",
      "Superior articular facet (atlas 2)",
      "Transverse foramen (atlas 1)",
      "Transverse foramen (atlas 2)",
      "Dens (odontoid process)",
      "Vertebral body (axis)",
      "Spinous process (axis)",
      "Superior articular facet (axis 1)",
      "Superior articular facet (axis 2)",
      "Articulates with atlas",
      "Articular process",
      "Entrance to sacral canal",
      "Median sacral crest",
      "Sacral hiatus",
      "Sacral foramina (posterior 1)",
      "Sacral foramina (posterior 2)",
      "Coccyx (posterior)",
      "Base",
      "Sacral promontory",
      "Sacral foramina (anterior 1)",
      "Sacral foramina (anterior 2)",
      "Apex",
      "Coccyx (anterior)",
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

  const COORDS_VERTEBRALCOLUMN = {
    "Cervical region (C₁–C₇)": { x: 12.1697, y: 17.5926 },
    "Thoracic region (T₁–T₁₂)": { x: 7.9277, y: 41.8482 },
    "Lumbar region (L₁–L₅)": { x: 11.1266, y: 73.2208 },
    "Sacral region": { x: 8.1363, y: 90.9405 },
    "Coccygeal region": { x: 24.4089, y: 96.3145 },
    "C1–C7 (Cervical vertebrae)": { x: 24.8261, y: 18.1736 },
    "T1–T12 (Thoracic vertebrae)": { x: 24.8957, y: 43.8816 },
    "L1–L5 (Lumbar vertebrae)": { x: 25.1043, y: 71.9136 },
  };
  const COORDS_VERTEBRAES = {
    "Vertebral arch (cervical)": { x: 46.1057, y: 7.2803 },
    "Vertebral foramen (cervical)": { x: 46.3839, y: 78.4495 },
    "Vertebral body (cervical)": { x: 45.8275, y: 86.8736 },
    "Spinous process (cervical)": { x: 46.2448, y: 65.9586 },
    "Lamina (cervical 1)": { x: 45.0626, y: 74.6732 },
    "Pedicle (cervical 1)": { x: 49.235, y: 78.5948 },
    "Transverse process (cervical 1)": { x: 52.573, y: 76.1256 },
    "Superior articular process (cervical 1)": { x: 50.1391, y: 72.4946 },
    "Superior articular facet (cervical 1)": { x: 49.5132, y: 72.785 },
    "Transverse foramen (cervical 1)": { x: 50.4868, y: 18.0283 },
    "Vertebral foramen (thoracic)": { x: 46.662, y: 12.6543 },
    "Vertebral body (thoracic)": { x: 46.7316, y: 18.3188 },
    "Spinous process (thoracic)": { x: 44.9235, y: 26.7429 },
    "Transverse process (thoracic 1)": { x: 48.9569, y: 36.0385 },
    "Superior costal facet for superior rib (1)": { x: 48.5396, y: 46.3508 },
    "Transverse costal facet for inferior rib (1)": { x: 51.1127, y: 34.2956 },
    "Vertebral foramen (lumbar)": { x: 44.993, y: 42.1387 },
    "Vertebral body (lumbar)": { x: 44.6453, y: 50.5628 },
    "Spinous process (lumbar)": { x: 46.4534, y: 5.2469 },
    "Lamina (lumbar 1)": { x: 48.1919, y: 9.459 },
    "Lamina (lumbar 2)": { x: 43.5327, y: 35.8932 },
    "Pedicle (lumbar 1)": { x: 42.8373, y: 14.833 },
    "Pedicle (lumbar 2)": { x: 47.7051, y: 41.9935 },
    "Transverse process (lumbar 1)": { x: 40.8901, y: 15.2687 },
    "Transverse process (lumbar 2)": { x: 39.9166, y: 75.8351 },
    "Superior articular process (lumbar 2)": { x: 51.7385, y: 13.0901 },
    "Superior articular facet (lumbar 1)": { x: 50.9736, y: 14.3972 },
    "Superior articular facet (lumbar 2)": { x: 42.2809, y: 39.2338 },
  };
  const COORDS_SACRALC1C2 = {
    "Articulates with occipital condyles": { x: 48.7483, y: 49.6914 },
    "Articulates with axis (C₂)": { x: 71.0014, y: 27.0334 },
    "Transverse ligament": { x: 74.2698, y: 20.3522 },
    "Vertebral foramen (atlas)": { x: 48.5396, y: 49.8366 },
    "Anterior arch": { x: 48.8178, y: 49.6914 },
    "Posterior arch": { x: 48.9569, y: 49.9818 },
    "Superior articular facet (atlas 1)": { x: 48.6787, y: 49.6914 },
    "Superior articular facet (atlas 2)": { x: 48.331, y: 49.4009 },
    "Transverse foramen (atlas 1)": { x: 48.6092, y: 49.6914 },
    "Transverse foramen (atlas 2)": { x: 48.6092, y: 49.8366 },
    "Dens (odontoid process)": { x: 72.879, y: 18.0283 },
    "Vertebral body (axis)": { x: 48.4701, y: 48.8199 },
    "Spinous process (axis)": { x: 48.4701, y: 48.9651 },
    "Superior articular facet (axis 1)": { x: 48.5396, y: 49.1104 },
    "Superior articular facet (axis 2)": { x: 48.4701, y: 49.4009 },
    "Articulates with atlas": { x: 75.1739, y: 32.5527 },
    "Articular process": { x: 67.4548, y: 53.3224 },
    "Entrance to sacral canal": { x: 70.0974, y: 54.9201 },
    "Median sacral crest": { x: 77.6773, y: 72.0588 },
    "Sacral hiatus": { x: 70.0278, y: 75.5447 },
    "Sacral foramina (posterior 1)": { x: 49.235, y: 48.9651 },
    "Sacral foramina (posterior 2)": { x: 48.6787, y: 49.5461 },
    "Coccyx (posterior)": { x: 48.8178, y: 47.5127 },
    "Base": { x: 94.1586, y: 51.5795 },
    "Sacral promontory": { x: 93.3241, y: 54.4844 },
    "Sacral foramina (anterior 1)": { x: 48.1919, y: 47.658 },
    "Sacral foramina (anterior 2)": { x: 83.936, y: 71.3326 },
    "Apex": { x: 93.9499, y: 81.6449 },
    "Coccyx (anterior)": { x: 81.9889, y: 84.114 },
  };

  const COORDS = {
    anterior: COORDS_ANTERIOR,
    inferior: COORDS_INFERIOR,
    lateral: COORDS_LATERAL,
    vertebralcolumn: COORDS_VERTEBRALCOLUMN,
    vertebraes: COORDS_VERTEBRAES,
    sacralc1c2: COORDS_SACRALC1C2,
  };

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

  const norm = (s) =>
    replaceSubscripts(s)
      .toLowerCase()
      .replace(/\bsub\s*(\d)/g, "$1")
      .replace(/\bregion\b/g, "")
      .replace(/\([^)]*\)/g, "")
      .replace(/[–—−-]/g, "")
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
  };

  VIEW_KEYS.forEach((key) => {
    state.dots[key] = makeDots(LABELS[key], COORDS[key] || {});
    state.order[key] = shuffle(LABELS[key]);
    state.wrongStreak[key] = 0;
    state.typeWrong[key] = 0;
    state.review[key] = [];
  });

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
    typeForm.hidden = !isType;
    if (dragMessage) dragMessage.hidden = !isDrag;
    if (dragPanel) dragPanel.hidden = !isDrag;
    if (copyCoordsBtn) copyCoordsBtn.disabled = !isDrag;

    if (isClick) {
      const currentTarget = state.order[view][0];
      targetEl.textContent = currentTarget ? getDisplayLabel(view, currentTarget) : "—";
      wrongStreakEl.textContent = wrong > 0 ? `Wrong ×${wrong}` : "";
    } else {
      targetEl.textContent = "—";
      wrongStreakEl.textContent = "";
    }

    if (isType) {
      typeWrongEl.textContent = tWrong > 0 ? `Wrong ×${tWrong}` : "";
      setTimeout(() => answerInput.focus(), 0);
    } else {
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
    const activeIdx = firstUnansweredIndex(dots);

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
    render();
  });

  modeClick.addEventListener("click", () => {
    state.mode = "click";
    render();
  });

  modeType.addEventListener("click", () => {
    state.mode = "type";
    render();
  });

  modeDrag.addEventListener("click", () => {
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
