let perfectScores = {};

function showSection(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* LOADING */
window.onload = function(){
  setTimeout(()=>{
    document.getElementById("loadingScreen").style.display="none";
  },1000);
};

/* BANK SOAL */
let questionBank = {
  Easy: [
    {
      q: "Which text usually starts with 'Once upon a time'?",
      opt: ["Narrative", "Procedure", "Notice"],
      a: 0,
      topic: "Narrative"
    },
    {
      q: "What type of text describes a person or place?",
      opt: ["Descriptive", "Recount", "Schedule"],
      a: 0,
      topic: "Descriptive"
    },
    {
      q: "What does 'No Smoking' belong to?",
      opt: ["Notice", "Narrative", "Greeting"],
      a: 0,
      topic: "Notice"
    }
  ],

  Medium: [
    {
      q: "Read: 'Happy Birthday! Wish you all the best.' This text is a...",
      opt: ["Greeting Card", "Label", "Report"],
      a: 0,
      topic: "Greeting"
    },
    {
      q: "Which text gives steps to make fried rice?",
      opt: ["Procedure", "Narrative", "Recount"],
      a: 0,
      topic: "Procedure"
    },
    {
      q: "A school timetable belongs to...",
      opt: ["Schedule", "Advertisement", "Narrative"],
      a: 0,
      topic: "Schedule"
    }
  ],

  Hard: [
    {
      q: "Why does the writer use opinion text?",
      opt: [
        "To express personal thoughts",
        "To tell a story",
        "To describe steps"
      ],
      a: 0,
      topic: "Opinion"
    },
    {
      q: "A recount text mainly tells...",
      opt: [
        "Past experiences",
        "Future plans",
        "Instructions"
      ],
      a: 0,
      topic: "Recount"
    },
    {
      q: "The purpose of advertisement text is...",
      opt: [
        "To persuade people",
        "To entertain",
        "To report facts"
      ],
      a: 0,
      topic: "Advertisement"
    }
  ]
};

/* LEVEL */
let levels = ["Easy","Medium","Hard"];
let levelIndex = 0;
let totalQ = 5;

let quiz = [];
let current = 0, score = 0, answered=false, weak={};
let timer, time;

/* START */
function startQuiz(){
  let currentLevel = levels[levelIndex];

  document.getElementById("level").innerText =
    "PSAJ Level: " + currentLevel;

  quiz = [...questionBank[currentLevel]];

  quiz.sort(() => Math.random() - 0.5);

  current = 0;
  score = 0;
  weak = {};

  clearInterval(timer);

  // timer sesuai ujian
  if(currentLevel === "Easy") time = 300;
  if(currentLevel === "Medium") time = 240;
  if(currentLevel === "Hard") time = 180;

  timer = setInterval(() => {
    time--;
    document.getElementById("timer").innerText = "Time: " + time;

    if(time <= 0){
      clearInterval(timer);
      finish();
    }
  },1000);

  loadQuestion();
}

/* LOAD */
function loadQuestion(){
  answered=false;
  document.getElementById("result").innerText="";

  let q = quiz[current];
  document.getElementById("question").innerText=q.q;

  let html="";
  q.opt.forEach((o,i)=>{
    html += `<div class="option" onclick="checkAnswer(${i})">${o}</div>`;
  });

  document.getElementById("options").innerHTML=html;

  let progress = (current/quiz.length)*100;
  document.getElementById("progressBar").style.width = progress+"%";

  document.getElementById("question").innerText =
  (current+1) + ". " + q.q;
}

/* CHECK */
function checkAnswer(i){
  if(answered) return;
  answered=true;

  let q = quiz[current];

  if(i===q.a){
    score++;
    document.getElementById("result").innerText="✅ Correct";
  } else {
    document.getElementById("result").innerText="❌ Wrong";
    weak[q.topic]=(weak[q.topic]||0)+1;
  }
}

/* NEXT */
function nextQuestion(){
  if(!answered){
    alert("Jawab dulu!");
    return;
  }

  current++;

  if(current < quiz.length){
    loadQuestion();
  } else {
    finish();
  }
}

/* FINISH */
function finish(){
  clearInterval(timer);

  let percent = (score / quiz.length) * 100;
  let isHard = levels[levelIndex] === "Hard";

  let popup = document.getElementById("resultPopup");
  if(popup) popup.classList.remove("hidden");

  let scoreEl = document.getElementById("popupScore");
  if(scoreEl){
    scoreEl.innerText = "Score: " + score + " / " + quiz.length;
  }

  let nextBtn = document.getElementById("popupNextBtn");
  let restartAllBtn = document.getElementById("restartAllBtn");

  if(nextBtn) nextBtn.style.display = "none";
  if(restartAllBtn) restartAllBtn.style.display = "none";

  let title = document.getElementById("popupTitle");
  let msg = document.getElementById("popupMessage");

  if(percent >= 80){
    if(title) title.innerText = "🎉 selamat!";
    if(msg){
      msg.innerText = "level ini telah diselesaikan!";
      msg.style.color = "#22c55e";
    }

    if(!isHard && levelIndex < levels.length - 1){
      setTimeout(()=>{
        levelIndex++;
        closePopup();
        startQuiz();
      },2000);
    }

  } else {
    if(title) title.innerText = "⚠ COBA LAGI";
    if(msg){
      msg.innerText = "score mu dibawa 80% bodoh";
      msg.style.color = "#f43f5e";
    }

    if(nextBtn) nextBtn.style.display = "inline-block";
  }

  if(isHard && restartAllBtn){
    restartAllBtn.style.display = "inline-block";
  }

  // 🔥 SIMPAN PERFECT
  let currentLevel = levels[levelIndex];
  perfectScores[currentLevel] = percent === 100;

  // 🔥 CEK SECRET
  if(isAllPerfect()){
    let normal = document.getElementById("resultPopup");
    let secret = document.getElementById("secretPopup");

    if(normal) normal.classList.add("hidden");
    if(secret) secret.classList.remove("hidden");

    return;
  }

  drawChart(weak);
  saveProgress();
  drawProgressChart();
}

function isAllPerfect(){
  return levels.every(level => perfectScores[level] === true);
}

function openSecret(){
  document.getElementById("secretPopup").classList.add("hidden");
  showSection("secretPage");
}

function goNextLevel(){
  if(levelIndex < levels.length - 1){
    levelIndex++;
  }
  closePopup();
  startQuiz();
}

/* RESTART */
function restart(){
  closePopup();
  startQuiz();
}

function restartAll(){
  levelIndex = 0; // balik ke Easy
  closePopup();
  startQuiz();
}

/* CHART KELEMAHAN */
function drawChart(data){
  let c=document.getElementById("chart");
  let ctx=c.getContext("2d");

  ctx.clearRect(0,0,c.width,c.height);

  let keys=Object.keys(data);
  let values=Object.values(data);
  let max=Math.max(...values,1);

  keys.forEach((k,i)=>{
    let x=40+i*60;
    let h=(values[i]/max)*150;

    ctx.fillStyle="#0ff";
    ctx.fillRect(x,180-h,40,h);

    ctx.fillStyle="black";
    ctx.fillText(k,x,195);
  });
}

/* SAVE PROGRESS */
function saveProgress(){
  let progress = JSON.parse(localStorage.getItem("progress")) || [];

  progress.push({
    level: levels[levelIndex],
    score: score
  });

  localStorage.setItem("progress", JSON.stringify(progress));
}

function closePopup(){
  document.getElementById("resultPopup").classList.add("hidden");
}

/* CHART PROGRESS */
function drawProgressChart(){
  let c=document.getElementById("progressChart");
  let ctx=c.getContext("2d");

  let progress = JSON.parse(localStorage.getItem("progress")) || [];

  ctx.clearRect(0,0,c.width,c.height);

  progress.forEach((p,i)=>{
    let x=40+i*60;
    let h=(p.score/10)*150;

    ctx.fillStyle="#22c55e";
    ctx.fillRect(x,180-h,40,h);

    ctx.fillStyle="black";
    ctx.fillText(p.level,x,195);
  });
}

/* INIT */
startQuiz();