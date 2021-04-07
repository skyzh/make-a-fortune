import axios from "axios"
import { useRPCState, useTokenState } from "./settings"

export class Client {
  backend: string
  token?: string

  constructor(backend: string = "/", token?: string) {
    this.backend = backend
    this.token = token
  }

  async sendRequest(body: any): Promise<any> {
    return (await axios.post(`${this.backend}api/rpc_proxy`, body)).data
  }

  serialize(serializeObject: SerializeObject): any {
    return {
      op_code: serializeObject.op,
      pa_1: serializeObject.p1 || "0",
      pa_2: serializeObject.p2 || "0",
      pa_3: serializeObject.p3 || "0",
      pa_4: serializeObject.p4 || "0",
      pa_5: serializeObject.p5 || "0",
      pa_6: serializeObject.p6 || "0",
      Token: serializeObject.token || "",
    }
  }

  async requestLoginCode(request: RequestLoginCodeRequest) {
    return (await this.sendRequest(
      this.serialize(new SerializeObject("0").parameter(request.email))
    )) as RequestLoginCodeResponse
  }

  async login(request: LoginRequest) {
    return (await this.sendRequest(
      this.serialize(
        new SerializeObject("f")
          .parameter(request.email)
          .parameter(request.code)
          .parameter(request.device)
      )
    )) as LoginResponse
  }

  async fetchPost(request: FetchPostRequest) {
    return (await this.sendRequest(
      this.serialize(
        new SerializeObject(request.postType as string)
          .parameter(request.lastSeen || "NULL")
          .parameter(request.postCategory.toString())
          .provideToken(this.token)
      )
    )) as FetchPostResponse
  }

  async version() {
    return (await axios.get(`${this.backend}api/version`)).data as RPCVersion
  }
}

class RPCVersion {
  name: string
  addr: string
}

class SerializeObject {
  op: string
  token: string | null
  p1: string | null
  p2: string | null
  p3: string | null
  p4: string | null
  p5: string | null
  p6: string | null

  constructor(op: string, token?: string) {
    this.op = op
    this.token = token
    this.p_count = 1
  }

  p_count: number

  parameter(val: string) {
    switch (this.p_count) {
      case 1: {
        this.p1 = val
        break
      }
      case 2: {
        this.p2 = val
        break
      }
      case 3: {
        this.p3 = val
        break
      }
      case 4: {
        this.p4 = val
        break
      }
      case 5: {
        this.p5 = val
        break
      }
      case 6: {
        this.p6 = val
        break
      }
    }
    this.p_count += 1

    return this
  }

  provideToken(token?: string) {
    if (!token || token == "") {
      throw new Error("需要登录才能进行操作")
    }
    this.token = token
    return this
  }
}

class RequestLoginCodeRequest {
  email: string
}

class RequestLoginCodeResponse {
  VarifiedEmailAddress: number
}

class LoginRequest {
  email: string
  code: string
  device: string
}

class LoginResponse {
  login_flag: number
  Token: string
}

export enum PostType {
  Time = "1",
  Favoured = "6",
  My = "7",
  Trending = "d",
  Message = "a",
}

export enum PostCategory {
  All = 0,
  Campus = 1,
  Entertainment = 2,
  Emotion = 3,
  Science = 4,
  IT = 5,
  Social = 6,
  Music = 7,
  Movie = 8,
  Art = 9,
  Life = 10,
}

export class FetchPostRequest {
  postType: PostType
  postCategory: PostCategory
  lastSeen?: string
}

export class Thread {
  ThreadID: string
  Block: number
  Title: string
  Summary: string
  Like: number
  Dislike: number
  Comment: number
  Read: number
  LastUpdateTime: string
  AnonymousType: string
  PostTime: string
  RandomSeed: number
  WhetherTop: number
  Tag: string
}

export class FetchPostResponse {
  LastSeenThreadID: string
  thread_list: Thread[]
}

export function useClient() {
  const [rpc, _setRpc] = useRPCState()
  const [token, _setToken] = useTokenState()
  return new Client(rpc, token)
}
