# Make A Fortune

「闷声发财」是一个通用的匿名社区前端。目前支持接入如下 RPC 服务：

* [(v2)](https://github.com/skyzh/make-a-fortune/tree/legacy) 上海交通大学匿名社区[「无可奉告」](https://wukefenggao.cn/)。（将于 2021 年 4 月 12 日 21:00 停止访问）
* (v3) 上海交通大学匿名社区[「亦可赛艇」EXCITED](https://treehole.space/)。（开发中）

您可以在「闷声发财」中通过 RPC 后端访问匿名社区，避免泄露真实 IP。如果 RPC 后端与上游服务器间的通讯链路可信，也可以避免网络嗅探与数据泄露。

## Development

```bash
npm i -g expo-cli
yarn start
yarn lint
```

## License

项目采用 MIT 协议发布。

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND

使用「闷声发财」访问社区内容，即意味着您同意所使用 RPC 后端的服务条款，且同意对应匿名社区的社区规范与服务条款。您无法使用「闷声发财」绕过对应匿名社区的限制。使用「闷声发财」时，您的所有消息（包括用户令牌、发送与接收的内容）都将通过 RPC 服务器传输。请务必确保您信任 RPC 服务器的提供者。
