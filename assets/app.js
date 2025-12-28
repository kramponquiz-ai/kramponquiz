(() => {
  const $ = (id) => document.getElementById(id);

  // Basit soru havuzu (örnek). Sonradan bu listeyi büyüteceğiz.
  // Format:
  // { diff: "kolay|orta|zor", q: "Soru?", a: ["A","B","C","D"], c: 0 }  // c doğru şık index
  const QUESTION_BANK = [
    { diff:"kolay", q:"Bir maç normalde kaç dakika sürer (uzatma hariç)?", a:["80","90","100","120"], c:1 },
    { diff:"kolay", q:"Ofsayt kuralı hangi sporda vardır?", a:["Basketbol","Voleybol","Futbol","Hentbol"], c:2 },
    { diff:"kolay", q:"Futbolda kaleci ceza sahası içinde topu elle tutabilir mi?", a:["Evet","Hayır","Sadece kornerde","Sadece faulde"], c:0 },

    { diff:"orta", q:"FIFA Dünya Kupası kaç yılda bir düzenlenir?", a:["2","3","4","5"], c:2 },
    { diff:"orta", q:"Şampiyonlar Ligi finalinde normal sürede beraberlik olursa ne olur?", a:["Maç biter","Uzatma/penaltı","Tekrar maç","Altın gol"], c:1 },
    { diff:"orta", q:"Futbolda sarı kart neyi ifade eder?", a:["Oyundan atılma","Uyarı","Penaltı","Korner"], c:1 },

    { diff:"zor", q:"Bir takım aynı maçta 5 oyuncu değişikliği yapabiliyorsa, bu genelde hangi dönemin kuralıdır?", a:["1930'lar","1970'ler","2020 sonrası","1900'ler"], c:2 },
    { diff:"zor", q:"Libero rolü en çok hangi savunma düzeninde öne çıkar?", a:["3-5-2","4-3-3","5-3-2","2-3-5"], c:3 },
    { diff:"zor", q:"Direkt serbest vuruş ile endirekt serbest vuruşun temel farkı nedir?", a:["Topun rengi","Golün direkt atılabilmesi","Hakemin düdüğü","Baraj sayısı"], c:1 },
  ];

  function shuffle(arr){
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickQuestions(diff, count){
    const pool = QUESTION_BANK.filter(x => x.diff === diff);
    // Pool azsa hepsini al, sonra karıştır
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
    return picked;
  }

  function labelDiff(diff){
    if(diff === "kolay") return "Kolay";
    if(diff === "zor") return "Zor";
    return "Orta";
  }

  // Eğer bu sayfada quizApp yoksa çık
  const quizApp = $("quizApp");
  if(!quizApp) return;

  const setup = $("setup");
  const play = $("play");
  const result = $("result");

  const difficultySel = $("difficulty");
  const countSel = $("questionCount");

  const startBtn = $("startBtn");
  const quitBtn = $("quitBtn");
  const nextBtn = $("nextBtn");
  const retryBtn = $("retryBtn");

  const qPos = $("qPos");
  const diffPill = $("diffPill");
  const scoreEl = $("score");
  const questionText = $("questionText");
  const answersEl = $("answers");
  const resultText = $("resultText");

  let questions = [];
  let idx = 0;
  let score = 0;
  let locked = false;
  let selectedCorrect = false;

  function show(el){ el.classList.remove("hidden"); }
  function hide(el){ el.classList.add("hidden"); }

  function resetGame(){
    idx = 0;
    score = 0;
    locked = false;
    selectedCorrect = false;
    answersEl.innerHTML = "";
    nextBtn.disabled = true;
  }

  function render(){
    const total = questions.length;
    const q = questions[idx];

    qPos.textContent = `${idx+1}/${total}`;
    scoreEl.textContent = `Skor: ${score}`;
    diffPill.textContent = labelDiff(q.diff);

    questionText.textContent = q.q;
    answersEl.innerHTML = "";
    nextBtn.disabled = true;
    locked = false;
    selectedCorrect = false;

    q.a.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.className = "answerBtn";
      btn.type = "button";
      btn.textContent = text;
      btn.addEventListener("click", () => pickAnswer(btn, i, q.c));
      answersEl.appendChild(btn);
    });
  }

  function pickAnswer(btn, pickedIndex, correctIndex){
    if(locked) return;
    locked = true;

    const all = [...answersEl.querySelectorAll(".answerBtn")];
    all.forEach((b, i) => {
      if(i === correctIndex) b.classList.add("correct");
    });

    if(pickedIndex === correctIndex){
      selectedCorrect = true;
      score += 10;
    } else {
      btn.classList.add("wrong");
      selectedCorrect = false;
    }

    scoreEl.textContent = `Skor: ${score}`;
    nextBtn.disabled = false;
  }

  function finish(){
    hide(play);
    show(result);

    const total = questions.length;
    const max = total * 10;
    const pct = Math.round((score / max) * 100);

    resultText.innerHTML = `Skorun: <strong>${score}</strong> / ${max} (${pct}%).`;
  }

  startBtn?.addEventListener("click", () => {
    const diff = difficultySel.value;
    const count = parseInt(countSel.value, 10);

    resetGame();

    // Zorluk havuzu yetmezse, otomatik olarak karışık havuzdan tamamlayalım
    let picked = pickQuestions(diff, count);
    if(picked.length < count){
      const mixed = QUESTION_BANK.filter(x => x.diff !== diff);
      picked = picked.concat(shuffle(mixed).slice(0, count - picked.length));
    }

    questions = shuffle(picked);

    hide(setup);
    hide(result);
    show(play);
    render();
  });

  nextBtn?.addEventListener("click", () => {
    if(idx < questions.length - 1){
      idx += 1;
      render();
    } else {
      finish();
    }
  });

  quitBtn?.addEventListener("click", () => {
    hide(play);
    show(setup);
  });

  retryBtn?.addEventListener("click", () => {
    hide(result);
    show(setup);
  });
})();
