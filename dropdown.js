(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3133"}/esbuild`).addEventListener("change", () => location.reload());

  // src/~utils/common.js
  var doc = document;
  var qs = (s, o = doc) => o.querySelector(s);
  var qsa = (s, o = doc) => o.querySelectorAll(s);
  var onClassChange = (node, callback) => {
    let lastClassString = node == null ? void 0 : node.classList.toString();
    const mutationObserver = new MutationObserver((mutationList) => {
      for (const item of mutationList) {
        if (item.attributeName === "class") {
          const classString = node == null ? void 0 : node.classList.toString();
          if (classString !== lastClassString) {
            callback(mutationObserver);
            lastClassString = classString;
            break;
          }
        }
      }
    });
    mutationObserver.observe(node, { attributes: true });
    return mutationObserver;
  };
  var simulateClick = (element) => {
    var mouseClickEvents = ["mousedown", "click", "mouseup"];
    mouseClickEvents.forEach(
      (mouseEventType) => element.dispatchEvent(new MouseEvent(mouseEventType, { view: window, bubbles: true, cancelable: true, buttons: 1 }))
    );
  };
  var toggleScrollLock = (active) => {
    var _a, _b;
    const hasLenis = ((_a = window.bc) == null ? void 0 : _a.smoothscroll) && ((_b = window.bc) == null ? void 0 : _b.smoothscroll) instanceof Lenis;
    if (active) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      if (hasLenis)
        window.bc.smoothscroll.stop();
      return;
    }
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    if (hasLenis)
      window.bc.smoothscroll.start();
  };

  // src/powerups-dropdown/dropdown.js
  var dropdowns = qsa(".w-dropdown[data-bc-dropdown]");
  var dropdownCloseButtons = qsa("[data-bc-dropdown-close]");
  dropdownCloseButtons.forEach((el) => {
    el.addEventListener("click", () => {
      const dropdown = el.closest(".w-dropdown[data-bc-dropdown]");
      const dropdownTrigger = qs(".w-dropdown-toggle", dropdown);
      if (dropdownTrigger.classList.contains("w--open"))
        simulateClick(dropdownTrigger);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdowns.forEach((dropdown) => {
        const dropdownTrigger = qs(".w-dropdown-toggle", dropdown);
        const canCloseDropdown = () => {
          const childDropdowns = qsa(".w-dropdown[data-bc-dropdown]", dropdown);
          if (!childDropdowns.length)
            return true;
          const anyChildDropdownOpen = [...childDropdowns].some((el) => qs(".w-dropdown-toggle", el).classList.contains("w--open"));
          if (anyChildDropdownOpen)
            return false;
          return true;
        };
        if (dropdownTrigger.classList.contains("w--open")) {
          if (!canCloseDropdown)
            return;
          simulateClick(dropdownTrigger);
        }
      });
    }
  });
  dropdowns.forEach((dropdown) => {
    const dropdownTrigger = qs(".w-dropdown-toggle", dropdown);
    const dropdownContent = qs(".w-dropdown-list", dropdown);
    const lockScroll = dropdown.hasAttribute("data-bc-scroll-lock");
    onClassChange(dropdownTrigger, () => {
      var _a;
      if (dropdownTrigger.classList.contains("w--open")) {
        const hasSlider = dropdownContent.querySelector("[data-bc-slider]");
        if (hasSlider && ((_a = window.bc) == null ? void 0 : _a.slider)) {
          qsa("[data-bc-slider-track]", marker).forEach((track) => {
            window.bc.slider.data(track).resize();
          });
        }
        if (lockScroll)
          toggleScrollLock(true);
        return;
      }
      if (lockScroll)
        toggleScrollLock(false);
    });
  });
})();
