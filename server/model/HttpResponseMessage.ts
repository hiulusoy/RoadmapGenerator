// httpResponseMessage.ts

export class HttpResponseMessageBuilder {
  private response: { success: boolean; data?: any; totalCount?: number; msg?: string; error?: any } = {
    success: false,
  };

  success(value: boolean): this {
    this.response.success = value;
    return this;
  }

  responseData(data: any): this {
    this.response.data = data;
    return this;
  }

  totalCount(count: number): this {
    this.response.totalCount = count;
    return this;
  }

  msg(message: string): this {
    this.response.msg = message;
    return this;
  }

  error(err: any): this {
    this.response.error = err;
    return this;
  }

  build(): object {
    return this.response;
  }
}
