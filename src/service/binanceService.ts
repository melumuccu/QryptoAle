/**
 * Binanceから取得したデータを処理するクラス
 */

import BigNumber from 'bignumber.js';
import {Config} from '../config/config';
import {BinanceUtil} from '../util/binanceUtil';
import {CalculateUtil} from '../util/calculateUtil';
import {OtherUtil} from '../util/otherUtil';

const Binance = require('node-binance-api');

//  クラス作成
const config = new Config();
const binanceUtil = new BinanceUtil();
const calculateUtil = new CalculateUtil();
const otherUtil = new OtherUtil();

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

  /**
   * 1つのsymbolについて
   * 現在保有数量から平均取得価額を算出する
   * @param binance
   */
  async showAvePriceHaveNow(binance: typeof Binance) {
    const calAvePriceHaveNow= await this.calAvePriceHaveNow(coin, binance);
    for(let key in calAvePriceHaveNow) {
      console.log(magenta + key + ": " + calAvePriceHaveNow[key] + reset);
    }
    const targetCoin = calAvePriceHaveNow['coin'];
    if(typeof targetCoin === 'string') {
      const nowSymbolPrice = await binanceUtil.getSymbolPrice(targetCoin+fiat, binance)
      console.log(magenta + "nowSymbolPrice: " + nowSymbolPrice + reset);

      const balanceOfPayments = new BigNumber( parseFloat(nowSymbolPrice) ).div(calAvePriceHaveNow['aveBuyPrice']).times(100);
      console.log(magenta + "balanceOfPayments: " + balanceOfPayments + reset);
    }
  }

  /**
   * 現在保有しているsymbol全てについて
   * ・現在保有数量から平均取得価額を算出する
   * ・平均取得価額は現在取引価額から見て収支が何%かを算出する
   * @param binance
   */
  async showBalanceOfPayments(binance: typeof Binance) {
    // 現在保有している通貨リストを取得
    const hasCoinList: string[] = await binanceUtil.getHasCoinList(true, binance);
    // console.log("file: app.ts => line 82 => hasCoinList", hasCoinList);

    // 各通貨の平均購入価額を算出する
    const avePriceHasCoins = await this.calAvePriceHaveNow(hasCoinList, binance);
    // console.log("file: binanceService.ts => line 100 => showBalanceOfPayments => this", this);

    const result = [];
    for(let avePrice of avePriceHasCoins) {

      const {coin: propCoin, aveBuyPrice: propAveBuyPrice} = avePrice;

      if( otherUtil.isString(propCoin) && otherUtil.isNumber(propAveBuyPrice) ) {
        // 平均購入価額を丸める(四捨五入)
        const propAveBuyPriceDp = new BigNumber( propAveBuyPrice ).dp(6); // 6桁精度
        // 現在価格を取得
        const nowSymbolPrice: string = await binanceUtil.getSymbolPrice(propCoin+fiat, binance)
        const nowSymbolPriceDp = new BigNumber( parseFloat(nowSymbolPrice) ).dp(6);
        // 平均取得価額は現在価額から見て収支は何%かを算出
        const balanceOfPayments = new BigNumber( parseFloat(nowSymbolPrice) ).div( new BigNumber(propAveBuyPrice) ).times(100);
        const balanceOfPaymentsDp = balanceOfPayments.dp(1);
        let balanceOfPaymentsStrZeroPadding = balanceOfPaymentsDp.toString();
        if(balanceOfPaymentsStrZeroPadding.substr(-2, 1) != '.') {
          // 0で埋める
          balanceOfPaymentsStrZeroPadding = balanceOfPaymentsStrZeroPadding + '.0';
        }

        // 結果をプッシュ
        result.push({
            coin: propCoin
          , aveBuyPrice: propAveBuyPriceDp.toNumber()
          , nowSymbolPrice: nowSymbolPriceDp.toNumber()
          , balanceOfPayments: balanceOfPaymentsStrZeroPadding
        });
      }else{
        console.error(red + "file: app.ts => line 110 " + reset);
        console.error(red + "【propCoin != null && propAveBuyPrice != null】 => false" + reset);
      }
    }

    // 結果の出力
    console.table(result);
  }

  /**
   * from => to 換算
   * @param from 通貨
   * @param to 通貨
   * @param binance
   * @returns 換算後の値
   */
  async convert(from: string, to: string, binance: typeof Binance): Promise<number> {

    let convertedPrice: number = null;
    if(to == 'JPY') {
      const toJpy = 108;  // 仮
      const symbol = from + config.fiat;

      // 換算対象のbaanceを取得
      const balanceB = new BigNumber( parseFloat( await binanceUtil.getCoinBalance(from, binance) ) );
      // fiat換算のレートを取得
      const priceB = new BigNumber( parseFloat( await binanceUtil.getSymbolPrice(symbol, binance) ) );

      // fiat換算
      const convertedfiatB = balanceB.times(priceB);
      // JPY換算
      const convertedJpyB = convertedfiatB.times(toJpy).dp(0);

      convertedPrice = convertedJpyB.toNumber();
    }else{
      const symbol = from + to;
      // 換算対象のbaanceを取得
      const balanceB = new BigNumber( parseFloat( await binanceUtil.getCoinBalance(from, binance) ) );
      // from => to レートを取得
      const priceB = new BigNumber( parseFloat( await binanceUtil.getSymbolPrice(symbol, binance) ) );
      // 換算
      const converted = balanceB.times(priceB).dp(0);

      convertedPrice = converted.toNumber();
    }

    console.log(`converted ${from} => ${to} : ${convertedPrice}`);
    return convertedPrice;
  }

}