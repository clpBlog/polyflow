import { createApp } from "vue";
import App from "./App.js";
import { state, initRouter, applyTheme, loadStatus, syncCanvas, syncOutlook } from "./store.js";

if (location.protocol === "file:") location.replace(`http://127.0.0.1:4173/${location.hash}`);

applyTheme();
initRouter();
createApp(App).mount("#app");
loadStatus();

document.addEventListener("click", () => (state.profileMenu = false));
setInterval(() => {
  if (state.integration.canvas.configured) syncCanvas({ silent: true });
  if (state.integration.outlook.configured) syncOutlook({ silent: true });
}, 5 * 60 * 1000);

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
