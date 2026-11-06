// O filtro por tag de uma versão (docs/PATCH-NOTES.md): cada botão liga e desliga uma tag; com
// alguma ligada, só ficam os itens dela (e os blocos e as seções que ainda têm algum).
(function () {
  const pagina = document.querySelector(".versao-pagina");
  if (!pagina) return;
  const botoes = [...pagina.querySelectorAll(".filtro")];
  const limpar = pagina.querySelector(".limpar");
  const vazio = pagina.querySelector(".vazio");
  const ligadas = new Set();

  function aplica() {
    const filtrando = ligadas.size > 0;
    pagina.classList.toggle("filtrando", filtrando);
    limpar.hidden = !filtrando;
    botoes.forEach((b) => b.setAttribute("aria-pressed", ligadas.has(b.dataset.filtro) ? "true" : "false"));
    let algum = false;
    pagina.querySelectorAll(".item").forEach((li) => {
      const mostra = ligadas.has(li.dataset.filtro);
      li.classList.toggle("mostra", mostra);
      algum = algum || mostra;
    });
    pagina.querySelectorAll(".bloco, .itens.soltos, .secao").forEach((el) => el.classList.toggle("mostra", !!el.querySelector(".item.mostra")));
    vazio.hidden = !filtrando || algum;
  }

  botoes.forEach((b) =>
    b.addEventListener("click", () => {
      const f = b.dataset.filtro;
      ligadas.has(f) ? ligadas.delete(f) : ligadas.add(f);
      aplica();
    })
  );
  limpar.addEventListener("click", () => {
    ligadas.clear();
    aplica();
  });
})();
