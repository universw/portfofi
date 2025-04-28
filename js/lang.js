// Language Switcher
document.getElementById("lang-switcher").addEventListener("change", function () {
  const lang = this.value;

  fetch(`lang/${lang}.json`)
    .then((res) => res.json())
    .then((data) => {
      // Replace all data-i18n text based on JSON keys
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (data[key]) {
          el.innerHTML = data[key];
        }
      });

      // Update page <title> separately if needed
      if (data["site_title"]) {
        document.title = data["site_title"];
      }
    })
    .catch((error) => {
      console.error("Error loading language file:", error);
    });
});