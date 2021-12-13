const fetch = require('node-fetch');

const DING_TALK_URL = 'https://oapi.dingtalk.com/robot/send?access_token='
const DING_TALK_TOKENS = process.env.xueqiu_bot_dingtalk_token.split(',');
const RECENT_GAP_MILLISECOND = (process.env.xueqiu_recent_days || 2) * 24 * 60 * 60 * 1000;

const COOKIE = process.env.xueqiu_cookie;
const FAKE_HEADERS = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "en,zh-CN;q=0.9,zh;q=0.8,en-US;q=0.7",
  "cache-control": "max-age=0",
  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
  "sec-ch-ua-mobile": "?1",
  "sec-ch-ua-platform": "\"Android\"",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  "cookie": COOKIE,
  "Referer": "https://xueqiu.com/u/2421531883",
  "Referrer-Policy": "unsafe-url",
  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Mobile Safari/537.36",
}

const BASE_URL = 'https://xueqiu.com/P/';
const REBALANCINGS = process.env.xueqiu_cube_codes.split(',') || [];

const SPIDER_OPTIONS = {
  headers: FAKE_HEADERS,
  body: null,
  method: "GET"
};

const promiseQueue = REBALANCINGS.map(item => {
  return fetch(BASE_URL + item, SPIDER_OPTIONS)
    .then(res => res.text())
    .then(html => {
      const rbData = html.match(/SNB\.cubeInfo = (\{.*)/)?.[1];
      const rbDataObject = eval('('+ rbData +')');
      const { name, symbol, last_success_rebalancing = {}, sell_rebalancing = {} } = rbDataObject;

      const recentRebalancingTime = new Date(last_success_rebalancing.updated_at).toLocaleString();
      // 判断是否为近2天内的调仓
      const recentlyRebalanced = Date.now() - last_success_rebalancing.updated_at < RECENT_GAP_MILLISECOND;
      const recentRebalancingHistory = sell_rebalancing?.rebalancing_histories?.map(item => {
        return `${item.stock_name}(${item.stock_symbol}) ${item.prev_weight_adjusted || 0}% -> ${item.target_weight || 0}%`;
      });
      return Promise.resolve({
        name,
        symbol,
        recentTime: recentRebalancingTime,
        recentlyRebalanced,
        recentRebalancingHistory,
      })
    });
});

(function xueqiuMonitor() {
  Promise.all(promiseQueue).then(jsonDatas => {
    let dingtalkString = [];
    jsonDatas.forEach(item => {
      const recentRebalancingHistoryString = item.recentRebalancingHistory.map(item => `- ${item}`).join('\n\n');
      dingtalkString.push(`#### **<font color=\"#5B58CF\">${item.name} (${item.symbol})</font>**\n最近调仓时间: ${item.recentlyRebalanced ? "**<font color=\"#FF0000\">"+ item.recentTime +"</font>**" : item.recentTime} \n\n 调仓详情: \n\n${recentRebalancingHistoryString}\n`)
    });
  
    const dingtalkQUeue = DING_TALK_TOKENS.map(item => {
      return fetch(`${DING_TALK_URL}${item}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          msgtype: 'markdown',
          markdown: {
            'title': '雪球组合调仓信息',
            'text': dingtalkString.join('----\n\n')
          }
        })
      }).catch(e => {
        console.log(`error happened after pushing dingtalk data for token ${item} about XueQiu cube report, `, e);
      })
    });
  
    Promise.all(dingtalkQUeue);
  });
})()
