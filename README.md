# Make A Fortune

「闷声发财」是一个通用的匿名社区前端。目前支持接入如下 RPC 服务：

* 上海交通大学匿名社区 无可奉告。

您可以在「闷声发财」中通过 RPC 后端访问匿名社区，避免泄露真实 IP。

## Usage

启动 RPC Server
```bash
pipenv install
pipenv run python -m tcp_proxy
```

启动前端
```bash
yarn install
yarn start
```

## Deployment

```
您 <-> 闷声发财前端 <-> RPC 后端 <-> 匿名社区
```

### Frontend

前端目前部署在 Vercel 上。您可以通过 https://make-a-fortune.vercel.app/ 访问。

### RPC Server

您可以在本地启动 `tcp_proxy` 来使用本地 RPC 后端。我们同时也提供了一些可用的后端：

* https://fortune.skyzh.dev ，服务器坐标日本。提供无可奉告 Android 版 RPC 后端。
* https://make-a-fortune.vercel.app ，通过 Vercel Function 提供服务。提供无可奉告 Android 版 RPC 后端。
* https://fortune.fly.dev ，通过 Fly.io 提供服务。提供无可奉告 Android 版 RPC 后端（Rust 实现）。
* https://fortune.lightquantum.me:9108 ，服务器坐标上海（带宽很小）。提供无可奉告 Android 版 RPC 后端（Rust 实现）。

## License

项目采用 MIT 协议发布。

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND

使用「闷声发财」访问社区内容，即意味着您同意所使用 RPC 后端的服务条款，且同意对应匿名社区的社区规范与服务条款。
您无法使用「闷声发财」绕过对应匿名社区的限制。使用「闷声发财」时，您的所有消息（包括用户令牌、发送与接收的内容）
都将通过 RPC 服务器传输。请务必确保您信任 RPC 服务器的提供者。
