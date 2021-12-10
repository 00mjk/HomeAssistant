## 基于qinglong面板的自动化脚本

### yecaoV2.js

定时跑一下机场数据，避免用量超过上限

参数 | 含义及示例
:---|:----
`yecao_bot_dingtalk_token` | 钉钉机器人的 token (url的token字段的值)
`yecao_cookie` | 野草上的cookie信息
`yecao_total_traffic_id` | 个人首页，包含整体流量数据的页面
`yecao_daily_traffic_id` | 流量详情页面，用于抓取过去N天每天的上下行数据



### xueqiu.js

根据配置的组合code, 定时抓取组合的信息，包括最近一次调仓的时间以及调仓的股票变动情况

参数 | 含义及示例
:---|:----
`xueqiu_bot_dingtalk_token` | 钉钉机器人的 token (url的token字段的值)
`xueqiu_cookie` | xueqiu上的cookie信息
`xueqiu_cube_codes` | 要监听的组合的code, 逗号分隔，不要带空格