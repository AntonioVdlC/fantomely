function Hello(name: string) {
  console.log(`Hello, ${name}!`);

  fetch("http://localhost:3000/api/event", {
    method: "POST",
    body: JSON.stringify({
      publicKey: "%PUBLIC_KEY%",
      path: window.location.href,
    }),
  })
    .then(() => console.log("Successfully sent event"))
    .catch(console.error);
}

Hello("world!");
