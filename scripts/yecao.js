const fetch = require('node-fetch');

const DING_TALK_URL = 'https://oapi.dingtalk.com/robot/send?access_token='
const DING_TALK_TOKEN = process.env.yecao_bot_dingtalk_token;
const TARGET_DAYS = 7;
const TOATL_TRAFFIC_URL = `https://www.yecao100.org/clientarea.php?action=productdetails&id=${process.env.yecao_total_traffic_id}`;
const DAILY_TRAFFIC_URL = `https://www.yecao100.org/modules/servers/shadowsocks/traffic.php?s=${process.env.yecao_total_traffic_id}&t=${process.env.yecao_daily_traffic_id}`;
const COOKIE = process.env.yecao_cookie;
const FAKE_HEADERS = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "en,zh-CN;q=0.9,zh;q=0.8,en-US;q=0.7",
  "cache-control": "max-age=0",
  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"macOS\"",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  "cookie": COOKIE,
  "Referer": `https://www.yecao100.org/clientarea.php?action=productdetails&id=${process.env.yecao_total_traffic_id}`,
  "Referrer-Policy": "strict-origin-when-cross-origin"
}

const SPIDER_OPTIONS = {
  headers: FAKE_HEADERS,
  body: null,
  method: "GET"
};

const promiseQueue = [
  TOATL_TRAFFIC_URL,
  DAILY_TRAFFIC_URL
].map(url => {
  return fetch(url, SPIDER_OPTIONS)
    .then(res => res.text())
    .then(html => Promise.resolve(html));
});

(function yecaoTrafficReport() {
  Promise.all(promiseQueue).then(htmls => {
    const totalHtml = htmls[0];
    const totalRegRet = totalHtml.match(/(总共.*)/g);
    const totalMatched = totalRegRet && totalRegRet[0] || '';

    const dailyHtml = htmls[1];
    const dailyRegRet = dailyHtml.match(/option\s=([\s\S])*};/g);
    const dailyMatched = dailyRegRet && dailyRegRet[0] || null;
    if (!dailyMatched) return null;

    const dateInfo = dailyMatched.match(/xAxis\:\s({[\s\S]*?})/);
    const seriesData = dailyMatched.match(/series\:\s([\s\S]*)};/);

    const dateList = standardizedJSON(dateInfo && dateInfo[1] || null, 'data');
    const seriesObject = standardizedJSON(seriesData && seriesData[1] || null);

    if (!dateList || !seriesObject) return null;

    const targetDate = dateList.reverse().slice(0, TARGET_DAYS);
    const targetUpload = (seriesObject[1].data || []).reverse().slice(0, TARGET_DAYS);
    const targetDownload = (seriesObject[0].data || []).reverse().slice(0, TARGET_DAYS);
    const trafficData = targetDate.reduce((result, item, index) => {
      result.push(`- ${item}: ${targetUpload[index]}(↑) / ${targetDownload[index]}(↓)`);
      return result;
    }, []);

    const dingtalkString = `#### <font color=\"#5B58CF\">当前总流量</font>\n时间：${new Date().toLocaleString()} \n\n ${totalMatched.replace(/\t/g, '')}\n#### <font color=\"#5B58CF\">近7日流量(GB)</font>\n${trafficData.join('\n')}`;
    fetch(`${DING_TALK_URL}${DING_TALK_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: {
          'title': 'Yecao Traffic Report',
          'text': dingtalkString
        }
      })
    }).catch(e => {
      console.log('error happened after pushing dingtalk data about Yecao traffic daily report, ', e);
    })
  });

  function standardizedJSON(string, field) {
    if (!string) return null;
    try {
      const standardizedJSON = eval('(' + string + ')');
      return field ? standardizedJSON[field] || {} : standardizedJSON;
    } catch (e) {
      return null;
    }
  }
})();