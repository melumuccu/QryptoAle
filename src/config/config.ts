/**
 * 各種config
 */

export class Config {
  fiat: string = 'USDT'
  coin: string = 'BTC';
  symbol: string = this.coin + this.fiat;
  buy: boolean = true;
  sell: boolean = false;

}