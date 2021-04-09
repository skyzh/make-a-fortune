from aiohttp import web
import aiohttp_cors
import asyncio


class Client(object):
    """Wukefenggao TCP Client
    """

    def __init__(self, addr="182.254.145.254", port=8080):
        self.addr = addr
        self.port = port

    async def send_message(self, message):
        reader, writer = await asyncio.open_connection(self.addr, self.port)
        writer.write(message.encode())
        await writer.drain()
        data = await reader.readline()
        return data


client = Client()


async def handle(request):
    """Handle a connection
    """
    req = await request.text()
    resp = await client.send_message(req)
    resp = resp.decode()
    return web.json_response(text=resp)


async def version(request):
    return web.json_response({
        "name": "「无可奉告」Android 版",
        "addr": f'tcp://{client.addr}:{client.port}',
        "terms_of_service": "http://wukefenggao.cn/code",
        "rpc_source_code": "https://github.com/skyzh/make-a-fortune/blob/master/tcp_proxy/__main__.py",
        "rpc_terms_of_service": "https://github.com/skyzh/make-a-fortune/blob/master/LICENSE"
    })

app = web.Application()
cors = aiohttp_cors.setup(app, defaults={
    "*": aiohttp_cors.ResourceOptions(
        expose_headers="*",
        allow_headers="*",
    ),
})

app.add_routes([web.post('/api/rpc_proxy', handle)])
app.add_routes([web.get('/api/version', version)])

for route in list(app.router.routes()):
    cors.add(route)

if __name__ == '__main__':
    web.run_app(app)
