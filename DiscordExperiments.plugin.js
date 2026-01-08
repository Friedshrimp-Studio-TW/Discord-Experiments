/**
* @name DiscordExperiments
* @author VincentX0905(炸蝦)
* @description Open Discord Experiments function | 啟用 Discord 實驗功能
* @version 1.9.1
* @authorId 1183208834802667555
* @donate https://donate.fsbot.xyz
* @invite myZ7u8pPe9
* @website https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/
* @source https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/
* @updateUrl https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/releases/latest/download/DiscordExperiments.plugin.js
*/

function version() {
  return "1.9.1"
}

async function lang(key, defaulttext) {
  try {
    const response=await fetch(`https://raw.githubusercontent.com/Friedshrimp-Studio-TW/Discord-Experiments/main/lang/${document.documentElement.lang}.json`);
    if(!response.ok) {throw new Error('Error: Network Error!');}
    const data = await response.json();
    const text = data[key] || defaulttext;
    return String(text);
  }
  catch(error) {
    console.error('Error:', error);
    return String(defaulttext);
  }
}

async function detectVersion() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/Friedshrimp-Studio-TW/Discord-Experiments/main/info/version.json');
    if (!res.ok) throw new Error('Network error');
    
    const data = await res.json();
    const remoteVersion = data.version;
    const localVersion = version();
    
    // Compare versions numerically
    const isRemoteNewer = (() => {
      const lv = localVersion.split('.').map(Number);
      const rv = remoteVersion.split('.').map(Number);
      const len = Math.max(lv.length, rv.length);
      for (let i = 0; i < len; i++) {
        const l = lv[i] || 0;
        const r = rv[i] || 0;
        if (r > l) return true;
        if (r < l) return false;
      }
      return false;
    })();
    
    if (isRemoteNewer) {
      const msg = await lang("have-update", "A new version of DiscordExperiments is available: V%version%")
      .then(s => s.replace("%version%", remoteVersion));
      
      BdApi.UI.showNotice(msg, {
        type: "info",
        buttons: [{ label: await lang("gotoupdate-button", "Go To Update"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/releases/latest/download/DiscordExperiments.plugin.js", "mozillaTab") }]
      });
      
      BdApi.UI.showToast(msg, { type: "info", icon: true, timeout: 7500, forceShow: true });
      return true;
    }
    
    return false;
  } catch (e) {
    console.error("Error checking version:", e);
        BdApi.UI.showNotice(await lang("pluginerror", "An error occurred with the DiscordExperiments plugin")), {type: "error", buttons: [{label: await lang("pluginerror-button", "Report"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/issues", "mozillaTab")}]};
        BdApi.UI.showNotice(await lang("pluginerror-output", "Error: %error%").then(result => result.replace("%error%", e)), {type: "error", buttons: [{label: await lang("pluginerror-button", "Report"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/issues", "mozillaTab")}]});    return false;
  }
}

module.exports = class discordExperiments {

  async start() {
    try {
      // Show toast
      BdApi.UI.showToast(
        await lang("nowuse", "Now using DiscordExperiments V%version%").then(r => r.replace("%version%", version())),
        { type: "info", icon: true, timeout: 7500, forceShow: true }
      );

      // Version check
      detectVersion();
      this._versionInterval = setInterval(() => {
        detectVersion();
      }, 60 * 60 * 1000); // check every hour

      // Get user module
      const cache = webpackChunkdiscord_app.push([[Symbol()], {}, r => r.c]);
      webpackChunkdiscord_app.pop();
      const userModule = Object.values(cache).find(
        x => x?.exports?.default?.__proto__?.getUsers && x?.exports?.default?.getCurrentUser
      )?.exports?.default;

      if (!userModule) return;
      this.userModule = userModule;
      this.originalFlags = userModule.getCurrentUser().flags;

      // Patch getCurrentUser for self-healing
      const originalGetter = userModule.getCurrentUser.bind(userModule);
      this._unpatchGetter = () => userModule.getCurrentUser = originalGetter;

      userModule.getCurrentUser = () => {
        const user = originalGetter();
        if (user && !(user.flags & 1)) this.ensureExperiments();
        return user;
      };

      // Patch storeDidChange for self-healing menu
      const nodes = Object.values(userModule._dispatcher._actionHandlers._dependencyGraph.nodes);
      const expStore = nodes.find(h => h.name === "ExperimentStore");
      const devExpStore = nodes.find(h => h.name === "DeveloperExperimentStore");

      this._originalExpStoreDidChange = expStore?.storeDidChange?.bind(expStore);
      this._originalDevExpDidChange = devExpStore?.storeDidChange?.bind(devExpStore);

      if (expStore) expStore.storeDidChange = () => { this.ensureExperiments(); this._originalExpStoreDidChange?.(); };
      if (devExpStore) devExpStore.storeDidChange = () => { this.ensureExperiments(); this._originalDevExpDidChange?.(); };

      // Ensure menu immediately
      this.ensureExperiments();
    } catch (e) {
      console.error('Error in start():', e);
        BdApi.UI.showNotice(await lang("pluginerror", "An error occurred with the DiscordExperiments plugin")), {type: "error", buttons: [{label: await lang("pluginerror-button", "Report"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/issues", "mozillaTab")}]};
        return BdApi.UI.showNotice(await lang("pluginerror-output", "Error: %error%").then(result => result.replace("%error%", e)), {type: "error", buttons: [{label: await lang("pluginerror-button", "Report"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/issues", "mozillaTab")}]});
    }
  }

  async stop() {
    try {
      // Clear version-check interval if set
      if (this._versionInterval) {
        clearInterval(this._versionInterval);
        this._versionInterval = null;
      }

      if (!this.userModule || this.originalFlags == null) return;

      // Restore original getter
      if (this._unpatchGetter) this._unpatchGetter();

      // Restore flags
      const user = this.userModule.getCurrentUser();
      if (user) user.flags = this.originalFlags;

      // Restore original storeDidChange methods
      const nodes = Object.values(this.userModule._dispatcher._actionHandlers._dependencyGraph.nodes);
      const expStore = nodes.find(h => h.name === "ExperimentStore");
      const devExpStore = nodes.find(h => h.name === "DeveloperExperimentStore");

      if (expStore && this._originalExpStoreDidChange) expStore.storeDidChange = this._originalExpStoreDidChange;
      if (devExpStore && this._originalDevExpDidChange) devExpStore.storeDidChange = this._originalDevExpDidChange;

      // Trigger updates to hide menu
      devExpStore?.actionHandler?.["CONNECTION_OPEN"]?.({ user: { flags: this.originalFlags } });
      expStore?.storeDidChange();
      devExpStore?.storeDidChange();

      BdApi.UI.showToast("DiscordExperiments disabled — menu hidden.", { type: "info" });
    } catch (e) {
      console.error('Error in stop():', e);
      BdApi.UI.showNotice(await lang("pluginerror", "An error occurred with the DiscordExperiments plugin")), {type: "error", buttons: [{label: await lang("pluginerror-button", "Report"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/issues", "mozillaTab")}]};
      return BdApi.UI.showNotice(await lang("pluginerror-output", "Error: %error%").then(result => result.replace("%error%", e)), {type: "error", buttons: [{label: await lang("pluginerror-button", "Report"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/issues", "mozillaTab")}]});
    }
  }

  async ensureExperiments() {
    if (this._ensuring) return; // throttle to avoid lag
    this._ensuring = true;

    try {
      const user = this.userModule.getCurrentUser();
      if (!user) return; // nothing to do if no user (e.g., logging out)
      if (user.flags & 1) return; // nothing to do
      console.log("[DiscordExperiments] ensureExperiments triggered — restoring dev flag");
      user.flags |= 1;

      const nodes = Object.values(this.userModule._dispatcher._actionHandlers._dependencyGraph.nodes);
      nodes.find(h => h.name === "DeveloperExperimentStore")?.actionHandler?.["CONNECTION_OPEN"]?.();
      const expStore = nodes.find(h => h.name === "ExperimentStore");
      try { expStore?.actionHandler?.["OVERLAY_INITIALIZE"]?.({ user: { flags: 1 } }); } catch {}
      expStore?.storeDidChange();
    } catch (e) { console.error(e); 
        BdApi.UI.showNotice(await lang("pluginerror", "An error occurred with the DiscordExperiments plugin")), {type: "error", buttons: [{label: await lang("pluginerror-button", "Report"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/issues", "mozillaTab")}]};
        return BdApi.UI.showNotice(await lang("pluginerror-output", "Error: %error%").then(result => result.replace("%error%", e)), {type: "error", buttons: [{label: await lang("pluginerror-button", "Report"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/issues", "mozillaTab")}]});
    }
    finally {
      setTimeout(() => this._ensuring = false, 100); // allow next run after 100ms
    }
  }
};
