(() => {
  // ====== Хранилище прогресса ======
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
    el._t = setTimeout(()=> el.classList.remove("show"), 2300);
  };

  const doneCount = (st) => Object.values(st.daysDone).filter(Boolean).length;

  // ====== Контент уроков (замени VIDEO на свои) ======
  const lessons = {
    1: {
      title: "Windows-старт",
      subtitle: "Рабочий стол, окна, запуск программ",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      taskHtml: `
        <ol>
          <li>Нажми <b>Пуск</b> (внизу слева).</li>
          <li>Открой <b>Paint</b>.</li>
          <li>Нарисуй смайлик 🙂</li>
          <li>Сохрани как <b>smile</b> в <b>Документы</b>.</li>
        </ol>
      `,
      quiz: [
        {q:"Где обычно кнопка «Пуск»?", a:["Сверху справа","Снизу слева","Посередине"], c:1},
        {q:"Что делает «Корзина»?", a:["Хранит удалённое","Открывает игры","Меняет язык"], c:0},
        {q:"Что такое рабочий стол?", a:["Стол в комнате","Экран со значками","Пароль"], c:1},
        {q:"Если что-то не получается…", a:["Паникуй","Повтори шаги и спроси взрослого","Ломай"], c:1},
        {q:"Как выключать ПК правильно?", a:["Выдёргивать вилку","Завершение работы","Стукнуть"], c:1},
      ]
    },
    2: {
      title: "Файлы и папки",
      subtitle: "Создать, переименовать, переместить",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      taskHtml: `
        <ol>
          <li>Создай папку <b>Мой курс</b> в Документах.</li>
          <li>Внутри сделай папку <b>Картинки</b>.</li>
          <li>Перемести туда свой <b>smile</b>.</li>
          <li>Переименуй файл в <b>smile_1</b>.</li>
        </ol>
      `,
      quiz: [
        {q:"Папка нужна чтобы…", a:["Слушать музыку","Хранить файлы по порядку","Ломать ПК"], c:1},
        {q:"Копирование файла — это…", a:["Удаление","Создание второй копии","Переименование"], c:1},
        {q:"Перемещение файла — это…", a:["Перенос в другое место","Изменение цвета","Сон компьютера"], c:0},
        {q:"Удалённое попадает…", a:["В Корзину","На Марс","В монитор"], c:0},
        {q:"Лучшее имя файла…", a:["aaa123","понятное: foto_1","без слов"], c:1},
      ]
    },
    3: {
      title: "Браузер + безопасность",
      subtitle: "Поиск, вкладки, интернет-правила",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      taskHtml: `
        <ol>
          <li>Открой браузер (Chrome/Edge).</li>
          <li>Найди через поиск картинку «кот в очках».</li>
          <li>Открой 2 вкладки и переключись между ними.</li>
          <li>Напиши 3 правила безопасного интернета.</li>
        </ol>
      `,
      quiz: [
        {q:"Кому нельзя говорить пароль?", a:["Родителям","Незнакомцам","Себе"], c:1},
        {q:"Адрес сайта обычно начинается с…", a:["http","pizza","game"], c:0},
        {q:"Подозрительная ссылка — это…", a:["Смешная","С кучей странных букв","Любая"], c:1},
        {q:"Если в интернете страшно/непонятно…", a:["Продолжай один","Скажи взрослому","Скрывай"], c:1},
        {q:"Вкладка — это…", a:["Окно в браузере","Кнопка питания","Папка"], c:0},
      ]
    },
    4: {
      title: "ИИ простыми словами",
      subtitle: "Как ИИ «учится», безопасно пробуем",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      taskHtml: `
        <ol>
          <li>Напиши 3 примера, где ты встречал ИИ (в жизни/играх).</li>
          <li>Сформулируй 2 вежливых вопроса ИИ (как помощнику).</li>
          <li>Запомни правило: ИИ может ошибаться — проверяй.</li>
        </ol>
      `,
      quiz: [
        {q:"ИИ — это…", a:["Волшебство","Программа, которая учится на примерах","Монитор"], c:1},
        {q:"ИИ всегда прав?", a:["Да","Нет, может ошибаться","Только ночью"], c:1},
        {q:"Хороший вопрос ИИ — это…", a:["Очень короткий","Понятный и конкретный","С руганью"], c:1},
        {q:"Личные данные…", a:["Можно всем","Нельзя раздавать","Только в играх"], c:1},
        {q:"ИИ может помогать…", a:["В учёбе","В идеях","И то и другое"], c:2},
      ]
    },
    5: {
      title: "Печать + итог",
      subtitle: "Тренажёр, скорость, точность, награды",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      taskHtml: `
        <ol>
          <li>Зайди в <b>Тренажёр</b> и потренируйся 10 минут.</li>
          <li>Сделай скрин своего результата (WPM и точность).</li>
          <li>Повтори 5 правил безопасности.</li>
        </ol>
      `,
      quiz: [
        {q:"Печатать лучше…", a:["Смотреть на клавиши","Смотреть на экран","Закрыть глаза"], c:1},
        {q:"Ошибся — что делать?", a:["Исправить спокойно","Бросить","Удалить интернет"], c:0},
        {q:"Тренировка 5–10 минут…", a:["Бесполезно","Дает прогресс","Вредит"], c:1},
        {q:"Пароль — это…", a:["Секрет","Шутка","Картинка"], c:0},
        {q:"Главная цель курса…", a:["Понимать ПК и быть в безопасности","Играть 24/7","Сломать мышку"], c:0},
      ]
    }
  };

  // ====== Рендер: Кабинет ======
  function renderCabinet(){
    const root = document.getElementById("cabinet-root");
    if(!root) return;

    const st = load();
    const progress = Math.round(doneCount(st)/5*100);

    const dayMeta = [
      {n:1, icon:"🖱️", name:"Windows-старт", desc:"Рабочий стол, окна, запуск программ", url:"day1.html"},
      {n:2, icon:"📁", name:"Файлы и папки", desc:"Создать, переименовать, переместить", url:"day2.html"},
      {n:3, icon:"🛡️", name:"Браузер + безопасность", desc:"Поиск, вкладки, правила", url:"day3.html"},
      {n:4, icon:"🤖", name:"ИИ простыми словами", desc:"Как ИИ учится, пробуем", url:"day4.html"},
      {n:5, icon:"⌨️", name:"Печать + итог", desc:"Тренажёр и награды", url:"day5.html"},
    ];

    const badges = [
      {k:"mouseHero", icon:"🖱️", name:"Супер-мышка", rule:"Пройди День 1"},
      {k:"fileWizard", icon:"📁", name:"Маг папок", rule:"Пройди День 2"},
      {k:"netNinja", icon:"🛡️", name:"Интернет-ниндзя", rule:"Пройди День 3"},
      {k:"aiTamer", icon:"🤖", name:"Дрессировщик ИИ", rule:"Пройди День 4"},
      {k:"typingMaster", icon:"⌨️", name:"Мастер печати", rule:"WPM ≥ 15 в тренажёре"},
    ];

    root.innerHTML = `
      <div class="wrap">
        <div class="topbar">
          <div class="brand">
            <div class="logo">🤖</div>
            <div>
              <h1>Кабинет курса</h1>
              <div class="sub">Проходи дни по очереди, собирай очки и бейджи.</div>
            </div>
          </div>
          <div class="pills">
            <div class="pill">⭐ Очки: <b id="pts">${st.points}</b></div>
            <div class="pill">✅ Пройдено: <b id="done">${doneCount(st)}/5</b></div>
            <div class="pill">⌨️ Рекорд WPM: <b id="wpm">${st.bestTypingWPM}</b></div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h2>Прогресс</h2>
            <div class="progress"><div style="width:${progress}%"></div></div>
            <div class="note" style="margin-top:10px">Прогресс хранится в этом браузере. На другом компьютере будет ноль.</div>
            <div class="row" style="margin-top:10px">
              <a class="btn" href="trainer.html">Открыть тренажёр ⌨️</a>
              <button class="btn secondary" id="reset">Сбросить прогресс</button>
            </div>
          </div>

          <div class="card">
            <h2>Дни курса</h2>
            <div class="days" id="days"></div>
          </div>

          <div class="card">
            <h2>Бейджи</h2>
            <div class="badges" id="badges"></div>
          </div>
        </div>
      </div>
      <div class="toast"></div>
    `;

    // days
    const daysEl = root.querySelector("#days");
    dayMeta.forEach(d => {
      const done = !!st.daysDone[d.n];
      const locked = d.n>1 && !st.daysDone[d.n-1];
      const btnText = done ? "Повторить" : (locked ? "Закрыто" : "Начать");

      const el = document.createElement("div");
      el.className = "day";
      el.innerHTML = `
        <div>
          <div class="top">
            <div class="name">День ${d.n}: ${d.name}</div>
            <div class="badge">${done ? "✅ Пройдено" : d.icon}</div>
          </div>
          <div class="desc">${d.desc}</div>
        </div>
        <div class="row" style="justify-content:space-between">
          <span class="mini">${locked ? "сначала пройди прошлый день" : (done ? "можно повторять" : "готово к старту")}</span>
          <a class="btn ${locked ? "secondary":""}" href="${locked ? "javascript:void(0)" : d.url}">${btnText}</a>
        </div>
      `;
      if(locked){
        el.querySelector("a").addEventListener("click", ()=>toast("Сначала пройди предыдущий день 🙂"));
      }
      daysEl.appendChild(el);
    });

    // badges
    const badEl = root.querySelector("#badges");
    badges.forEach(b => {
      const unlocked = !!st.badges[b.k];
      const el = document.createElement("div");
      el.className = "b" + (unlocked ? "" : " locked");
      el.innerHTML = `
        <div class="icon">${b.icon}</div>
        <div>
          <div style="font-weight:900">${b.name} ${unlocked?"✅":"🔒"}</div>
          <div class="mini">${b.rule}</div>
        </div>
      `;
      badEl.appendChild(el);
    });

    // reset
    root.querySelector("#reset").addEventListener("click", ()=>{
      if(confirm("Сбросить прогресс и очки?")){
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    });
  }

  // ====== Рендер: Урок ======
  function renderLesson(){
    const root = document.getElementById("lesson-root");
    if(!root) return;

    const day = Number(root.dataset.day);
    const L = lessons[day];
    if(!L){
      root.innerHTML = `<div class="wrap"><div class="card">Нет контента для этого дня.</div></div>`;
      return;
    }

    const st = load();
    const isDone = !!st.daysDone[day];
    const next = day < 5 ? `day${day+1}.html` : "cabinet.html";

    root.innerHTML = `
      <div class="wrap">
        <div class="topbar">
          <div class="brand">
            <div class="logo">${day===5?"⌨️":"🤖"}</div>
            <div>
              <h1>День ${day}: ${L.title}</h1>
              <div class="sub">${L.subtitle}</div>
            </div>
          </div>
          <div class="row">
            <a class="btn secondary" href="cabinet.html">← В кабинет</a>
            <button class="btn" id="mark">${isDone ? "Уже пройдено ✅" : "Я прошёл день ✅"}</button>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h2>1) Видео</h2>
            <div class="video"><iframe src="${L.video}" allowfullscreen></iframe></div>
            <div class="note" style="margin-top:10px">Сначала посмотри, потом повтори действия на своём компьютере.</div>
          </div>

          <div class="card">
            <h2>2) Задание</h2>
            <div class="task">${L.taskHtml}</div>
          </div>

          <div class="card">
            <h2>3) Квиз</h2>
            <div class="quiz" id="quiz"></div>
            <div class="row" style="margin-top:10px">
              <button class="btn secondary" id="check">Проверить</button>
              <div class="pill">Результат: <b id="res">—</b></div>
            </div>
          </div>

          <div class="card">
            <h2>4) Дальше</h2>
            <div class="row">
              <a class="btn" href="${day===5 ? "trainer.html" : next}">${day===5 ? "К тренажёру ⌨️" : "Следующий день →"}</a>
              <a class="btn secondary" href="cabinet.html">В кабинет</a>
            </div>
            <div class="note" style="margin-top:10px">Чтобы открыть следующий день в кабинете — нажми «Я прошёл день».</div>
          </div>
        </div>
      </div>
      <div class="toast"></div>
    `;

    // quiz render
    const quizEl = root.querySelector("#quiz");
    L.quiz.forEach((it, idx) => {
      const q = document.createElement("div");
      q.className = "q";
      q.innerHTML = `<b>${idx+1}. ${it.q}</b><div class="opt" id="opt${idx}"></div>`;
      quizEl.appendChild(q);

      const opt = q.querySelector(".opt");
      it.a.forEach((ans, aIdx) => {
        const b = document.createElement("button");
        b.textContent = ans;
        b.addEventListener("click", () => {
          opt.querySelectorAll("button").forEach(x => { x.dataset.sel="0"; x.style.outline="none"; });
          b.dataset.sel="1";
          b.style.outline = "2px solid rgba(124,92,255,.85)";
        });
        opt.appendChild(b);
      });
    });

    root.querySelector("#check").addEventListener("click", () => {
      let score = 0;
      L.quiz.forEach((it, idx) => {
        const opt = root.querySelector("#opt"+idx);
        const btns = [...opt.querySelectorAll("button")];
        const sel = btns.findIndex(b => b.dataset.sel==="1");
        btns.forEach(b => b.classList.remove("correct","wrong"));
        if(sel === it.c){
          score++;
          btns[sel]?.classList.add("correct");
        } else {
          if(sel>=0) btns[sel].classList.add("wrong");
          btns[it.c]?.classList.add("correct");
        }
      });
      const pts = score * 3;
      root.querySelector("#res").textContent = `${score}/${L.quiz.length} (+${pts}⭐ если засчитаешь день)`;
      toast(score >= 4 ? "Супер! 🏆" : "Норм! Можно ещё раз 🙂");
    });

    root.querySelector("#mark").addEventListener("click", () => {
      const st2 = load();
      if(st2.daysDone[day]){ toast("Этот день уже засчитан ✅"); return; }

      st2.daysDone[day] = true;

      // начисление: фикс + бонус за хороший квиз (если ≥4/5)
      let score = 0;
      L.quiz.forEach((it, idx) => {
        const opt = root.querySelector("#opt"+idx);
        const btns = [...opt.querySelectorAll("button")];
        const sel = btns.findIndex(b => b.dataset.sel==="1");
        if(sel === it.c) score++;
      });

      st2.points += 10;
      if(score >= 4) st2.points += 5;

      if(day===1) st2.badges.mouseHero = true;
      if(day===2) st2.badges.fileWizard = true;
      if(day===3) st2.badges.netNinja = true;
      if(day===4) st2.badges.aiTamer = true;

      save(st2);
      toast("День засчитан! Открой кабинет 🙂");
      root.querySelector("#mark").textContent = "Уже пройдено ✅";
    });
  }

  // ====== Инициализация ======
  document.addEventListener("DOMContentLoaded", () => {
    renderCabinet();
    renderLesson();
  });
})();
