// TODO: Remove console logs?

const API_URL = `%BASE_URL%/api/event`;
const PUBLIC_KEY = "%PUBLIC_KEY%";

function sendPageView() {
  return fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      k: PUBLIC_KEY,
      p: window.location.href.slice(0, 280),
      r: document.referrer.slice(0, 280),
    }),
  })
    .then(() => console.log("Event sent successfully."))
    .catch(console.error);
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
