(function () {
  function postJson(url, body) {
    const payload = JSON.stringify(body);

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(function () {});
  }

  postJson("/api/track/visit", {});

  document.querySelectorAll(".banner-link[data-banner-id]").forEach(function (link) {
    link.addEventListener("click", function () {
      postJson("/api/track/click", {
        bannerId: link.dataset.bannerId,
        bannerLabel: link.dataset.bannerLabel || link.querySelector("img")?.alt || "",
      });
    });
  });
})();
