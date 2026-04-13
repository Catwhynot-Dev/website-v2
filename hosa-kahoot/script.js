const skills = [
  {
    name: "IM Injection",
    steps: [
      "Wash hands or use alcohol-based hand rub.",
      "Prepare equipment and supplies (correct syringe and needle).",
      "Verify MAR with physician order.",
      "Prepare medication from vial using sterile technique.",
      "Greet and identify patient with two identifiers.",
      "Explain procedure and provide privacy.",
      "Apply gloves and position patient.",
      "Select and cleanse injection site; allow to dry.",
      "Insert needle at 90 degrees, aspirate if indicated, and inject slowly.",
      "Withdraw needle, apply gentle pressure, activate safety device, and dispose sharps.",
      "Remove gloves, perform hand hygiene, reposition patient, and document on MAR/notes."
    ]
  },
  {
    name: "Subcutaneous Injection",
    steps: [
      "Wash hands or use alcohol-based hand rub.",
      "Prepare supplies and verify MAR with order.",
      "Prepare medication from vial and verify dose.",
      "Greet, identify patient, explain procedure, and provide privacy.",
      "Apply gloves and position patient comfortably.",
      "Select and cleanse site with alcohol and allow to dry.",
      "Pinch or spread skin; insert needle at 45 to 90 degrees.",
      "Inject medication slowly and steadily.",
      "Withdraw needle, apply gentle pressure, and discard in sharps.",
      "Remove gloves, perform hand hygiene, reposition patient, and document."
    ]
  },
  {
    name: "Intradermal Injection",
    steps: [
      "Wash hands and prepare supplies.",
      "Verify MAR with order and prepare medication correctly.",
      "Greet, identify patient, explain procedure, and provide privacy.",
      "Apply gloves and position arm with selected forearm site.",
      "Cleanse site and allow skin to dry.",
      "Stretch skin and insert needle bevel up at 5 to 15 degrees.",
      "Inject slowly until a small bleb appears.",
      "Withdraw needle at same angle and do not massage.",
      "Discard syringe in sharps, remove gloves, and perform hand hygiene.",
      "Reposition patient and document MAR and assessment."
    ]
  },
  {
    name: "NG Tube",
    steps: [
      "Wash hands and check order for tube type, size, and purpose.",
      "Assemble and test equipment; greet and identify patient.",
      "Explain procedure, provide privacy, wash hands, and apply gloves.",
      "Place patient in Fowler position and drape chest.",
      "Measure tube nose-to-earlobe-to-xiphoid and mark insertion length.",
      "Check nares for obstruction and lubricate 4 to 8 inches of tube.",
      "Insert tube through selected nostril to nasopharynx.",
      "Have patient lower head, sip water, and swallow while advancing tube to mark.",
      "Temporarily secure tube and verify placement per protocol/x-ray confirmation.",
      "Secure tube to nose/gown, ensure comfort, remove gloves, hand hygiene, and document."
    ]
  },
  {
    name: "Catheterization",
    steps: [
      "Wash hands, apply gloves, assemble supplies, and verify order.",
      "Greet and identify patient, assess status/allergies, explain procedure, and provide privacy.",
      "Position patient, place waterproof pad, and provide lighting.",
      "Clean perineal area with soap and water, then remove gloves and hand hygiene.",
      "Open catheter kit and apply sterile gloves.",
      "Drape patient and organize sterile field supplies.",
      "Cleanse meatus with antiseptic using sterile technique.",
      "Lubricate catheter tip and ask patient to bear down gently.",
      "Insert catheter until urine flows and collect specimen/empty bladder.",
      "Withdraw catheter slowly, provide peri-care, dispose supplies, hand hygiene, and document."
    ]
  },
  {
    name: "Sterile Wound Irrigation",
    steps: [
      "Wash hands, verify order, and gather supplies.",
      "Greet/identify patient, explain procedure, and provide privacy.",
      "Don gloves and face/eye protection.",
      "Position patient and place waterproof pad and basin/pouch.",
      "Remove old dressing, discard gloves, and perform hand hygiene.",
      "Open sterile irrigation tray and prepare solution.",
      "Apply sterile gloves and set up dressing materials.",
      "Assess wound drainage, size, and surrounding tissue.",
      "Irrigate from top of wound downward until return is clear.",
      "Pat dry wound edges, apply sterile dressing, remove PPE, hand hygiene, and document."
    ]
  },
  {
    name: "Postmortem Care",
    steps: [
      "Wash hands, verify order, and gather supplies.",
      "Don gloves/gown and identify patient.",
      "Straighten body, support head, and close eyes/mouth per protocol.",
      "Remove jewelry/belongings and document property.",
      "Remove lines/equipment unless otherwise ordered.",
      "Clean soiled areas, place clean incontinence pad, and apply clean dressings.",
      "Pad wrists/ankles and label dentures or glasses if present.",
      "Attach identification tags to body and covering sheet.",
      "Place body in zippered bag and label communicable disease status if indicated.",
      "Remove PPE, perform hand hygiene, and document/report procedure."
    ]
  },
  {
    name: "Post-op Exercises",
    steps: [
      "Wash hands, verify order, gather supplies, greet and identify patient.",
      "Explain procedure, provide privacy, and apply gloves if needed.",
      "Assist patient with incision splinting using pillow/blanket.",
      "Teach turning, coughing, and deep breathing sequence.",
      "Teach huffing breaths in progressive sequence.",
      "Position patient upright for incentive spirometer.",
      "Explain spirometer and set target goal per order.",
      "Have patient cough then take slow deep breaths holding 2 to 5 seconds.",
      "Repeat spirometry 8 to 10 times or until goal/best effort reached.",
      "Remove gloves if used, perform hand hygiene, and document/report findings."
    ]
  },
  {
    name: "PPE",
    steps: [
      "Wash hands or use alcohol-based hand rub.",
      "Don gown fully covering torso/arms and tie at neck/waist.",
      "Apply mask and secure nose bridge.",
      "Apply eyewear/goggles and then clean gloves.",
      "Remove gloves using glove-in-glove technique and discard.",
      "Remove eyewear/goggles by headband/earpieces and discard appropriately.",
      "Untie and remove gown touching inside only.",
      "Remove mask by straps without touching front and discard.",
      "Perform final hand hygiene and maintain standard precautions."
    ]
  }
];

const ui = {
  skills: document.getElementById("skills"),
  skillName: document.getElementById("skillName"),
  progress: document.getElementById("progress"),
  currentStep: document.getElementById("currentStep"),
  choices: document.getElementById("choices"),
  feedback: document.getElementById("feedback"),
  score: document.getElementById("score"),
  correctCount: document.getElementById("correctCount"),
  attempts: document.getElementById("attempts")
};

const state = {
  skillIndex: -1,
  stepIndex: 0,
  score: 0,
  attempts: 0,
  correct: 0
};

function buildSkillButtons() {
  skills.forEach((skill, index) => {
    const button = document.createElement("button");
    button.className = "skill-btn";
    button.textContent = skill.name;
    button.addEventListener("click", () => startSkill(index));
    ui.skills.appendChild(button);
  });
}

function startSkill(index) {
  state.skillIndex = index;
  state.stepIndex = 0;
  state.score = 0;
  state.attempts = 0;
  state.correct = 0;

  [...ui.skills.children].forEach((button, i) => {
    button.classList.toggle("active", i === index);
  });

  ui.feedback.textContent = "";
  ui.feedback.className = "feedback";
  renderQuestion();
  updateScoreboard();
}

function getChoices(skill, stepIndex) {
  const correct = skill.steps[stepIndex + 1];
  const pool = skill.steps.filter((step, i) => i !== stepIndex + 1 && i !== stepIndex);
  const distractors = [];

  let cursor = (stepIndex * 3 + 2) % pool.length;
  while (distractors.length < 3) {
    const candidate = pool[cursor % pool.length];
    if (!distractors.includes(candidate)) distractors.push(candidate);
    cursor += 2;
  }

  const choices = [correct, ...distractors];
  const rotateBy = stepIndex % 4;
  return choices.slice(rotateBy).concat(choices.slice(0, rotateBy));
}

function renderQuestion() {
  const skill = skills[state.skillIndex];

  if (state.stepIndex >= skill.steps.length - 1) {
    ui.currentStep.textContent = "Skill complete.";
    ui.progress.textContent = `Completed ${skill.steps.length - 1}/${skill.steps.length - 1}`;
    ui.choices.innerHTML = "";
    ui.feedback.textContent = "✅ Skill finished. Choose another skill to continue practicing.";
    ui.feedback.className = "feedback good";
    return;
  }

  ui.skillName.textContent = skill.name;
  ui.progress.textContent = `Step ${state.stepIndex + 1}/${skill.steps.length - 1}`;
  ui.currentStep.textContent = skill.steps[state.stepIndex];
  ui.choices.innerHTML = "";

  getChoices(skill, state.stepIndex).forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice;
    btn.addEventListener("click", () => submitAnswer(choice));
    ui.choices.appendChild(btn);
  });
}

function submitAnswer(selected) {
  const skill = skills[state.skillIndex];
  const correct = skill.steps[state.stepIndex + 1];

  state.attempts += 1;

  if (selected === correct) {
    state.score += 10;
    state.correct += 1;
    state.stepIndex += 1;
    ui.feedback.textContent = "Correct! Moving to the next step.";
    ui.feedback.className = "feedback good";
    renderQuestion();
  } else {
    ui.feedback.textContent = "Not quite. Review the current step and try again.";
    ui.feedback.className = "feedback bad";
  }

  updateScoreboard();
}

function updateScoreboard() {
  ui.score.textContent = String(state.score);
  ui.correctCount.textContent = String(state.correct);
  ui.attempts.textContent = String(state.attempts);
}

buildSkillButtons();
