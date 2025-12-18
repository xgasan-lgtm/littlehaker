(() => {
  const STORAGE_KEY = "cg_v2_roblox";
  const defaultState = {
    points: 0,
    bestTypingWPM: 0,
    badges: { typingMaster:false }
  };

  const load = () => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return structuredClone(defaultState);
      const data = JSON.parse(raw);
      return { ...structuredClone(defaultState), ...data, badges:{...defaultState.badges, ...(data.badges||{})} };
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

  function renderCabinet(){
    const root = document.getElementById("cabinet-root");
    if(!root) return;

    const st = load();

    root.innerHTML = `
      <div class="wrap">
        <div class="topbar">
          <div class="brand">
            <div class="logo">CG</div>
            <div>
              <h1>Кабинет</h1>
              <div class="sub">Сейчас готовим Day-страницы. Уже работает тренажёр ⌨️</div>
            </div>
          </div>
          <div class="row">
            <a class="btn secondary" href="index.html">← На главную</a>
            <a class="btn" href="trainer.html">Тренажёр ⌨️</a>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h2>Твой прогресс</h2>
            <div class="pills">
              <div class="pill">⭐ Очки: <b id="pts">${st.points}</b></div>
              <div class="pill">⌨️ Рекорд WPM: <b id="wpm">${st.bestTypingWPM}</b></div>
              <div class="pill">🏅 Бейджи: <b id="bdg">${st.badges.typingMaster ? 1 : 0}</b></div>
            </div>

            <div style="height:12px"></div>
            <div class="note">Очки и рекорды хранятся в этом браузере. Если зайти с другого устройства — будет новый профиль.</div>

            <div class="row" style="margin-top:12px">
              <button class="btn secondary" id="reset">Сбросить</button>
              <button class="btn" id="fakePoints">+10 очков (тест)</button>
            </div>
          </div>

          <div class="card">
            <h2>Миссии (скоро)</h2>
            <div class="tiles">
              <div class="tile"><b>🖱️ Day 1: Windows-старт</b><p>Рабочий стол, окна, запуск программ. Статус: <b>в разработке</b></p></div>
              <div class="tile"><b>📁 Day 2: Файлы и папки</b><p>Создать, переименовать, переместить. Статус: <b>в разработке</b></p></div>
              <div class="tile"><b>🌐 Day 3: Браузер</b><p>Поиск, вкладки, закладки. Статус: <b>в разработке</b></p></div>
              <div class="tile"><b>🛡️ Day 4: Безопасность</b><p>Пароли, ссылки, осторожность. Статус: <b>в разработке</b></p></div>
              <div class="tile"><b>🤖 Day 5: ИИ</b><p>ИИ простыми словами + практика. Статус: <b>в разработке</b></p></div>
              <div class="tile"><b>⌨️ Тренажёр печати</b><p>Уже работает. Прокачивай скорость и точность.</p></div>
            </div>
          </div>
        </div>
      </div>
      <div class="toast"></div>
    `;

    root.querySelector("#reset").addEventListener("click", () => {
      if(confirm("Сбросить очки и рекорды?")){
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    });

    root.querySelector("#fakePoints").addEventListener("click", () => {
      const s = load();
      s.points += 10;
      save(s);
      toast("+10 ⭐ добавлено");
      location.reload();
    });
  }

  document.addEventListener("DOMContentLoaded", renderCabinet);
})();
