/**
 * 各種config
 */

export class Config {
  jpy: string = "JPY";
  fiat: string = 'USDT';
  coin: string = 'SAND';
  symbol: string = this.coin + this.fiat;
  buy: boolean = true;
  sell: boolean = false;

  // ログ色制御用
  // ex. console.log(red + 'This text is red. ' + green + 'Greeeeeeen!' + reset);
  cyan: string = '\u001b[36m';
  red: string = '\u001b[31m';
  yellow: string = '\u001b[33m';
  green: string = '\u001b[32m';
  magenta: string = '\u001b[35m';

  reset: string = '\u001b[0m';

}