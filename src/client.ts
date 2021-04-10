import axios from "axios"
import { useRPCState, useTokenState } from "./settings"

export class BannedError extends Error {
  resp: any

  constructor(resp: any) {
    super("Banned")
    this.resp = resp

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BannedError.prototype)
  }
}

export class ActionError extends Error {
  constructor(message: string) {
    super(message)
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ActionError.prototype)
  }
}

export class Client {
  backend: string
  token?: string

  constructor(backend: string = "/", token?: string) {
    this.backend = backend
    if (!this.backend.endsWith("/")) {
      this.backend += "/"
    }
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

  checkResponse(response: any, requiredField?: string) {
    if (response === "") {
      throw new Error("No Response")
    }
    if (response.login_flag === "-1") {
      throw new BannedError(response)
    }
    if (response.login_flag === "0") {
      throw new Error("登录 Token 已过期，请重新登录")
    }
    if (requiredField && response["requiredField"] != 1) {
      throw new ActionError(`${requiredField} 失败`)
    }
    if (response.ExistFlag === "0") {
      throw new ActionError(`帖子已被屏蔽`)
    }
    return response
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
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject(request.postType.toString())
            .parameter(request.lastSeen || "NULL")
            .parameter(request.postCategory.toString())
            .provideToken(this.token)
        )
      )
    ) as FetchPostResponse
  }

  async fetchReply(request: FetchReplyRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("2")
            .parameter(request.postId)
            .parameter(request.lastSeen || "NULL")
            .parameter(request.order)
            .provideToken(this.token)
        )
      )
    ) as FetchReplyResponse | null
  }

  async likePost(request: ActionPostRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("8_3")
            .parameter(request.postId)
            .provideToken(this.token)
        )
      )
    )
  }

  async cancelLikePost(request: ActionPostRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("8_4")
            .parameter(request.postId)
            .provideToken(this.token)
        )
      )
    )
  }

  async dislikePost(request: ActionPostRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("9")
            .parameter(request.postId)
            .provideToken(this.token)
        )
      )
    )
  }

  async cancelDislikePost(request: ActionPostRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("9_2")
            .parameter(request.postId)
            .provideToken(this.token)
        )
      )
    )
  }

  async favorPost(request: ActionPostRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("5")
            .parameter(request.postId)
            .provideToken(this.token)
        )
      )
    )
  }

  async defavorPost(request: ActionPostRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("5_2")
            .parameter(request.postId)
            .provideToken(this.token)
        )
      )
    )
  }

  async version() {
    return (await axios.get(`${this.backend}api/version`)).data as RPCVersion
  }

  async likeReply(request: ActionReplyRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("8")
            .parameter(request.postId)
            .parameter(null)
            .parameter(null)
            .parameter(request.replyId)
            .provideToken(this.token)
        )
      )
    )
  }

  async cancelLikeReply(request: ActionReplyRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("8_2")
            .parameter(request.postId)
            .parameter(null)
            .parameter(null)
            .parameter(request.replyId)
            .provideToken(this.token)
        )
      )
    )
  }

  async dislikeReply(request: ActionReplyRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("8_5")
            .parameter(request.postId)
            .parameter(null)
            .parameter(null)
            .parameter(request.replyId)
            .provideToken(this.token)
        )
      )
    )
  }

  async cancelDislikeReply(request: ActionReplyRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("8_6")
            .parameter(request.postId)
            .parameter(null)
            .parameter(null)
            .parameter(request.replyId)
            .provideToken(this.token)
        )
      )
    )
  }

  async report(request: ActionPostRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("e")
            .parameter(request.postId)
            .provideToken(this.token)
        )
      )
    )
  }

  async reportReply(request: ActionReplyRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("h")
            .parameter(request.postId)
            .parameter(request.replyId)
            .provideToken(this.token)
        )
      )
    )
  }

  async replyReply(request: ReplyReplyRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("4_2")
            .parameter(request.postId)
            .parameter(null)
            .parameter(request.content)
            .parameter(request.replyId)
            .provideToken(this.token)
        )
      )
    )
  }

  async replyPost(request: ReplyPostRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("4")
            .parameter(request.postId)
            .parameter(null)
            .parameter(request.content)
            .parameter("")
            .provideToken(this.token)
        )
      )
    )
  }

  async search(request: SearchRequest) {
    return this.checkResponse(
      await this.sendRequest(
        this.serialize(
          new SerializeObject("b")
            .parameter(request.keyword)
            .parameter(request.lastSeen || "NULL")
            .provideToken(this.token)
        )
      )
    )
  }

  async verifyToken(token?: string) {
    return (await this.sendRequest(
      this.serialize(
        token
          ? new SerializeObject("-1").provideToken(token)
          : new SerializeObject("-1")
      )
    )) as VerifyTokenResponse
  }
}

export class RPCVersion {
  name!: string
  addr!: string
  version?: string
  terms_of_service?: string
  rpc_source_code?: string
  rpc_terms_of_service?: string
}

class SerializeObject {
  op: string
  token: string | null
  p1!: string | null
  p2!: string | null
  p3!: string | null
  p4!: string | null
  p5!: string | null
  p6!: string | null

  constructor(op: string, token?: string) {
    this.op = op
    this.token = token ?? null
    this.p_count = 1
  }

  p_count: number

  parameter(val: string | null) {
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
    if (!token || token === "") {
      throw new Error("需要登录才能进行操作")
    }
    this.token = token
    return this
  }
}

class RequestLoginCodeRequest {
  email!: string
}

class RequestLoginCodeResponse {
  VarifiedEmailAddress!: number
}

class LoginRequest {
  email!: string
  code!: string
  device!: string
}

class LoginResponse {
  login_flag!: number
  Token!: string
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
  postType!: PostType
  postCategory!: PostCategory
  lastSeen?: string
}

export class Thread {
  ThreadID!: string
  Block!: number
  Title!: string
  Summary!: string
  Like!: number
  Dislike!: number
  Comment!: number
  Read!: number
  LastUpdateTime!: string
  AnonymousType!: string
  PostTime!: string
  RandomSeed!: number
  WhetherTop!: number
  Tag!: string
  // only available in `this_thread` of post details
  WhetherFavour?: number
  WhetherLike?: number
  WhetherReport?: number
  // only available in notifications
  Judge?: number
  Type?: number
}

export class FetchPostResponse {
  LastSeenThreadID?: string
  LastSeenHotThreadID?: string
  LastSeenMyThreadID?: string
  LastSeenFavorThreadID?: string
  LastSeenMessageThreadID?: string
  thread_list?: Thread[]
  message_list?: Thread[]
}

export type LastSeenField = NonNullable<{
  [K in keyof FetchPostResponse]:
  FetchPostResponse[K] extends (string | undefined) ? K : never
}[keyof FetchPostResponse]>

export enum ReplyOrder {
  Earliest = "0",
  Newest = "1",
  Host = "-1",
  Hot = "2",
}

export class FetchReplyRequest {
  postId!: string
  order!: ReplyOrder
  lastSeen?: string
}

export class Floor {
  FloorID!: string
  Speakername!: string
  Replytoname!: string
  Replytofloor!: number
  Context!: string
  RTime!: string
  Like!: number
  Dislike!: number
  WhetherLike!: number
  WhetherReport!: number
}

export class FetchReplyResponse {
  LastSeenFloorID!: string
  ExistFlag!: string
  floor_list!: Floor[]
  this_thread!: Thread
}

export class ActionPostRequest {
  postId!: string
}

export class ActionReplyRequest {
  postId!: string
  replyId!: string
}

export class ReplyReplyRequest {
  postId!: string
  replyId!: string
  content!: string
}

export class ReplyPostRequest {
  postId!: string
  content!: string
}

export class SearchRequest {
  keyword!: string
  lastSeen?: string
}

export class VerifyTokenResponse {
  login_flag!: string
}

export function useClient() {
  const [rpc, _setRpc] = useRPCState()
  const [token, _setToken] = useTokenState()
  return new Client(rpc, token)
}
