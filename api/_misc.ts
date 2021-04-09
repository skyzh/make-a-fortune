const net = require("net")

export const allowCors = fn => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  )
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

export class Client {
  host: string
  port: number

  constructor(host = "182.254.145.254", port = 8080) {
    this.host = host
    this.port = port
  }

  send_message = (message) => new Promise((resolve, reject) => {
    const client = net.createConnection({ host: this.host, port: this.port }, () => {
      client.write(JSON.stringify(message))
    })

    client.on("data", (data) => {
      // response.status(200).json
      resolve(JSON.parse(data.toString()))
      client.end()
    })
    client.on("error", (e) => {
      // response.status(500).json
      reject(e)
    })
  })
}

// TODO: It's not a good idea to put non-function scripts into /api directory.
