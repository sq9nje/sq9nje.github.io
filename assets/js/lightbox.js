// Minimal lightbox for post figures: every a.lightbox inside the post content
// forms one gallery. Arrows / swipe to navigate, Esc or backdrop click to close.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".content a.lightbox"));
  if (!links.length || typeof HTMLDialogElement !== "function") return;

  var dlg = document.createElement("dialog");
  dlg.className = "lb";
  dlg.setAttribute("aria-label", "Galeria zdjęć");
  dlg.innerHTML =
    '<div class="lb__stage">' +
    '<img class="lb__img" alt="">' +
    '<p class="lb__caption"><span class="lb__count"></span><span class="lb__text"></span></p>' +
    "</div>" +
    '<button type="button" class="lb__btn lb__close" aria-label="Zamknij">✕</button>' +
    '<button type="button" class="lb__btn lb__prev" aria-label="Poprzednie">←</button>' +
    '<button type="button" class="lb__btn lb__next" aria-label="Następne">→</button>';
  document.body.appendChild(dlg);

  var img = dlg.querySelector(".lb__img");
  var count = dlg.querySelector(".lb__count");
  var text = dlg.querySelector(".lb__text");
  var current = 0;

  if (links.length === 1) dlg.setAttribute("data-single", "");

  function show(i) {
    current = (i + links.length) % links.length;
    var a = links[current];
    var thumb = a.querySelector("img");
    img.src = a.getAttribute("href");
    img.alt = thumb ? thumb.alt : "";
    count.textContent = (current + 1) + " / " + links.length;
    text.textContent = a.getAttribute("data-caption") || "";
  }

  function open(i) {
    show(i);
    if (!dlg.open) dlg.showModal();
  }

  links.forEach(function (a, i) {
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      open(i);
    });
  });

  dlg.querySelector(".lb__close").addEventListener("click", function () { dlg.close(); });
  dlg.querySelector(".lb__prev").addEventListener("click", function () { show(current - 1); });
  dlg.querySelector(".lb__next").addEventListener("click", function () { show(current + 1); });

  // Clicking empty space around the image closes it.
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg || e.target.classList.contains("lb__stage")) dlg.close();
  });

  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
  });

  var x0 = null;
  dlg.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  dlg.addEventListener("close", function () { img.removeAttribute("src"); });
})();
