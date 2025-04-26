/**
 * @name DiscordExperiments
 * @author VincentX0905(炸蝦)
 * @description Open Discord Experiments function | 啟用 Discord 實驗功能
 * @version 1.8.0
 * @authorId 1183208834802667555
 * @donate https://donate.fsbot.xyz
 * @invite myZ7u8pPe9
 * @website https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/
 * @source https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/
 * @updateUrl https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/releases/latest/download/DiscordExperiments.plugin.js
 */

function version() {
  return "1.8.0"
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

function detectVersion() {
  var newupdate = false;
  fetch('https://raw.githubusercontent.com/Friedshrimp-Studio-TW/Discord-Experiments/main/info/version.json')
  .then(response => {
    if (!response.ok) {throw new Error('Error: Network Error!');}
    return response.json();
  })
  .then(async data => {
    if (data["version"] != version()) {
      BdApi.UI.showNotice(await lang("have-update", "A new version of DiscordExperiments is available: V%version%").then(result => result.replace("%version%", data["version"])), {type: "info", buttons: [{label: await lang("gotoupdate-button", "Go To Update"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/releases/latest/download/DiscordExperiments.plugin.js", "mozillaTab")}]});
      BdApi.UI.showToast(await lang("have-update", "A new version of DiscordExperiments is available: V%version%").then(result => result.replace("%version%", data["version"])), {type:"info",icon: true,timeout: 7500,forceShow: true});
      newupdate = true;
    }
    return newupdate;
  })
  .catch(error => {
    console.error('Error:', error);
    return newupdate;
  });
}

module.exports = class discordExperiments {
    async start() {
      BdApi.UI.showToast(await lang("nowuse", "Now you using DiscordExperiments V%version%").then(result => result.replace("%version%", version())), {type:"info",icon: true,timeout: 7500,forceShow: true});
      detectVersion();
      var checkupdate = setInterval(function() {if (detectVersion()) {clearInterval(checkupdate);}}, 3600000);
      try {
        let cache;
        webpackChunkdiscord_app.push([[Symbol()], {}, r => cache = r.c]);
        webpackChunkdiscord_app.pop();
        let userModule = Object.values(cache).find(mod =>!mod?.exports?.messagesLoader && mod?.exports?.default?.getUsers && mod?.exports?.default?.getCurrentUser).exports.default;
        let actionHandlers = Object.values(userModule._dispatcher._actionHandlers._dependencyGraph.nodes);
        userModule.getCurrentUser().flags |= 1;
        const getModule = name => actionHandlers.find(mod => mod.name === name);
        getModule("DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]();
        try {getModule("ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({ user: { flags: 1 } });} catch {}
        getModule("ExperimentStore").storeDidChange();
      } catch (error) {
        console.log(error);
        BdApi.UI.showNotice(await lang("pluginerror", "An error occurred with the DiscordExperiments plugin")), {type: "error", buttons: [{label: await lang("pluginerror-button", "Report"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/issues", "mozillaTab")}]};
        return BdApi.UI.showNotice(await lang("pluginerror-output", "Error: %error%").then(result => result.replace("%error%", error)), {type: "error", buttons: [{label: await lang("pluginerror-button", "Report"), onClick: () => window.open("https://github.com/Friedshrimp-Studio-TW/Discord-Experiments/issues", "mozillaTab")}]});
      }
    }
  
    async stop() {BdApi.UI.showNotice(await lang("need-reboot", "You need to reboot BetterDiscord for disabling DiscordExperiments"), {type: "warning", buttons: [{label: await lang("reboot-button", "Reboot BetterDiscord"), onClick: () => location.reload()}]});}
  }
