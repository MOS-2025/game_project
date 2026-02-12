// =================================================
// Detect current level from HTML
// <body data-level="1">
// =================================================
const level = parseInt(document.body.dataset.level);


// =================================================
// Settings
// =================================================
const questionsPerLevel = 3;
const levelTimers = [15, 20, 25, 30, 35];
const timerSeconds = levelTimers[level - 1];



// =================================================
// DOM
// =================================================
const flagImg = document.getElementById("flag");
const guessInput = document.getElementById("guessInput");
const message = document.getElementById("message");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const submitBtn = document.getElementById("submitBtn");


// =================================================
// ⭐ Fisher–Yates Shuffle (true random)
// =================================================
function shuffle(arr) {
  const a = [...arr];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}


// =================================================
// ⭐ MANUAL LEVEL GROUPS (20 each)
// Edit these to control difficulty
// =================================================
const levelGroups = [

  // ================= LEVEL 1 =================
  [
    { name: "France", code: "fr" },
    { name: "Germany", code: "de" },
    { name: "Japan", code: "jp" },
    { name: "Brazil", code: "br" },
    { name: "Canada", code: "ca" },
    { name: "India", code: "in" },
    { name: "Italy", code: "it" },
    { name: "Mexico", code: "mx" },
    { name: "Australia", code: "au" },
    { name: "United States", code: "us" },
    { name: "Spain", code: "es" },
    { name: "United Kingdom", code: "gb" },
    { name: "China", code: "cn" },
    { name: "South Korea", code: "kr" },
    { name: "Argentina", code: "ar" },
    { name: "Netherlands", code: "nl" },
    { name: "Sweden", code: "se" },
    { name: "Norway", code: "no" },
    { name: "Switzerland", code: "ch" },
    { name: "Portugal", code: "pt" }
  ],

  // ================= LEVEL 2 =================
  [
    { name: "Thailand", code: "th" },
    { name: "Vietnam", code: "vn" },
    { name: "Indonesia", code: "id" },
    { name: "Philippines", code: "ph" },
    { name: "Turkey", code: "tr" },
    { name: "Greece", code: "gr" },
    { name: "Poland", code: "pl" },
    { name: "Finland", code: "fi" },
    { name: "Ireland", code: "ie" },
    { name: "Belgium", code: "be" },
    { name: "Austria", code: "at" },
    { name: "Denmark", code: "dk" },
    { name: "Czech Republic", code: "cz" },
    { name: "Hungary", code: "hu" },
    { name: "Romania", code: "ro" },
    { name: "Bulgaria", code: "bg" },
    { name: "Croatia", code: "hr" },
    { name: "Ukraine", code: "ua" },
    { name: "Serbia", code: "rs" },
    { name: "Chile", code: "cl" }
  ],

  // ================= LEVEL 3 =================
  [
    { name: "Colombia", code: "co" },
    { name: "Peru", code: "pe" },
    { name: "Malaysia", code: "my" },
    { name: "Singapore", code: "sg" },
    { name: "New Zealand", code: "nz" },
    { name: "Morocco", code: "ma" },
    { name: "Egypt", code: "eg" },
    { name: "Kenya", code: "ke" },
    { name: "Nigeria", code: "ng" },
    { name: "South Africa", code: "za" },
    { name: "Saudi Arabia", code: "sa" },
    { name: "Israel", code: "il" },
    { name: "Pakistan", code: "pk" },
    { name: "Bangladesh", code: "bd" },
    { name: "Sri Lanka", code: "lk" },
    { name: "Nepal", code: "np" },
    { name: "Jordan", code: "jo" },
    { name: "Qatar", code: "qa" },
    { name: "Panama", code: "pa" },
    { name: "Paraguay", code: "py" }
  ],

  // ================= LEVEL 4 =================
  [
    { name: "Afghanistan", code: "af" },
    { name: "Albania", code: "al" },
    { name: "Algeria", code: "dz" },
    { name: "Armenia", code: "am" },
    { name: "Azerbaijan", code: "az" },
    { name: "Belarus", code: "by" },
    { name: "Bolivia", code: "bo" },
    { name: "North Macedonia", code: "mk" },
    { name: "Cambodia", code: "kh" },
    { name: "Costa Rica", code: "cr" },
    { name: "El Salvador", code: "sv" },
    { name: "Ecuador", code: "ec" },
    { name: "Ethiopia", code: "et" },
    { name: "Georgia", code: "ge" },
    { name: "Ghana", code: "gh" },
    { name: "Guatemala", code: "gt" },
    { name: "Honduras", code: "hn" },
    { name: "Jamaica", code: "jm" },
    { name: "Kazakhstan", code: "kz" },
    { name: "Kuwait", code: "kw" }
  ],

  // ================= LEVEL 5 =================
  [
    { name: "Laos", code: "la" },
    { name: "Lebanon", code: "lb" },
    { name: "Lithuania", code: "lt" },
    { name: "Madagascar", code: "mg" },
    { name: "Mongolia", code: "mn" },
    { name: "Bahrain", code: "bh" },
    { name: "Oman", code: "om" },
    { name: "Tunisia", code: "tn" },
    { name: "Uruguay", code: "uy" },
    { name: "Venezuela", code: "ve" },
    { name: "Yemen", code: "ye" },
    { name: "Zimbabwe", code: "zw" },
    { name: "Estonia", code: "ee" },
    { name: "Latvia", code: "lv" },
    { name: "Malta", code: "mt" },
    { name: "Iceland", code: "is" },
    { name: "Luxembourg", code: "lu" },
    { name: "Slovakia", code: "sk" },
    { name: "Slovenia", code: "si" },
    { name: "Cyprus", code: "cy" }
  ]
];


// =================================================
// ⭐ Randomize INSIDE this level only
// =================================================
const levelCountries = shuffle(levelGroups[level - 1]);


// =================================================
// Game variables
// =================================================
let score = 0;
let index = 0;
let currentCountry;
let timer;
let timeLeft;


// =================================================
// Timer
// =================================================
function startTimer() {
  clearInterval(timer);

  timeLeft = timerSeconds;
  timerEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion(false);
    }
  }, 1000);
}


// =================================================
// Load next flag
// =================================================
function loadFlag() {

  if (index >= questionsPerLevel) {
    finishLevel();
    return;
  }

  currentCountry = levelCountries[index];

  flagImg.src = `https://flagcdn.com/w320/${currentCountry.code}.png`;

  guessInput.value = "";
  message.textContent = "";

  guessInput.focus();

  startTimer();
}


// =================================================
// After answer
// =================================================
function nextQuestion(correct) {

  clearInterval(timer);

  if (correct) {
    score++;
    scoreEl.textContent = score;
    message.textContent = "✅ Correct!";
  } else {
    message.textContent = `❌ ${currentCountry.name}`;
  }

  index++;

  setTimeout(loadFlag, 700);
}


// =================================================
// Guess handler
// =================================================
function checkGuess() {


  // prevent double clicking / multiple submits
  submitBtn.disabled = true;

  const guess = guessInput.value.trim().toLowerCase();
  const answer = currentCountry.name.toLowerCase();

  const isCorrect = guess === answer;

  nextQuestion(isCorrect);

  document.getElementById("guessInput").value= "";


  // re-enable button for next flag
  setTimeout(() => {
    submitBtn.disabled = false;
  }, 800);
}



// =================================================
// Finish level
// =================================================

function finishLevel() {

  clearInterval(timer);

  const requiredScore = 2;

  if (score >= requiredScore) {

    if (level < 5) {
      window.location.href = `level${level + 1}.html`;
    } else {
      message.textContent = "🏆 You completed ALL levels!";
    }

  } else {

    message.textContent = `Retry level (${requiredScore}/3 required)`;

    setTimeout(() => {
      window.location.reload();
    }, 2200);
  }
}


// =================================================
// Events
// =================================================
submitBtn.onclick = checkGuess;

guessInput.addEventListener("keypress", e => {
  if (e.key === "Enter") checkGuess();
});


// =================================================
// Start
// =================================================
loadFlag();
