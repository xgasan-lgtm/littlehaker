(() => {
  const STORAGE_KEY = "cg_v1";
  const defaultState = {
    points: 0,
    daysDone: {1:false,2:false,3:false,4:false,5:false},
    bestTypingWPM: 0,
    badges: { mouseHero:false, fileWizard:false, netNinja:false, aiTamer:false, typingMaster:false }
  };

  const load = () => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return structuredClone(defaultState);
      const data = JSON.parse(raw);
      return {
        ...structuredClone(defaultState),
        ...data,
        daysDone: {...defaultState.daysDone, ...(data.daysDone||{})},
        badges: {...defaultState.badges, ...(data.badges||{})},
      };
    }catch{ return structuredClone(defaultState); }
  };
  const save = (st) => localStorage.setItem(STORAGE_KEY, JSON.stringify(st));

  const toast = (msg) => {
    let el = document.querySelector(".toast");
    if(!el){ el = document.createElement("div"); el.className="toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(()=> el.classList.remove("show"), 2200);
  };

  const LEVELS = [
    {name:"Уровень 1: «ф ы в а»", words:["фыва","вафы","аффа","вы","фа","ва"]},
    {name:"Уровень 2: + «о л д ж»", words:["дело","вода","лодка","жало","флот","вол"]},
    {name:"Уровень 3: слова", words:["порог","город","план","флаг","панда","право","друг","мир"]},
    {name:"Уровень 4: фразы", words:["я дома","мама дома","у меня кот","добрый день","я печатаю","я учусь"]},
  ];

  function render(){
    const root = document.getElementById("trainer-root");
    if(!root) return;

    root.innerHTML = `
      <div class="wrap">
        <div class="topbar">
          <div class="brand">
            <div class="logo">⌨️</div>
            <div>
              <h1>Клавиатурный тренажёр</h1>
              <div class="sub">Точность важнее скорости. Скорость придёт 🙂</div>
            </div>
          </div>
          <div class="row">
            <a class="btn secondary" href="cabinet.html">← В кабинет</a>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="row" style="justify-content:space-between">
              <div class="pills">
                <div class="pill">⭐ Очки: <b id="pts">0</b></div>
                <div class="pill">⌛ Время: <b id="time">60</b>с</div>
                <div class="pill">🎯 Точность: <b id="acc">100</b>%</div>
                <div class="pill">🚀 WPM: <b id="wpm">0</b></div>
              </div>
              <div class="row">
                <select id="level" class="btn secondary" style="padding:10px 12px">
                  ${LEVELS.map((l,i)=>`<option value="${i}">${l.name}</option>`).join("")}
                </select>
                <button class="btn" id="start">Старт ▶</button>
                <button class="btn secondary" id="stop">Стоп ⏸</button>
              </div>
            </div>

            <div class="hr"></div>

            <div class="card" style="box-shadow:none">
              <h2 style="margin-top:0">Набери слово/фразу</h2>
              <div class="pill" style="border-radius:16px; font-size:22px; font-weight:900" id="target">Нажми “Старт”</div>
              <div style="height:10px"></div>
              <input id="inp" class="btn secondary" style="width:100%; text-align:left; font-weight:800" placeholder="Печатай здесь…" autocomplete="off" spellcheck="false">
              <div class="note" style="margin-top:10px">Подсказка: смотри на экран. Ошибка — спокойно исправь.</div>
            </div>
          </div>
        </div>
      </div>
      <div class="toast"></div>
    `;
  }

  render();

  const ptsEl = document.getElementById("pts");
  const timeEl = document.getElementById("time");
  const accEl = document.getElementById("acc");
  const wpmEl = document.getElementById("wpm");
  const targetEl = document.getElementById("target");
  const inp = document.getElementById("inp");
  const levelSel = document.getElementById("level");

  let running=false, timer=null;
  let timeLeft=60, totalTyped=0, correctChars=0, points=0, current="";

  const pick = () => {
    const L = LEVELS[+levelSel.value];
    current = L.words[Math.floor(Math.random()*L.words.length)];
    targetEl.textContent = current;
  };

  const stats = () => {
    const acc = totalTyped===0 ? 100 : Math.max(0, Math.round((correctChars/totalTyped)*100));
    const elapsed = 60 - timeLeft;
    const wpm = elapsed<=0 ? 0 : Math.round((correctChars/5)/(elapsed/60));
    accEl.textContent = acc;
    wpmEl.textContent = wpm;
    ptsEl.textContent = points;
    return {acc, wpm};
  };

  const end = () => {
    if(!running) return;
    running=false;
    clearInterval(timer); timer=null;
    inp.blur();

    const {wpm} = stats();
    const st = load();

    if(wpm > st.bestTypingWPM){
      st.bestTypingWPM = wpm;
      st.points += 8;
      save(st);
      toast("Новый рекорд! +8 ⭐");
    }

    if(wpm >= 15 && !st.badges.typingMaster){
      st.badges.typingMaster = true;
      st.points += 10;
      save(st);
      toast("Бейдж «Мастер печати» открыт! +10 ⭐");
    } else {
      save(st);
    }

    toast("Готово! Проверь кабинет 🙂");
  };

  const start = () => {
    running=true;
    timeLeft=60;
    totalTyped=0; correctChars=0; points=0;
    timeEl.textContent = timeLeft;
    inp.value=""; inp.focus();
    pick(); stats();

    clearInterval(timer);
    timer=setInterval(()=>{
      timeLeft--;
      timeEl.textContent=timeLeft;
      stats();
      if(timeLeft<=0) end();
    },1000);
  };

  document.getElementById("start").addEventListener("click", start);
  document.getElementById("stop").addEventListener("click", end);
  levelSel.addEventListener("change", ()=>{ if(!running) pick(); });

  inp.addEventListener("input", ()=>{
    if(!running) return;
    const typed = inp.value;
    const idx = typed.length-1;
    if(idx>=0){
      totalTyped++;
      const last = typed[idx];
      const expected = current[idx];
      if(last === expected){
        correctChars++;
        points += 1;
      }else{
        points = Math.max(0, points-1);
      }
      stats();
    }
    if(typed.length >= current.length){
      if(typed === current) points += 3;
      inp.value="";
      pick();
      stats();
    }
  });

  pick();
})();

