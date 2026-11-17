// Theme toggle (remembers the visitor's choice) + click-to-enlarge images.
(function () {
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) {}

  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      var setIcon = function () { btn.textContent = isDark() ? "☀" : "☾"; };
      setIcon();
      btn.addEventListener("click", function () {
        var next = isDark() ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
        setIcon();
      });
    }

    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = '<img alt="">';
    document.body.appendChild(box);
    box.addEventListener("click", function () { box.classList.remove("open"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") box.classList.remove("open"); });
    document.querySelectorAll(".figure img").forEach(function (img) {
      img.addEventListener("click", function () {
        box.querySelector("img").src = img.src;
        box.querySelector("img").alt = img.alt;
        box.classList.add("open");
      });
    });


    // Dashboard tabs: switch which PDF shows in the frame
    document.querySelectorAll(".pdf-viewer").forEach(function (v) {
      var frame = v.querySelector(".pdf-frame"), open = v.querySelector(".pdf-open");
      v.querySelectorAll(".tab").forEach(function (t) {
        t.addEventListener("click", function () {
          v.querySelectorAll(".tab").forEach(function (o) { o.classList.remove("active"); o.setAttribute("aria-selected", "false"); });
          t.classList.add("active"); t.setAttribute("aria-selected", "true");
          frame.src = t.dataset.pdf + "#view=FitH";
          if (open) open.href = t.dataset.pdf;
        });
      });
    });


    // "Previous page": go to the last page visited on this site; otherwise keep the homepage link
    var here = location.href.split("#")[0], prev = null;
    try {
      prev = sessionStorage.getItem("lastPage");
      sessionStorage.setItem("lastPage", here);
    } catch (e) {}
    document.querySelectorAll(".prev-page").forEach(function (a) {
      if (prev && prev !== here) a.href = prev;
    });

    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
