export function parseClientHints(request: Request) {
  const isMobile = request.headers.get("sec-ch-ua-mobile") === "?1";
  const platform =
    request.headers.get("sec-ch-ua-platform")?.replace(/"/g, "") || "Unknown";
  const browser = request.headers
    .get("sec-ch-ua")
    ?.split(",")
    .reduce((browser, cur) => {
      if (browser !== "Unknown") {
        return browser;
      }
      if (cur.includes("Google Chrome")) {
        return "Google Chrome";
      }
      if (cur.includes("Microsoft Edge")) {
        return "Microsoft Edge";
      }
      if (cur.includes("Opera")) {
        return "Opera";
      }

      return "Unknown";
    }, "Unknown");

  return {
    browser,
    platform,
    device: isMobile ? "mobile" : "desktop",
  };
}
