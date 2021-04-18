/**
 * Binanceから取得したデータを処理するクラス
 */

import BigNumber from 'bignumber.js';
import {Config} from '../config/config';
import {BinanceUtil} from '../util/binanceUtil';
import {CalculateUtil} from '../util/calculateUtil';

const Binance = require('node-binance-api');

//  クラス作成
const config = new Config();
const binanceUtil = new BinanceUtil();
const calculateUtil = new CalculateUtil();

// 各コンフィグ
const {fiat, coin, symbol, buy, sell} = config;
const {cyan, red, green, yellow, magenta, reset} = config // ログの色付け用



// --------------------------------

export class BinanceService {

  /**
   * 関数calAvePriceHaveNowの処理部分
   * @param coin
   * @param binance
   */
  async funcCalAvePriceHaveNow(coin: string, binance: typeof Binance): Promise<{[key:string]: string | number;}>{

    // 現在持っている数量分の購入履歴を取得
    const buyTradesHaveNow = await calculateUtil.calTradesHaveNow(coin, binance);
    // console.log("file: binanceService.ts => line 67 => calAvePriceHaveNow => buyTradesHaveNow", buyTradesHaveNow);

    // 購入履歴から平均価格を算出
    const avePriceHaveNow: number = calculateUtil.calAvePrice(buyTradesHaveNow, binance);
    // console.log("file: binanceService.ts => line 72 => calAvePriceHaveNow => avePriceHaveNowB", avePriceHaveNowB.toNumber());

    const returnVal: {[key:string]: string | number;} = {coin: coin, aveBuyPrice: avePriceHaveNow};

    return returnVal;
  }

  /**
   * 「売却数分差し引いた購入履歴」から平均購入価額を算出する
   * @param coin 通貨ペア string: ex.BTC  string[]: ex.[BTC, XEM, ...]
   * @param binance
   */
  // オーバーロード
  async calAvePriceHaveNow(coin: string, binance: typeof Binance): Promise< {[key: string]: string | number;} >
  async calAvePriceHaveNow(coin: string[], binance: typeof Binance): Promise< {[key: string]: string | number;}[]>

  // 実装
  async calAvePriceHaveNow(coin:string | string[], binance: typeof Binance): Promise< {[key: string]: string | number} | {[key: string]: string | number;}[] > {
    // console.log("file: binanceService.ts => line 54 => calAvePriceHaveNow => coin", coin);
    let returnVal: { [key: string]: string | number } | {[key: string]: string | number}[] = null;

    // オーバーロードの分岐
    if(typeof coin === 'string') {

      const avePriceHaveNowB = await this.funcCalAvePriceHaveNow(coin, binance);

      returnVal = avePriceHaveNowB;

    }else if( Array.isArray(coin) ){

      // 非同期ループ処理
      const tasks = coin.map(coin => this.funcCalAvePriceHaveNow(coin, binance));
      // console.log("file: binanceService.ts => line 55 => calAvePriceHaveNow => tasks", tasks);

      const solvedTasks = await Promise.all(tasks);
      // console.log("file: binanceService.ts => line 72 => calAvePriceHaveNow => solvedTasks", solvedTasks);

      returnVal = solvedTasks;

    } //--------------- if-else end
    return returnVal;
  }



}