# DDNS

## 域名管理

个人使用的腾讯 [DNSPod](https://dnspod.cn) 管理域名.

因为在自家内网，会使用二级域名跳转到 不同的服务上去，所以在域名解析的地方主要采取了以下策略。

1. 一条 `A` 记录解析 `www` 主机
2. 一条 `CNAME` 泛域名解析到 `www.xxx.com` (我自己的域名)

如下图所示
![DNS 记录](https://wx2.sinaimg.cn/mw2000/6d6970b9ly1gxh6yi515ej228m11cnf6.jpg)

## 公网 IP 监听

### 部署
基于 docker 构建的 DDNS 服务来完成。使用 `docker-compose` 部署 docker 服务，`yml` 文件配置信息如下

使用的 docker 镜像 github 地址：https://github.com/jeessy2/ddns-go

```dockerfile
# docker run -d --name ddns-go --restart=always --net=host -v /opt/ddns-go:/root jeessy/ddns-go

---
version: "2.1"
services:
  ddns-go:
    image: jeessy/ddns-go
    container_name: ddnsGo
    network_mode: 'host'
    volumes:
      - /srv/dev-disk-by-uuid-5eaf432c-a6c2-4a30-a223-6115f5487737/ConfigDDNSGo:/root # 配置
    ports:
      - 9876:9876 # web ui
    restart: always
```

部署完成之后，通过 http://机器ip:9876 访问配置界面。

### 设置域名、ID 和 Token 信息

- 在 [DNSPod官网](https://dnspod.cn)，登录之后右上角点击头像 -> API 秘钥 -> DNSPod Token
![创建 DNSPod Token](https://wx1.sinaimg.cn/mw2000/6d6970b9ly1gxh6yhwm1ij20ju0n0wi6.jpg)

- 之后创建秘钥即可，创建完毕务必记录好 Token（**这里查看 Token 内容是一次性的，后面就没机会看了**）
![ID 和 Token](https://wx2.sinaimg.cn/mw2000/6d6970b9ly1gxh719cys4j226u0qsahw.jpg)

- 回到 DDNS管理界面，选择DNSPod并填入 id 和 Token，以及需要定时更新的域名（一行一个）
![设置 ID 和 Token](https://wx1.sinaimg.cn/mw2000/6d6970b9ly1gxh6yhlsc5j21mc19649h.jpg)

- 如有需要，可以在设置一条钉钉提醒，参考官方文档设置即可 https://github.com/jeessy2/ddns-go#webhook
