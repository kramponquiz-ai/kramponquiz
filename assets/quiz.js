const QUESTIONS = [
  {
    q: "Dünya Kupası’nı en çok kazanan ülke hangisidir?",
    a: ["Brezilya", "Almanya", "İtalya", "Arjantin"],
    c: 0,
    d: "easy"
  },
  {
    q: "Şampiyonlar Ligi tarihinde en çok şampiyon olan kulüp hangisidir?",
    a: ["Real Madrid", "Milan", "Bayern Münih", "Barcelona"],
    c: 0,
    d: "easy"
  },
  {
    q: "Bir maçta oyuncunun gördüğü ‘kırmızı kart’ ne anlama gelir?",
    a: ["Oyundan atılır", "Bir sonraki maç cezalı", "Sarı kart iptali", "Avantaj kuralı"],
    c: 0,
    d: "easy"
  },
  {
    q: "Ofsayt kuralında oyuncu hangi durumda ofsayt sayılır?",
    a: ["Top kendisine atıldığında rakip kaleye en yakın 2. oyuncudan ilerideyse", "Top ayağındayken", "Kendi yarı sahasında", "Kornerde"],
    c: 0,
    d: "medium"
  },
  {
    q: "Ballon d’Or ödülü genel olarak neyi ifade eder?",
    a: ["Yılın en iyi futbolcusu", "En çok gol atan", "En iyi kaleci", "En iyi teknik direktör"],
    c: 0,
    d: "medium"
  },
  {
    q: "Bir futbol maçında normal sürede beraberlik devam ederse (kupa maçında) sıklıkla ne oynanır?",
    a: ["Uzatmalar", "Serbest vuruş", "Taç atışı", "Korner"],
    c: 0,
    d: "medium"
  },
  {
    q: "‘Tiki-taka’ oyun tarzı en çok hangi ülke/ekolle anılır?",
    a: ["İspanya", "Brezilya", "İngiltere", "İtalya"],
    c: 0,
    d: "hard"
  },
  {
    q: "Bir kaleci topu elinde en fazla kaç saniye tutabilir? (IFAB kuralı)",
    a: ["6", "8", "10", "12"],
    c: 0,
    d: "hard"
  }
];

function pickQuestions(diff, count = 5) {
  const pool = QUESTIONS.filter(x => x.d === diff);
  const src = (pool.length >= count) ? pool : QUESTIONS; // yetersizse tüm havuzdan
  const shuffled = [...src].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const nextBtn = document.getElementById("nextBtn");
  const restartBtn = document.getElementById("restartBtn");
  const diffSel = document.getElementById("difficulty");

  const game = document.getElementById("game");
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");
  const feedbackEl = document.getElementById("feedback");
  const scoreEl = document.getElementById("score");
  const qIndexEl = document.getElementById("qIndex");
  const qTotalEl = document.getElementById("qTotal");

  let qs = [];
  let idx = 0;
  let score = 0;
  let locked = false;

  function render() {
    locked = false;
    feedbackEl.textContent = "";
    nextBtn.style.display = "none";

    const cur = qs[idx];
    qIndexEl.textContent = String(idx + 1);
    qTotalEl.textContent = String(qs.length);
    questionEl.textContent = cur.q;

    answersEl.innerHTML = "";
    cur.a.forEach((txt, i) => {
      const btn = document.createElement("button");
      btn.className = "answer";
      btn.type = "button";
      btn.textContent = txt;
      btn.addEventListener("click", () => choose(i));
      answersEl.appendChild(btn);
    });
  }

  function choose(i) {
    if (locked) return;
    locked = true;

    const cur = qs[idx];
    const all = Array.from(answersEl.querySelectorAll(".answer"));
    all.forEach(b => b.disabled = true);

    if (i === cur.c) {
      score += 1;
      scoreEl.textContent = String(score);
      feedbackEl.textContent = "✅ Doğru!";
    } else {
      feedbackEl.textContent = `❌ Yanlış! Doğru cevap: ${cur.a[cur.c]}`;
    }

    nextBtn.style.display = "inline-flex";

    if (idx === qs.length - 1) {
      nextBtn.textContent = "Bitir";
    } else {
      nextBtn.textContent = "Sonraki";
    }
  }

  function finish() {
    questionEl.textContent = "Oyun bitti!";
    answersEl.innerHTML = `<p class="muted">Skorun: <strong>${score}</strong> / ${qs.length}</p>`;
    feedbackEl.textContent = "Tekrar oynamak için Yeniden Başlat’a bas.";
    nextBtn.style.display = "none";
    restartBtn.style.display = "inline-flex";
  }

  startBtn.addEventListener("click", () => {
    const diff = diffSel.value;
    qs = pickQuestions(diff, 5);
    idx = 0;
    score = 0;
    scoreEl.textContent = "0";
    restartBtn.style.display = "none";
    game.style.display = "block";
    render();
    game.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  nextBtn.addEventListener("click", () => {
    if (idx === qs.length - 1) {
      finish();
      return;
    }
    idx += 1;
    render();
  });

  restartBtn.addEventListener("click", () => {
    game.style.display = "none";
    restartBtn.style.display = "none";
    nextBtn.style.display = "none";
    feedbackEl.textContent = "";
    questionEl.textContent = "Quiz";
    answersEl.innerHTML = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
