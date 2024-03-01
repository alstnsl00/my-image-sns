// interface로 정의하지 않는 이유 js로 컴파일 되서도 class는 확인이 가능하기 때문에..
export class Result {
  status: number;
  msg: string;
  data?: Record<string, any>;
}
