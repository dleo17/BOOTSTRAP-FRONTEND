// app.js
// 1) Navbar in #site-nav laden (steht auf jeder Seite als leerer Container)
$(function () {
  $("#site-nav").load("nav.html", function () {
    // 2) aktive Seite hervorheben (per data-page auf <body>)
    const current = document.body.dataset.page; // z.B. "home" | "cat" | ...
    const map = {
      home: "index.html",
      cat: "cat.html",
      weather: "weather.html",
      btc: "btc.html",
      ev: "ev.html",
      map: "map.html",
    };
    const href = map[current];
    if (!href) return;
    $("#navLinks a").each(function () {
      if (this.getAttribute("href") === href) {
        this.classList.add("active");
        this.setAttribute("aria-current", "page");
      }
    });
  });
});