window.addEventListener("DOMContentLoaded", function () {
  const script = document.querySelector("script[data-fantomely]");

  if (!script) {
    return;
  }

  const API_URL = `${script.getAttribute("data-h")}/api/event`;
  const PUBLIC_KEY = script.getAttribute("data-k");

  if (!API_URL || !PUBLIC_KEY) {
    return;
  }

  function sendPageView() {
    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        k: PUBLIC_KEY,
        p: window.location.href.slice(0, 280),
        r: document.referrer.slice(0, 280),
      }),
    }).catch(() => null);
  }

  if (typeof window !== "undefined") {
    sendPageView();

    if (window.history.pushState) {
      const pushState = window.history.pushState;
      window.history.pushState = function (...args) {
        sendPageView();
        pushState.apply(window.history, args);
      };
    }

    window.onpopstate = function () {
      sendPageView();
    };
  }
});
