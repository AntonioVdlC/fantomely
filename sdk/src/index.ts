// TODO: Remove console logs?

const BASE_URL = "%BASE_URL%";

enum EventType {
  PAGEVIEW = "PAGEVIEW",
}

type Event = {
  path: string;
  type: string;
};

type InitConfig = {
  publicKey: string;
  apiURL: string;
};

class SDK {
  publicKey: string;
  apiURL: string;

  constructor() {
    this.publicKey = "%PUBLIC_KEY%";
    this.apiURL = `${BASE_URL}/api/event`;
  }

  init({ publicKey, apiURL }: InitConfig) {
    this.publicKey = publicKey;
    this.apiURL = apiURL;
  }

  async send({ path, type = EventType.PAGEVIEW }: Event) {
    if (!path) {
      console.warn("No path provided for event.");
      return;
    }

    return fetch(this.apiURL, {
      method: "POST",
      body: JSON.stringify({
        publicKey: this.publicKey,
        path,
        type,
      }),
    })
      .then(() =>
        console.log("Event sent successfully.")
      )
      .catch(console.error);
  }
}

const sdk = new SDK();

if (typeof window !== "undefined") {
  sdk.send({
    path: window.location.href,
    type: EventType.PAGEVIEW,
  });

  window.addEventListener("hashchange", () => {
    sdk.send({
      path: window.location.href,
      type: EventType.PAGEVIEW,
    });
  });
}

export default sdk;
