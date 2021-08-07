## 用来测试浏览器并发限制的demo

### 使用方式
1. serverA和serverB是两个node服务
2. 分别启动serverA和serverB
3. 使用chrome浏览器的 simpleProxy 插件配置两个域名，servera.com => 127.0.0.1:3000 serverb.com=>127.0.0.1:4000
4. 在public/index.html中调整图片url，只使用一个域名和两个域名，查看network中的情况即可查看到分域名加载的效果