/**
 * @name DiscordExperiments
 * @author VincentX0905(炸蝦)
 * @description Open Discord Experiments function
 * @version 1.3.0
 * @authorId 909608773927202906
 * @donate https://donate.fsbot.tk
 * @invite Pw8z4YkBFB
 * @website https://github.com/vincentwang0905/DiscordExperiments
 * @source https://github.com/vincentwang0905/DiscordExperiments
 * @updateUrl https://raw.githubusercontent.com/vincentwang0905/DiscordExperiments/plugins/DiscordExperiments.plugin.js
 */

module.exports = class discordExperiments {
  start() {
    BdApi.showToast("Now you use DiscordExperiments V1.2.0", {type:"info",icon: true,timeout: 7500,forceShow: true});
    try {
      let wpRequire;
      window.webpackChunkdiscord_app.push([
        [Math.random()],
        {},
        (req) => {
          wpRequire = req;
        },
      ]);
      let mod = Object.values(wpRequire.c).find((x) => typeof x?.exports?.Z?.isDeveloper !== "undefined");
      let usermod = Object.values(wpRequire.c).find((x) => x?.exports?.default?.getUsers);
      let nodes = Object.values(mod.exports.Z._dispatcher._actionHandlers._dependencyGraph.nodes);
      try {
        nodes.find((x) => x.name == "ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({ user: { flags: 1 } });
      } catch (e) {}
      let oldGetUser = usermod.exports.default.__proto__.getCurrentUser;
      usermod.exports.default.__proto__.getCurrentUser = () => ({ isStaff: () => true });
      nodes.find((x) => x.name == "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]();
      usermod.exports.default.__proto__.getCurrentUser = oldGetUser;
    } catch (err) {
      BdApi.showNotice(
        "DiscordExperiments 插件錯誤 | DiscordExperiments Plugin error",
        {
          type: "error",
          buttons: [
            {
              label: "回報 | Report",
              onClick: () => window.open("https://github.com/vincentwang0905/DiscordExperiments/issues", "mozillaTab")
            }
          ]
        }
      );
      return BdApi.showNotice(
        `錯誤 | Error: ${err}`,
        {
          type: "error",
          buttons: [
            {
              label: "回報 | Report",
              onClick: () => window.open("https://github.com/vincentwang0905/DiscordExperiments/issues", "mozillaTab")
            }
          ]
        }
      );
    }
  }

  stop() {
    BdApi.showNotice("你需要重啟 BD 來關閉 DiscordExperiments | You need to reboot BD for disabling DiscordExperiments", {
      type: "warning",
      buttons: [{
        label: "重啟 BD | Reboot BD",
        onClick: () => location.reload()
      }]
    });
  }
}
