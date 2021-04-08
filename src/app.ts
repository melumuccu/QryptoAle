import {login} from './config/login';
import {BinanceUtil} from './util/binanceUtil';
import {CalculateUtil} from './util/calculateUtil';

const Binance = require('node-binance-api');
const binance = new Binance().options(login);

const symbol = 'BNBUSDT';
const coin = 'BTC';
const isBuy = true;

//  クラス作成
const binanceUtil = new BinanceUtil();
const calculateUtil = new CalculateUtil();

// ----------------------------------------------------

// binanceUtil.getSymbolPrice(symbol, binance)
// .then(result => {
//   console.log(`getSymbolPrice: ${symbol} => ${result}`);
// });

// binanceUtil.getCoinBalance(coin, binance)
// .then(result => {
//   console.log(`getCoinBalance: ${coin} => ${result}`);
// });

// binanceUtil.getSymbolTrades(symbol, binance)
// .then(result => {
//   console.log(`getSymbolTrades: ${symbol} => `);
//   console.log(result);
// }).catch(error => {
//   console.log(error);
// });

// binanceUtil.getAllBalances(binance)
// .then(result => {
//   console.log('getAllBalances: ');
//   console.log(result);
// });

// binanceUtil.getHasCoinList(binance)
// .then(result => {
//   console.log(`getHasCoinList: ${result}`);
// });

// binanceUtil.getSymbolTradesBuyOrSell( isBuy, symbol, binance ) 
// .then(result => {
//   console.log(`getSymbolTradesBuy: `);
//   console.log(result);
// });

// calculateUtil.calAveOfPriceは任意の取引履歴を渡して計算する
// binanceUtil.getSymbolTradesBuyOrSell( isBuy, symbol, binance ) 
//   .then(result => {
//     const avePrice = calculateUtil.calAveOfPrice(result, binance);
//     console.log(`calAveOfPrice: `);
//     console.log(avePrice);
//   });

// // 全通貨の平均購入価格算出
// binanceUtil.getHasCoinList(binance)
// .then(result => {
//   console.log(`getHasCoinList: ${result}`);
// }).then(task1.bind(this));


// function task1(value) {
//   // TODO allTradesがとれてない
//   for(let symbol of value){
//     console.log(symbol);
//     binanceUtil.getSymbolTradesBuyOrSell( isBuy, symbol, binance ) 
//     .then(result => {
//       const avePrice = calculateUtil.calAveOfPrice(result, binance);
//       console.log(`calAveOfPrice: `);
//       console.log(avePrice);
//     });
//   }
// }
