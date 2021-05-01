export class OtherUtil {
  // プリミティブの判定
  isString = (arg: any): arg is string  => typeof arg === "string";
  isNumber = (arg: any): arg is number  => typeof arg === "number";

}