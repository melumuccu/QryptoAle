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
    const avePriceHaveNow = calculateUtil.calAvePrice(buyTradesHaveNow, binance);
    // console.log("file: binanceService.ts => line 72 => calAvePriceHaveNow => avePriceHaveNowB", avePriceHaveNowB.toNumber());

    const returnVal = {coin: coin, aveBuyPrice: avePriceHaveNow};

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

      // 平均購入価額を算出
      const avePriceHaveNowB = await this.funcCalAvePriceHaveNow(coin, binance);

      returnVal = avePriceHaveNowB;

    }else if( Array.isArray(coin) ){

      // 平均購入価額を算出
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
  async showAvePriceHaveNow(binance: typeof Binance): Promise<void> {
    // 平均購入価額を算出
    const calAvePriceHaveNow = await this.calAvePriceHaveNow(config.coin, binance);

    // コンソール出力
    for(let key in calAvePriceHaveNow) {
      console.log(magenta + key + ": " + calAvePriceHaveNow[key] + reset);
    }

    const targetCoin = calAvePriceHaveNow['coin'];
    if(typeof targetCoin === 'string') {
      // 現在価格を取得
      const nowSymbolPrice = await binanceUtil.getSymbolPrice(targetCoin + config.fiat, binance)
      console.log(magenta + "nowSymbolPrice: " + nowSymbolPrice + reset);

      // 収支割合を算出
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
  async showBalanceOfPayments(binance: typeof Binance): Promise<void> {
    // 現在保有している通貨リストを取得
    const hasCoinList = await binanceUtil.getHasCoinList(true, binance);
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
        const nowSymbolPrice = await binanceUtil.getSymbolPrice(propCoin + config.fiat, binance)
        const nowSymbolPriceDp = new BigNumber( parseFloat(nowSymbolPrice) ).dp(6);
        // 収支割合を算出
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
    if(to == config.jpy) {
      // JPY換算の場合

      const toJpy = 108;  // 仮
      const symbol = from + config.fiat;

      // 換算対象のbalanceを取得
      const balanceB = new BigNumber( parseFloat( await binanceUtil.getCoinBalance(from, binance) ) );

      let convertedfiatB: BigNumber = null;
      if(from != config.fiat) {
        // fiat換算のレートを取得
        const priceB = new BigNumber( parseFloat( await binanceUtil.getSymbolPrice(symbol, binance) ) );
        // fiat換算
        convertedfiatB = balanceB.times(priceB);
      }else{
        // fiatをfiatに換算しようとしてしまうケースを考慮
        // 換算の必要なし
        convertedfiatB = balanceB.dp(0);
      }

      // JPY換算
      const convertedJpyB = convertedfiatB.times(toJpy).dp(0);

      convertedPrice = convertedJpyB.toNumber();
    }else{
      // JPY以外に換算の場合

      const symbol = from + to;
      // 換算対象のbalanceを取得
      const balanceB = new BigNumber( parseFloat( await binanceUtil.getCoinBalance(from, binance) ) );

      let converted = null;
      /// fiatをfiatに換算しようとしてしまうケースを考慮
      if(from != to) {
        // from => to レートを取得
        const priceB = new BigNumber( parseFloat( await binanceUtil.getSymbolPrice(symbol, binance) ) );
        // 換算
        converted = balanceB.times(priceB).dp(0);
      }else{
        converted = balanceB.dp(0);
      }

      convertedPrice = converted.toNumber();
    }

    return convertedPrice;
  }

  /**
   * 所有している全通貨を指定通貨に換算
   * @param binance
   */
  async convertAllCoins(to: string, binance: typeof Binance) {
    // 通貨リストの取得
    const coinList = await binanceUtil.getHasCoinList(true, binance);
    coinList.push(config.fiat); // fiatも対象にする

    const tmp = [];
    for(let coin of coinList) {
      const from = coin;
      const convertedPrice = await this.convert(from , to, binance);

      // コンマ区切りする前にソートしないと
      // うまくソートできないためtmpに格納
      tmp.push({
        from: from,
        to: to,
        converted: convertedPrice,
      });
    }
    // ソート
    tmp.sort( (a, b) => b.converted - a.converted );
    // 換算後の合計
    const total = tmp.reduce( (sum, i) => sum + i.converted, 0);

    // コンマ区切りして格納
    const convertedList = [];
    for(let list of tmp) {
      convertedList.push({
        from: list.from,
        to: list.to,
        converted: list.converted.toLocaleString(),
      });
    }

    // 出力
    console.table(convertedList);
    console.log(`sum of converted: ${total.toLocaleString()} ${to}`);
  };

}