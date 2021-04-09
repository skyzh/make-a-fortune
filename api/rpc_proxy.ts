import { VercelRequest, VercelResponse } from "@vercel/node"
import { allowCors, Client } from "./_misc"

const handler = (request: VercelRequest, response: VercelResponse) => {
  const { body } = request
  const client = new Client()

  client.send_message(body)
    .then((res) => response.status(200).json(res))
    .catch((e) => response.status(500).json({}))
}

export default allowCors(handler)
