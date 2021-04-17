/**
 * Binanceから取得したデータを処理するクラス
 */

import BigNumber from 'bignumber.js';
import { table } from 'node:console';
import {Config} from '../config/config';
import {BinanceUtil} from '../util/binanceUtil';
import {CalculateUtil} from '../util/calculateUtil';

//  クラス作成
const config = new Config();
const binanceUtil = new BinanceUtil();
const calculateUtil = new CalculateUtil();

// Binance ログイン
const Binance = require('node-binance-api');
// const binance = new Binance().options(login);


export class BinanceService {

  /**
   * 「売却数分差し引いた購入履歴」から平均購入価額を算出する
   * @param coin 通貨ペア string: ex.BTC  string[]: ex.[BTC, XEM, ...]
   * @param binance
   */
  async calAvePriceHaveNow(coin: string, binance: typeof Binance): Promise<BigNumber>
  async calAvePriceHaveNow(coin: string[], binance: typeof Binance): Promise<{ [key: string]: BigNumber; }>

  // 実装
  async calAvePriceHaveNow(coin:string | string[], binance: typeof Binance): Promise<BigNumber | { [key: string]: BigNumber; }> {
    let returnVal: BigNumber | {[key: string]: BigNumber} = null;

    if(typeof coin === 'string') {

      // let sumSellQty: BigNumber = null;
      // binanceUtil.getSymbolTradesBuyOrSell( config.sell, symbol, binance )
      // .then(result => {
      //   sumSellQty = calculateUtil.calSumOfQty(result, binance);
      //   // console.log(`calSumOfQty: sumSellQty=`);
      //   // console.log(sumSellQty.toNumber());

      //   let buyTradesHaveNow: {[key: string]: string;}[] = null;
      //   binanceUtil.getSymbolTradesBuyOrSell( config.buy, symbol, binance )
      //   .then(result => {
      //     buyTradesHaveNow = calculateUtil.calTradesHaveNow(result, sumSellQty, binance);
      //     // console.log(`calTradesHaveNow: buyTradesHaveNow=`);
      //     // console.log(buyTradesHaveNow);
      //     const avePriceHaveNowB: BigNumber = calculateUtil.calAvePrice(buyTradesHaveNow, binance);

      //     // console.log('avePriceHaveNow: ' + symbol + ' = ');
      //     // console.log(avePriceHaveNowB.toNumber());
      //     returnVal = avePriceHaveNowB;

      //     binanceUtil.getSymbolPrice(symbol, binance)
      //     .then(result => {
      //       console.table([result, avePriceHaveNowB.toNumber(), (new BigNumber(result).div(avePriceHaveNowB).toNumber())*100, new BigNumber(result).minus(avePriceHaveNowB).toNumber()]);
      //     })
      //   });
      // });

      const buyTradesHaveNow = calculateUtil.calTradesHaveNow(coin, binance);
      console.log('buyTradesHaveNow', buyTradesHaveNow);


      return returnVal;


    }else if( Array.isArray(coin) ){

      returnVal = {};

      for(let aCoin of coin) {
        const aSymbol = aCoin + config.fiat;
        // console.log(aSymbol);
        let sumSellQty: BigNumber = null;
        await binanceUtil.getSymbolTradesBuyOrSell( config.sell, aCoin, binance )
        .then(result => {
          sumSellQty = calculateUtil.calSumOfQty(result, binance);
          // console.log(`calSumOfQty: sumSellQty=`);
          // console.log(parseFloat(sumSellQty));

          let buyTradesHaveNow: {[key: string]: string;}[] = null;
          // ToDo 非同期処理を同期処理になるよう解決したい
          // (async () => {
            binanceUtil.getSymbolTradesBuyOrSell( config.buy, aCoin, binance )
            .then(result => {

              // ToDO一旦コメントアウトしてる
              // buyTradesHaveNow = await calculateUtil.calTradesHaveNow(aSymbol, binance);

              // console.log(`calTradesHaveNow: buyTradesHaveNow=`);
              // console.log(buyTradesHaveNow);
              const avePriceHaveNowB: BigNumber = calculateUtil.calAvePrice(buyTradesHaveNow, binance);

              // console.log('avePriceHaveNow: ' + aSymbol + ' = ' + avePriceHaveNow.toNumber());

              // 更にその価格から現在価格を見ると損益何%かを表示
              // ToDo 非同期処理を同期処理になるよう解決したい
              // (async () => {
                binanceUtil.getSymbolPrice(aCoin, binance)
                .then(result => {

                  // これが知りたかった！
                  // console.log(aSymbol + " => 購入時: " + result + " , 購入時価格: " + avePriceHaveNow.toNumber() + " , 評価損益: " + (new BigNumber(result).div(avePriceHaveNow).toNumber())*100 + "% , " +  new BigNumber(result).minus(avePriceHaveNow).toNumber());
                  // console.log(aSymbol + " => " + (new BigNumber(result).div(avePriceHaveNow).toNumber())*100 + "% , " +  new BigNumber(result).minus(avePriceHaveNow).toNumber());

                  returnVal[aCoin] = [result, avePriceHaveNowB.toNumber(), (new BigNumber(result).div(avePriceHaveNowB).toNumber())*100, new BigNumber(result).minus(avePriceHaveNowB).toNumber()]
                  // returnVal[aSymbol] = avePriceHaveNowB.toNumber();
                });
              // })
            });
          // })
        }).catch(error => {
          console.error(aCoin + 'の通貨ペアが存在しないよ！');
        });
      }
      console.table(returnVal);


      // ToDo このコンソール内容を返してやりたい(今はPromise { <pending> }が返っている)
      // console.log(returnVal);
      return returnVal;
    }

  }



}