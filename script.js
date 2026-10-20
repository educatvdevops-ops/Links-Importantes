/* ==========================================================
   EDUCATV CAMPINAS - PÁGINA DE LINKS
   1. Filtro de links
   2. Botões "Copiar senha" (Wi-Fi)
   ========================================================== */
   (function () {
    var filtro = document.getElementById('lk-filtro');
    var itens = document.querySelectorAll('.lk-list li');
    var grupos = document.querySelectorAll('.lk-group');
    var vazio = document.getElementById('lk-vazio');
  
    // tira acentos e maiúsculas para a busca ser tolerante
    function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  
    filtro.addEventListener('input', function () {
      var q = norm(filtro.value.trim());
      Array.prototype.forEach.call(itens, function (li) {
        li.hidden = !!q && norm(li.textContent).indexOf(q) === -1;
      });
      var total = 0;
      Array.prototype.forEach.call(grupos, function (g) {
        var n = g.querySelectorAll('.lk-list li:not([hidden])').length;
        g.hidden = n === 0;
        total += n;
      });
      vazio.classList.toggle('show', total === 0);
    });
  })();
  
  /* ---------- 2. Copiar senha do Wi-Fi ---------- */
  (function () {
    var status = document.getElementById('wf-status');
  
    // plano B para navegadores/arquivos que bloqueiam a área de transferência
    function copiarAntigo(texto) {
      var t = document.createElement('textarea');
      t.value = texto; t.setAttribute('readonly', '');
      t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(t);
      return ok;
    }
  
    function avisar(btn, ok) {
      var original = btn.dataset.rotulo || btn.textContent;
      btn.dataset.rotulo = original;
      btn.textContent = ok ? 'Senha copiada!' : 'Não foi possível copiar';
      btn.classList.toggle('ok', ok);
      status.textContent = ok ? 'Senha copiada para a área de transferência.' : 'Copie a senha manualmente.';
      setTimeout(function () { btn.textContent = original; btn.classList.remove('ok'); status.textContent = ''; }, 2000);
    }
  
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.wf-copy');
      if (!btn) return;
      var senha = btn.dataset.copy;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(senha).then(function () { avisar(btn, true); },
                                                  function () { avisar(btn, copiarAntigo(senha)); });
      } else {
        avisar(btn, copiarAntigo(senha));
      }
    });
  })();