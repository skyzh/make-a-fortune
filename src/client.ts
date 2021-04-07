import axios from 'axios';

export class Client {
  backend: string;

  constructor(backend: string = "/") {
    this.backend = backend
  }

  async sendRequest(body: any): Promise<any> {
    return (await axios.post(`${this.backend}api/rpc_proxy`, body)).data
  }

  serialize(serializeObject: SerializeObject): any {
    return {
      "op_code": serializeObject.op,
      "pa_1": serializeObject.p1 || "0",
      "pa_2": serializeObject.p2 || "0",
      "pa_3": serializeObject.p3 || "0",
      "pa_4": serializeObject.p4 || "0",
      "pa_5": serializeObject.p5 || "0",
      "pa_6": serializeObject.p6 || "0",
      "Token": serializeObject.token || ""
    }
  }

  async requestLoginCode(request: RequestLoginCodeRequest) {
    return await this.sendRequest(
      this.serialize(new SerializeObject("0").parameter(request.email))
    ) as RequestLoginCodeResponse
  }

  async login(request: LoginRequest) {
    return await this.sendRequest(
      this.serialize(new SerializeObject("f")
        .parameter(request.email)
        .parameter(request.code)
        .parameter(request.device))
    ) as LoginResponse
  }

  async version() {
    return (await axios.get(`${this.backend}api/version`)).data as RPCVersion
  }
}

class RPCVersion {
  name: string;
  addr: string;
}

class SerializeObject {
  op: string;
  token: string | null;
  p1: string | null;
  p2: string | null;
  p3: string | null;
  p4: string | null;
  p5: string | null;
  p6: string | null;

  constructor(op : string, token?: string) {
    this.op = op
    this.token = token
    this.p_count = 1
  }

  p_count: number

  parameter(val: string) {
    switch (this.p_count) {
      case 1: {
        this.p1 = val
        break;
      }
      case 2: {
        this.p2 = val
        break;
      }
      case 3: {
        this.p3 = val
        break;
      }
      case 4: {
        this.p4 = val
        break;
      }
      case 5: {
        this.p5 = val
        break;
      }
      case 6: {
        this.p6 = val
        break;
      }
    }
    this.p_count += 1

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


const client = new Client()

export default client