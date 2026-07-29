// Apply theme before React loads to prevent flash of unstyled content.
// Loaded as a separate module via <script src="/theme-init.js"> in
// index.html so it satisfies the strict CSP `script-src 'self'` directive
// (Netlify headers in netlify.toml). The script itself is identical to
// the previous inline body.
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme =
      stored === "light" || stored === "dark"
        ? stored
        : prefersDark
          ? "dark"
          : "light";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
