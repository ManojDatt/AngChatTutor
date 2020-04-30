export interface Deserializable {
    deserialize(input: any): this;
  }

export class ResponseModel implements Deserializable {
     code: number;
     message: string;
     error_message: string;
     data: Array<any>;

     deserialize(input: any): this {
        return Object.assign(this, input);
      }
      
      getCode() {
        return this.code;
      }
      getData() {
        return this.data;
      }
  }