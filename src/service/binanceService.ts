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

  // /**
  //  * 「売却数分差し引いた購入履歴」から平均購入価額を算出する
  //  * @param symbol 通貨ペア
  //  * @param binance 
  //  */
  // calAvePriceHaveNow(symbol: string, binance: typeof Binance) { 
  //   let sumSellQty = null;
  //   binanceUtil.getSymbolTradesBuyOrSell( config.sell, symbol, binance ) 
  //   .then(result => {
  //     sumSellQty = calculateUtil.calSumOfQty(result, binance);
  //     // console.log(`calSumOfQty: sumSellQty=`);
  //     // console.log(parseFloat(sumSellQty));
  
  //     let buyTradesHaveNow = null;
  //     binanceUtil.getSymbolTradesBuyOrSell( config.buy, symbol, binance ) 
  //     .then(result => {
  //       buyTradesHaveNow = calculateUtil.calTradesHaveNow(result, sumSellQty, binance);
  //       // console.log(`calTradesHaveNow: buyTradesHaveNow=`);
  //       // console.log(buyTradesHaveNow);
  //       const avePriceHaveNow = calculateUtil.calAvePrice(buyTradesHaveNow, binance);      
        
  //       console.log('avePriceHaveNow: ' + symbol + ' = ');
  //       console.log(avePriceHaveNow.toNumber());
  //     });
  //   });
  // }

  /**
   * 「売却数分差し引いた購入履歴」から平均購入価額を算出する
   * @param symbol 通貨ペア
   * @param binance 
   */
   async calAvePriceHaveNow(symbol: string, binance: typeof Binance): Promise<BigNumber>
   async calAvePriceHaveNow(symbol: string[], binance: typeof Binance): Promise<{ [key: string]: BigNumber; }>
  
  // 実装
  async calAvePriceHaveNow(symbol:string | string[], binance: typeof Binance): Promise<BigNumber | { [key: string]: BigNumber; }> {
    let returnVal: BigNumber | {[key: string]: BigNumber} = null;

    if(typeof symbol === 'string') {

      let sumSellQty: BigNumber = null;
      binanceUtil.getSymbolTradesBuyOrSell( config.sell, symbol, binance ) 
      .then(result => {
        sumSellQty = calculateUtil.calSumOfQty(result, binance);
        // console.log(`calSumOfQty: sumSellQty=`);
        // console.log(sumSellQty.toNumber());
    
        let buyTradesHaveNow: {[key: string]: string;}[] = null;
        binanceUtil.getSymbolTradesBuyOrSell( config.buy, symbol, binance ) 
        .then(result => {
          buyTradesHaveNow = calculateUtil.calTradesHaveNow(result, sumSellQty, binance);
          // console.log(`calTradesHaveNow: buyTradesHaveNow=`);
          // console.log(buyTradesHaveNow);
          const avePriceHaveNowB: BigNumber = calculateUtil.calAvePrice(buyTradesHaveNow, binance);      
          
          // console.log('avePriceHaveNow: ' + symbol + ' = ');
          // console.log(avePriceHaveNowB.toNumber());
          returnVal = avePriceHaveNowB;

          binanceUtil.getSymbolPrice(symbol, binance)
          .then(result => {
            console.table([result, avePriceHaveNowB.toNumber(), (new BigNumber(result).div(avePriceHaveNowB).toNumber())*100, new BigNumber(result).minus(avePriceHaveNowB).toNumber()]);
          })
        });
      });
      return returnVal;


    }else if( Array.isArray(symbol) ){

      returnVal = {};

      for(let aSymbol of symbol) {
        aSymbol = aSymbol + 'USDT';
        // console.log(aSymbol);
        let sumSellQty: BigNumber = null;
        await binanceUtil.getSymbolTradesBuyOrSell( config.sell, aSymbol, binance ) 
        .then(result => {
          sumSellQty = calculateUtil.calSumOfQty(result, binance);
          // console.log(`calSumOfQty: sumSellQty=`);
          // console.log(parseFloat(sumSellQty));
        
          let buyTradesHaveNow: {[key: string]: string;}[] = null;
          // ToDo 非同期処理を同期処理になるよう解決したい
          // (async () => {
            binanceUtil.getSymbolTradesBuyOrSell( config.buy, aSymbol, binance ) 
            .then(result => {
              buyTradesHaveNow = calculateUtil.calTradesHaveNow(result, sumSellQty, binance);
              // console.log(`calTradesHaveNow: buyTradesHaveNow=`);
              // console.log(buyTradesHaveNow);
              const avePriceHaveNowB: BigNumber = calculateUtil.calAvePrice(buyTradesHaveNow, binance);      

              // console.log('avePriceHaveNow: ' + aSymbol + ' = ' + avePriceHaveNow.toNumber());

              // 更にその価格から現在価格を見ると損益何%かを表示
              // ToDo 非同期処理を同期処理になるよう解決したい
              // (async () => {
                binanceUtil.getSymbolPrice(aSymbol, binance)
                .then(result => {

                  // これが知りたかった！
                  // console.log(aSymbol + " => 購入時: " + result + " , 購入時価格: " + avePriceHaveNow.toNumber() + " , 評価損益: " + (new BigNumber(result).div(avePriceHaveNow).toNumber())*100 + "% , " +  new BigNumber(result).minus(avePriceHaveNow).toNumber());
                  // console.log(aSymbol + " => " + (new BigNumber(result).div(avePriceHaveNow).toNumber())*100 + "% , " +  new BigNumber(result).minus(avePriceHaveNow).toNumber());

                  returnVal[aSymbol] = [result, avePriceHaveNowB.toNumber(), (new BigNumber(result).div(avePriceHaveNowB).toNumber())*100, new BigNumber(result).minus(avePriceHaveNowB).toNumber()]
                  // returnVal[aSymbol] = avePriceHaveNowB.toNumber();
                });
              // })
            });
          // })
        }).catch(error => {
          console.error(aSymbol + 'の通貨ペアが存在しないよ！');
        });
      }
      console.table(returnVal);
      

      // ToDo このコンソール内容を返してやりたい(今はPromise { <pending> }が返っている)
      // console.log(returnVal);
      return returnVal;
    }

  }

  

}