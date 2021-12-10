## 基于qinglong面板的自动化脚本

环境变量需要在青龙面板的后台设置

![image](https://user-images.githubusercontent.com/12368943/145616638-cf73c4df-566f-4bec-8560-c1f1271d86cd.png)

### yecaoV2.js

定时跑一下机场数据，避免用量超过上限

环境变量 | 含义及示例
:---|:----
`yecao_bot_dingtalk_token` | 钉钉机器人的 token (url的token字段的值)
`yecao_cookie` | 野草上的cookie信息
`yecao_total_traffic_id` | 个人首页，包含整体流量数据的页面
`yecao_daily_traffic_id` | 流量详情页面，用于抓取过去N天每天的上下行数据

![image](https://user-images.githubusercontent.com/12368943/145616452-62afc7dc-cc4c-4af3-a2d3-bf43453f03ea.png)

### xueqiu.js

根据配置的组合code, 定时抓取组合的信息，包括最近一次调仓的时间以及调仓的股票变动情况

环境变量 | 含义及示例
:---|:----
`xueqiu_bot_dingtalk_token` | 钉钉机器人的 token (url的token字段的值)
`xueqiu_cookie` | xueqiu上的cookie信息
`xueqiu_cube_codes` | 要监听的组合的code, 逗号分隔，不要带空格

![image](https://user-images.githubusercontent.com/12368943/145616434-49d147b8-645b-4db0-b35c-c228b9c64a42.png)
