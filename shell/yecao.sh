#!/bin/bash
# 检查机场流量使用情况，并通过钉钉机器人做信息推送

CURRENT_TIME=$(date "+%Y-%m-%d %H:%M:%S")
DINGTALK_TOKEN="3944b5b07b66b5cf6acf141c21c3ff376d72b1dbad8d2705a1e336a445230c81"
DATA=$(curl 'https://www.yecao100.org/clientarea.php?action=productdetails&id=36783' \
  -H 'authority: www.yecao100.org' \
  -H 'pragma: no-cache' \
  -H 'cache-control: no-cache' \
  -H 'sec-ch-ua: "Chromium";v="94", "Microsoft Edge";v="94", ";Not A Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 Edg/94.0.992.50' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
  -H 'sec-fetch-site: none' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-user: ?1' \
  -H 'sec-fetch-dest: document' \
  -H 'accept-language: zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6' \
  -H 'cookie: __utmz=157320626.1622621120.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); WHMCSlogin_auth_tk=T25zcXc4WjZYeHkyWmF0Y3NLVjdPd0tZS0E2Mk1oZFFKVTc2RXFFdXlzYWMxMnNUbVBMbDZWa2Q2NjdEUklwK0orQ2pYVlAvZC9uVERaNHg2a214ZCszZUd4MWJma3E4dFR3bkxjMkI3MloyQTdFT21NN2tXM2Z3dHA2MjlYdlJMUVJ5M09kN0pxS3RrbkVZU1UvL2VOd1pTR3UyZ3paelhJNXE0Vzc1SG1VUWxqMGpTbWdZZVhNT1BUM2FUZWllOFBkSmxOS2VzZ2ZxY2NBcHMxc2lGVHNadkp1bnY1VVhoL3FWVGtzUXQ3L29pTkpRNWhNNmtQNXVETCtwWGhLNUt5bmt5VldVUUNuTyt6cWFTQnpwQnU3VTQ2NHkrRi9BTEpoZWNRNW5MRm9RNTBvM0JTbUVEWm54MzJPelp3d21kZmRkSCtLTUJCd1FOV3F6MThZc0Jhbk9MOWVuRE83em41OGRUT1JoamFDR2dEUFBZelJyNTNnc2JZaGJRd0RXY0VFeUxZV21PS1NmQlI5bzhJdHdJVEZNa2FBTzhOMnpGZHpo; Hm_lvt_6364c98af187d03db214368ee29669d5=1632668457,1632747732,1634753431,1634832378; WHMCSxXq64TGjKe01=e095fbd392a7816d2772fe8e97bbd044; __utma=157320626.624370699.1622621120.1634831358.1635060802.12; __utmc=157320626; __utmt=1; __utmb=157320626.2.10.1635060802' \
  --compressed | grep -o '总共.*') \

curl 'https://oapi.dingtalk.com/robot/send?access_token='$DINGTALK_TOKEN \
 -H 'Content-Type: application/json' \
 -d '{"msgtype": "markdown","markdown": {"title": "Airport Report","text":"#### <font color=\"#82BFEC\">机场流量状态<\/font>\n 时间：'"${CURRENT_TIME}"' \n\n '"${DATA}"'"}}'