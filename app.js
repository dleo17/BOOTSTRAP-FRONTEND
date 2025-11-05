// app.js
// Globale Initialisierung für Navigation, Active-State, Mobile-Collapse,
// dynamisches Jahr und ein paar UX-Verbesserungen.
// Benötigt jQuery + (optional) Bootstrap JS für .collapse()

(function ($) {
  "use strict";

  // ---- Konfiguration -------------------------------------------------------
  // Mapping von data-page Werten zu Dateinamen in der Navbar
  const PAGE_MAP = {
    home: "index.html",
    cat: "cat.html",
    weather: "weather.html",
    btc: "btc.html",
    ev: "ev.html",
    map: "map.html",
    apis: "apis.html",
  };

  // Selektoren, die nach dem Laden der Navbar benutzt werden
  const SELECTORS = {
    navContainer: "#site-nav",
    navLinksWrap: "#navLinks", // <ul id="navLinks">…</ul> in nav.html
    collapsible: ".navbar-collapse", // Bootstrap Collapse Container
    main: "main",
    yearSlot: "#year", // <span id="year"></span> wird auf aktuelles Jahr gesetzt
  };

  // ---- Hilfsfunktionen -----------------------------------------------------

  // Liefert den Ziel-Href für die aktuelle Seite
  function getCurrentHref() {
    const attr = document.body.dataset.page || "";
    if (attr && PAGE_MAP[attr]) return PAGE_MAP[attr];

    // Fallback: anhand des Pfadnamens
    const path = (location.pathname || "").split("/").pop() || "index.html";
    return path;
  }

  function highlightActiveLink($root) {
    const currentHref = getCurrentHref();

    // Alle Links prüfen und passenden aktivieren
    $root.find("a[href]").each(function () {
      const href = this.getAttribute("href");
      // Nur relative Links vergleichen
      if (!href || href.startsWith("http")) return;

      const same =
        href === currentHref ||
        (href.endsWith("/") && currentHref === "index.html");

      if (same) {
        this.classList.add("active");
        this.setAttribute("aria-current", "page");

        // Reload derselben Seite vermeiden
        this.addEventListener("click", function (e) {
          e.preventDefault();
        });
      }
    });
  }

  // Bootstrap Mobile-Collapse automatisch schließen, wenn ein Link geklickt wird
  function wireMobileCollapse($root) {
    const $collapsible = $root.find(SELECTORS.collapsible);
    if (!$collapsible.length) return;

    $collapsible.on("click", "a[href]", function () {
      try {
        $collapsible.collapse("hide");
      } catch (_) {
        // Bootstrap nicht geladen – einfach ignorieren
      }
    });
  }

  // Externe Links im <main> in neuem Tab öffnen
  function markExternalLinks() {
    const $scope = $(SELECTORS.main);
    if (!$scope.length) return;

    $scope.find('a[href^="http"]').each(function () {
      const url = new URL(this.href);
      const isExternal = url.host !== location.host;
      if (isExternal) {
        this.target = "_blank";
        this.rel = "noopener noreferrer";
      }
    });
  }

  // Dynamisches Jahr einsetzen, falls #year existiert
  function setYear() {
    const el = document.querySelector(SELECTORS.yearSlot);
    if (el) el.textContent = new Date().getFullYear();
  }

  // ---- Start: DOM Ready ----------------------------------------------------
  $(function () {
    // 1) Navbar laden
    $(SELECTORS.navContainer).load("nav.html", function (response, status, xhr) {
      if (status !== "success") {
        console.warn("Navbar konnte nicht geladen werden:", status, xhr?.status);
        // Minimaler Fallback, damit die Seite benutzbar bleibt
        $(SELECTORS.navContainer).html(
          '<nav class="navbar navbar-light bg-light px-3">' +
            '<a class="navbar-brand fw-semibold" href="index.html">Info Website 2025</a>' +
          "</nav>"
        );
        setYear();
        markExternalLinks();
        return;
      }

      const $navRoot = $(SELECTORS.navContainer);

      // 2) Active-State anhand von data-page / Pfad setzen
      highlightActiveLink($navRoot);

      // 3) Mobile-Collapse: beim Linkklick automatisch schließen
      wireMobileCollapse($navRoot);

      // 4) Optional: Fokusrahmen bei Tastatur-Navigation (nur wenn du eine CSS-Klasse .using-keyboard nutzt)
      document.addEventListener("keydown", function (e) {
        if (e.key === "Tab") document.documentElement.classList.add("using-keyboard");
      });
      document.addEventListener("mousedown", function () {
        document.documentElement.classList.remove("using-keyboard");
      });

      // 5) Jahr in Footer/Brand aktualisieren
      setYear();

      // 6) Externe Links behandeln
      markExternalLinks();
    });
  });
})(jQuery);