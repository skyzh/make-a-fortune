import { VercelRequest, VercelResponse } from "@vercel/node"
import { allowCors, Client } from "./_misc"

const handler = (request: VercelRequest, response: VercelResponse) => {
  const client = new Client()
  response.status(200).json({
    "name": "「无可奉告」Android 版",
    "addr": `tcp://${client.host}:${client.port}`,
    "terms_of_service": "http://wukefenggao.cn/code",
    "rpc_source_code": "https://github.com/skyzh/make-a-fortune/blob/master/api/rpc_proxy.ts",
    "rpc_terms_of_service": "https://github.com/skyzh/make-a-fortune/blob/master/LICENSE",
    "version": "JavaScript, Vercel Function"
  })
}

export default allowCors(handler)
