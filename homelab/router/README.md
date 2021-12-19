# 软路由

## 硬件和软件

### 软件

软路由固件用的是矮小少缝合怪的 openwrt，一般月更。

电报群：[https://t.me/aixiaoshao](https://t.me/aixiaoshao)

其他固件下载或自行编译（自行选择，不做推荐）
- eSir：[电报群](https://t.me/esirplayground)，[Google网盘](https://bit.ly/esirpg_googledrive)
- jingleijack：[X86_64多版本](https://github.com/jingleijack/X86_64-TEST/releases)
- 自行编译：[eSir的文档](https://github.com/esirplayground/Compile_OpenWrt_Tutorial)

### 硬件-主路由（R4S 4G版本）

主要用来拨号、DHCP。弱电箱太小，x86小主机实在放不下。

https://user-images.githubusercontent.com/12368943/146675964-6c1bf154-d2f4-48de-856e-05b9c700a1b6.mp4

### 硬件-旁路由（R4S 4G版本）

出国、去广告

![R4S旁路由](https://user-images.githubusercontent.com/12368943/146676079-066bbaf3-4c80-4c87-9997-a875432610f8.jpeg)

### 硬件-x86小主机（J4125，16G内存，256G SSD，8T HDD）

![x86小主机](https://user-images.githubusercontent.com/12368943/146676095-266bf18b-9b20-4864-8d7c-d7f2d8b2d4f3.jpeg)

现阶段 Homelab 主要就在这里头玩，各种服务跑在 `PVE` 虚拟机里，目前跑了一些服务

- DDNS
- Ubuntu：用来编译 openwrt R4S 固件
- 青龙：没有用来薅羊毛，管理了几个自己的自动化脚本
    - 监控下雪球大佬的调仓
    - 监控机场流量（目前使用的机场没有流量提醒，比较拉）
- qBitTorrent：下载利器
- Transmission：同样是下载利器
- Portainer：docker管理
- 反向代理：nginx proxy manager
- AliyunWebDav
- JellyFin：视频播放
- TinyRSS：个人的RSS
- OpenMediaVault：开源群辉

保不齐哪天搞个服务器？
