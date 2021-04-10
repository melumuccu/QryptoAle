/**
 * Binanceから取得したデータを処理するクラス
 */

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
  //       console.log(parseFloat(avePriceHaveNow));
  //     });
  //   });
  // }

  /**
   * 「売却数分差し引いた購入履歴」から平均購入価額を算出する
   * @param symbol 通貨ペア
   * @param binance 
   */
  calAvePriceHaveNow(symbol: string, binance: typeof Binance)
  
  { 
    let sumSellQty = null;
    binanceUtil.getSymbolTradesBuyOrSell( config.sell, symbol, binance ) 
    .then(result => {
      sumSellQty = calculateUtil.calSumOfQty(result, binance);
      // console.log(`calSumOfQty: sumSellQty=`);
      // console.log(parseFloat(sumSellQty));
  
      let buyTradesHaveNow = null;
      binanceUtil.getSymbolTradesBuyOrSell( config.buy, symbol, binance ) 
      .then(result => {
        buyTradesHaveNow = calculateUtil.calTradesHaveNow(result, sumSellQty, binance);
        // console.log(`calTradesHaveNow: buyTradesHaveNow=`);
        // console.log(buyTradesHaveNow);
        const avePriceHaveNow = calculateUtil.calAvePrice(buyTradesHaveNow, binance);      
        
        console.log('avePriceHaveNow: ' + symbol + ' = ');
        console.log(avePriceHaveNow.toNumber());
      });
    });
  }
 
}













/**
 * 「売却数分差し引いた購入履歴」から平均購入価額を算出する(所有している全通貨分)
 */
//  binanceUtil.getHasCoinList(binance)
//  .then(result => {
//    console.log(`getHasCoinList: ${result}`);
 
//    for(let hasCoin of result) {
//      const symbol = hasCoin + 'USDT';
     
//    }
 
//  });
 
//  binanceUtil.getSymbolTradesBuyOrSell( buy, symbol, binance ) 
//    .then(result => {
//      const avePrice = calculateUtil.calAveOfPrice(result, binance);
//      // console.log(`calAveOfPrice: `);
//      // console.log(parseFloat(avePrice));
//    });
 
//    let sumSellQty = null;
//    binanceUtil.getSymbolTradesBuyOrSell( sell, symbol, binance ) 
//    .then(result => {
//      sumSellQty = calculateUtil.calSumOfQty(result, binance);
//      // console.log(`calSumOfQty: sumSellQty=`);
//      // console.log(parseFloat(sumSellQty));
 
//      let buyTradesHaveNow = null;
//      binanceUtil.getSymbolTradesBuyOrSell( buy, symbol, binance ) 
//      .then(result => {
//        buyTradesHaveNow = calculateUtil.calTradesHaveNow(result, sumSellQty, binance);
//        // console.log(`calTradesHaveNow: buyTradesHaveNow=`);
//        // console.log(buyTradesHaveNow);
//        const avePriceHaveNow = calculateUtil.calAveOfPrice(buyTradesHaveNow, binance);      console.log(`calTradesHaveNow: buyTradesHaveNow=`);
//        console.log('avePriceHaveNow = ');
//        console.log(parseFloat(avePriceHaveNow));
//      });
//    });