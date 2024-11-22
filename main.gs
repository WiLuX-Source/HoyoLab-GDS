const globalConfig = {
  url: "https://discord.com/api/webhooks/", // webhook url
  avatar_url: "https://i.imgur.com/vflviOn.png",
  username: "HoyoLab GDS",
  update: {
    url: "https://gist.githubusercontent.com/WiLuX-Source/240c274901dcb74b8f91e1c46a93096e/raw/update.json", // undefined for disabling updates
    version: "1.0.1",
    repo: "WiLuX-Source/HoyoLab-GDS",
  },
  profiles: [
    // {
    //   token: "ltoken_v2=12345; ltuid_v2=12345;",
    //   genshin: false,
    //   honkai_star_rail: false,
    //   honkai_impact_3rd: false,
    //   tears_of_themis: false,
    //   zenless_zone_zero: false,
    //   id: "discordID",
    // },
  ],
};
/* You can configure config from above rest is script code. */
const gameConfig = [
  {
    name: "Genshin_Impact",
    url: "https://sg-hk4e-api.hoyolab.com/event/sol/sign?lang=en-us&act_id=e202102251931481",
    header: {},
  },
  {
    name: "Honkai_Star_Rail",
    url: "https://sg-public-api.hoyolab.com/event/luna/os/sign?lang=en-us&act_id=e202303301540311",
    header: {
      //"x-rpc-signgame": "hkrpg",
    },
  },
  {
    name: "Honkai_Impact_3rd",
    url: "https://sg-public-api.hoyolab.com/event/mani/sign?lang=en-us&act_id=e202110291205111",
    header: {},
  },
  {
    name: "Tears_of_Themis",
    url: "https://sg-public-api.hoyolab.com/event/luna/os/sign?lang=en-us&act_id=e202308141137581",
    header: {},
  },
  {
    name: "Zenless_Zone_Zero",
    url: "https://sg-public-api.hoyolab.com/event/luna/zzz/os/sign?lang=en-us&act_id=e202406031448091",
    header: {
      "x-rpc-signgame": "zzz",
    },
  },
];

async function main() {
  if (!globalConfig.profiles) {
    return Logger.log("No profiles found.");
  }

  if (globalConfig.profiles.length === 0) {
    return Logger.log("No profiles found.");
  }
  updateCheck()
  const messages = await Promise.all(globalConfig.profiles.map(autoSignFunction));
  const hoyolabResp = `${messages.join("\n\n")}\n-# ${versionString()}`;

  if (globalConfig.url) {
    postWebhook(hoyolabResp);
  }
}

function autoSignFunction({ token, genshin = false, honkai_star_rail = false, honkai_impact_3rd = false, tears_of_themis = false, zenless_zone_zero = false, id }) {
  const gamesSign = {
    Genshin_Impact: genshin,
    Honkai_Star_Rail: honkai_star_rail,
    Honkai_Impact_3rd: honkai_impact_3rd,
    Tears_of_Themis: tears_of_themis,
    Zenless_Zone_Zero: zenless_zone_zero,
  };

  const baseHeader = {
    Cookie: token,
    Accept: "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    "x-rpc-app_version": "2.34.1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "x-rpc-client_type": "4",
    Referer: "https://act.hoyolab.com/",
    Origin: "https://act.hoyolab.com",
  };
  let responseText = `Check in completed for ${discordPing(id)}`; // Maybe an option for disabling mentions?
  let sleepTime = 0;
  const httpResponses = [];

  for (const config of gameConfig) {
    if (gamesSign[config.name]) {
      Utilities.sleep(sleepTime);

      const options = {
        method: "POST",
        headers: { ...baseHeader, ...config.header },
        muteHttpExceptions: true,
      };

      httpResponses.push({
        name: config.name,
        response: UrlFetchApp.fetch(config.url, options),
      });

      sleepTime = 1000;
    }
  }

  for (const { response, name } of httpResponses) {
    const { message: checkInResult, data } = JSON.parse(response);
    const gameName = name.replace(/_/g, " ");
    const isBanned = data?.gt_result?.is_risk ?? false;
    if (isBanned) {
      responseText += `\n- ${gameName}: \`Captcha\``;
    } else {
      responseText += `\n- ${gameName}: \`${checkInResult}\``;
    }
  }

  return responseText;
}

function updateCheck() {
  const options = {
    method: "GET",
    muteHttpExceptions: true,
  };

  if (globalConfig.update.url === undefined) {
    return;
  }

  const response = UrlFetchApp.fetch(globalConfig.update.url, options);
  if (response) {
    const metadata = JSON.parse(response);
    if (metadata.version === undefined || metadata.commit === undefined) {
      return postWebhook("Misconfigured update url please update.");
    }

    if (metadata.version === globalConfig.update.version) {
      // If you are developing based on this don't forget to set your update link to undefined!
      return;
    } else {
      return postWebhook(`There is a new release available please update from this [link](https://raw.githubusercontent.com/${globalConfig.update.repo}/${metadata.commit}/main.gs)`); //https://raw.githubusercontent.com/repo/commit/dir
    }
  } else {
    return postWebhook("Cannot parse response from update url.");
  }
}

function versionString() {
  return `INFO: ${globalConfig.update.version} | ${globalConfig.update.repo}`;
}

function discordPing(id) {
  return id ? `<@${id}> ` : "";
}

function postWebhook(data) {
  let payload = JSON.stringify({
    username: globalConfig.username,
    avatar_url: globalConfig.avatar_url,
    content: data,
  });

  const options = {
    method: "POST",
    contentType: "application/json",
    payload: payload,
    muteHttpExceptions: true,
  };

  UrlFetchApp.fetch(globalConfig.url, options);
}
