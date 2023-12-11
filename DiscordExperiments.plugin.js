/**
 * @name DiscordExperiments
 * @author VincentX0905(炸蝦)
 * @description Open Discord Experiments function | 啟用 Discord 實驗功能
 * @version 1.5.0
 * @authorId 909608773927202906
 * @donate https://donate.fsbot.xyz
 * @invite Pw8z4YkBFB
 * @website https://github.com/vincentwang0905/DiscordExperiments
 * @source https://github.com/vincentwang0905/DiscordExperiments
 * @updateUrl https://raw.githubusercontent.com/vincentwang0905/DiscordExperiments/plugins/DiscordExperiments.plugin.js
 */

module.exports = class discordExperiments {
  start() {
    BdApi.showToast("Now you use DiscordExperiments V1.5.0 | 你現在使用 DiscordExperiments V1.5.0", { type: "info", icon: true, timeout: 7500, forceShow: true });
    try {
      let cache; webpackChunkdiscord_app.push([["wp_isdev_patch"], {}, r => cache=r.c]);
      var UserStore = Object.values(cache).find(m => m?.exports?.default?.getUsers).exports.default;
      var actions = Object.values(UserStore._dispatcher._actionHandlers._dependencyGraph.nodes);
      var user = UserStore.getCurrentUser();
      actions.find(n => n.name === "ExperimentStore").actionHandler.CONNECTION_OPEN({     
	type: "CONNECTION_OPEN", user: {flags: user.flags |= 1}, experiments: [],
      });
      actions.find(n => n.name === "DeveloperExperimentStore").actionHandler.CONNECTION_OPEN();
      webpackChunkdiscord_app.pop(); user.flags &= ~1; "done";
    } catch (err) {
      console.log(err);
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
