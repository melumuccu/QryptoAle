export class OtherUtil {
  // プリミティブの判定
  isString = (arg: any): arg is string  => typeof arg === "string";
  isNumber = (arg: any): arg is number  => typeof arg === "number";

}

// -----------------interface

// Ticker型
export interface Ticker {
  [x: string]: string | PromiseLike<string>
}

// Balance型
export interface Balance {
  [x: string]: {
    available: string
    onOrder: string;
  };
}

// Trade型
export interface Trade {
  symbol: string,
  id: number,
  orderId: number,
  orderListId: number,
  price: string,
  qty: string,
  quoteQty: string,
  commission: string,
  commissionAsset: string,
  time: string,
  isBuyer: boolean,
  isMaker: boolean,
  isBestMatch: boolean
}

// Props型
export interface Props {
  coin: string,
  aveBuyPrice: number
}
