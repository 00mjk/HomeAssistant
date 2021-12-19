# 反向代理

## 公网访问

> 有公网IP，没有的话另说

最简单玩法，直接在主路由对外暴露端口即可，每个端口对应到内网不同机器。
风险也比较大，端口多了，被扫到然后攻击的可能性就高了一些。

本着尽可能少的暴露端口，又能通过公网访问，所以采用了反向代理的方式来支持。

大概效果（假设我的公网域名为 www.wolegedacao.haojiahuo）

内网服务 | 公网域名
:-------|:-------
NAS | nas.wolegedacao.haojiahuo:12345
qBitTorrent | qbit.wolegedacao.haojiahuo:12345
青龙 | qinglong.wolegedacao.haojiahuo:12345
JellyFin | jellyfin.wolegedacao.haojiahuo:12345
xxx | xxx.wolegedacao.haojiahuo:12345

## 部署方案

### 公网域名访问

使用 [DDNS](https://github.com/KrabsWong/HomeAssistant/tree/main/homelab/DDNS) 方案

### 端口映射

公网只暴露一个端口即可，选个自己喜欢的端口号（比如 38250），在主路由上配置映射部署了反向代理的服务器上。

### 反向代理服务器

> 我在家里用一个 centos 部署了 docker，通过 portainer 来管理各种docker容器。

反向代理服务器是基于 [nginx-proxy-manager](https://github.com/jlesage/docker-nginx-proxy-manager) 来做的

依然使用 `docker-compose` 部署，配置文件信息如下

```docker
version: '3'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    network_mode: 'bridge'
    ports:
      - '8080:80'
      - '81:81' # dashboad访问端口
      - '4433:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt # 保存证书信息
```

部署完毕之后，http://服务器IP:81 打开 dashboad（第一次进入需要设置登录的邮箱和密码，自行设置）

![登录](https://raw.githubusercontent.com/KrabsWong/HomeAssistant/main/files/nginx-proxy-manager-login.png)

![管理界面](https://raw.githubusercontent.com/KrabsWong/HomeAssistant/main/files/nginx-proxy-manager-dashboard.png)

主要的反向代理配置，就都在 `17 Proxy Hosts` 里了

示例如下
![已经设置的反向代理](https://raw.githubusercontent.com/KrabsWong/HomeAssistant/main/files/nginx-proxy-manager-list.png)

#### 简单描述下配置方法

右上角有个 `Add Proxy Host`

**域名设置**

![设置域名](https://raw.githubusercontent.com/KrabsWong/HomeAssistant/main/files/nginx-proxy-manager-domain.png)

**SSL设置**

![SSL设置](https://github.com/KrabsWong/HomeAssistant/blob/main/files/nginx-proxy-manager-ssl.png?raw=true)

字段 | 含义
:---|:-----
Domain Names | 公网访问的域名地址（基于DDNS配置）
Schema | 请求协议，对应到内网服务使用的是什么协议
Forward Hostname / IP | 内网服务的域名或者 IP 地址
Forward Port | 内网服务的端口号
SSL Certificate | 不是必须，如果公网使用 HTTPS 访问，就选择或者申请一个证书

SSL证书申请

1. 可以使用 `Request a new SSL Certificate` 直接申请（会保存在 docker 配置文件定义的目录中）
2. 可以自己申请完，传到对应目录中 docker 内部的 `/etc/letsencrypt` 目录下

### 补充说明

> 当家里使用旁路由做网关的时候，端口映射需要做一些改动，旁路由上的防火墙需要再设置一层端口转发

我家使用了一个 R4S+OpenWrt 做旁路由，做家里的网关。这意味着，家里所有机器的流量（不做特殊配置的话）都会渠道 R4S 走一圈。

端口映射由

```
主路由配置的公网端口 -> 反向代理服务器:端口
```

变成

```
主路由配置的公网端口 -> 旁路由IP:80/443 -> 旁路由防火墙增加端口映射 -> 公网端口转发到反向代理服务器端口
```

旁路由上配置如下图

网络 -> 防火墙 -> 端口转发

![防火墙配置](https://raw.githubusercontent.com/KrabsWong/HomeAssistant/main/files/nginx-proxy-manager-r4s-firewall.png)

新增规则的时候，外部区域和内部区域只有 VPN+lan 两种模式，先无视即可，添加完毕之后修改，可以将外部和内部区域都改成 lan
