// A busca da wiki das cartas (docs/PATCH-NOTES.md): o que se digita acha a carta pelo nome, pelo
// que ela faz, pela escola ou pela raridade (sem acento e sem maiúscula); um filtro de cada vez
// (de novo no mesmo, nenhum). Uma carta pedida pelo endereço (#magica-void) acende, e uma busca
// pelo endereço (?q=veneno) já vem feita. Um clique na carta a abre grande, sozinha.
(function () {
  const wiki = document.querySelector(".wiki");
  if (!wiki) return;
  const busca = wiki.querySelector(".busca");
  const botoes = [...wiki.querySelectorAll(".filtro-carta")];
  const cartas = [...wiki.querySelectorAll(".wcarta")];
  const secoes = [...wiki.querySelectorAll(".wiki-secao")];
  const contagem = wiki.querySelector(".contagem .n");
  const vazio = wiki.querySelector(".vazio-cartas");
  const sem = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  cartas.forEach((c) => (c.dataset.sem = sem(c.dataset.busca)));
  let filtro = null;

  function aplica() {
    const palavras = sem(busca.value).split(/\s+/).filter(Boolean);
    let n = 0;
    cartas.forEach((c) => {
      const passa = (!filtro || c.dataset.tipo === filtro || c.dataset.raridade === filtro) && palavras.every((p) => c.dataset.sem.includes(p));
      c.hidden = !passa;
      n += passa ? 1 : 0;
    });
    secoes.forEach((s) => {
      const vistas = s.querySelectorAll(".wcarta:not([hidden])").length;
      s.hidden = vistas === 0;
      s.querySelector(".n-secao").textContent = vistas;
    });
    botoes.forEach((b) => b.setAttribute("aria-pressed", b.dataset.filtro === filtro ? "true" : "false"));
    contagem.textContent = n;
    vazio.hidden = n > 0;
  }

  busca.addEventListener("input", aplica);
  botoes.forEach((b) =>
    b.addEventListener("click", () => {
      filtro = filtro === b.dataset.filtro ? null : b.dataset.filtro;
      aplica();
    })
  );
  // (a busca pelo endereço, para mandar a alguém: cartas.html?q=veneno)
  const q = new URLSearchParams(location.search).get("q");
  if (q) {
    busca.value = q;
    aplica();
  }
  const pedida = location.hash && document.getElementById(location.hash.slice(1));
  if (pedida) pedida.classList.add("pedida");

  // (um clique na carta: ela sozinha, grande, sobre o fundo; um clique ou Esc fecha)
  const modal = document.createElement("div");
  modal.className = "modal-carta";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  document.body.append(modal);
  function fecha() {
    modal.hidden = true;
    modal.replaceChildren();
    document.body.classList.remove("com-modal");
  }
  wiki.addEventListener("click", (e) => {
    const face = e.target.closest(".wcarta-face");
    if (!face) return;
    const grande = face.cloneNode(true);
    grande.removeAttribute("title");
    grande.querySelectorAll("img").forEach((i) => i.removeAttribute("loading"));
    modal.replaceChildren(grande);
    modal.setAttribute("aria-label", face.querySelector(".wcarta-img").alt);
    modal.hidden = false;
    document.body.classList.add("com-modal");
  });
  modal.addEventListener("click", fecha);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) fecha();
  });
})();
