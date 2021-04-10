import {login} from './config/login';
import {Config} from './config/config';
import {BinanceUtil} from './util/binanceUtil';
import {CalculateUtil} from './util/calculateUtil';
import {BinanceService} from './service/binanceService'

//  クラス作成
const config = new Config();
const binanceUtil = new BinanceUtil();
const calculateUtil = new CalculateUtil();
const binanceService = new BinanceService();

// 各種コンフィグ
const symbol = config.symbol;
const coin = config.coin;
const buy = config.buy;
const sell = config.sell;

// Binance ログイン
const Binance = require('node-binance-api');
const binance = new Binance().options(login);




// -------------- binanceUtilクラス_基本編 --------------

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
//   console.error(error);
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


// -------------- binanceUtilクラス_発展編 --------------

binanceService.calAvePriceHaveNow(symbol, binance);


  









// ------------実装未完了

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



// ------------sumple

const trades = [ 
  { symbol: 'BNBUSDT',
  id: 183704093,
  orderId: 1732022259,
  orderListId: -1,
  price: '264.30000000',
  qty: '1.28200000',
  quoteQty: '338.83260000',
  commission: '0.00096150',
  commissionAsset: 'BNB',
  time: 'Thu Aug 18 53188 23:56:06 GMT+0900 (GMT+09:00)',
  isBuyer: true,
  isMaker: true,
  isBestMatch: true },
  { symbol: 'BNBUSDT',
  id: 186097924,
  orderId: 1747895629,
  orderListId: -1,
  price: '259.89820000',
  qty: '0.44200000',
  quoteQty: '114.87500440',
  commission: '0.00033150',
  commissionAsset: 'BNB',
  time: 'Wed Feb 26 53197 23:18:03 GMT+0900 (GMT+09:00)',
  isBuyer: true,
  isMaker: false,
  isBestMatch: true },
  { symbol: 'BNBUSDT',
  id: 191864614,
  orderId: 1782435719,
  orderListId: -1,
  price: '293.50000000',
  qty: '0.85700000',
  quoteQty: '251.52950000',
  commission: '0.00064381',
  commissionAsset: 'BNB',
  time: 'Mon Sep 09 53213 19:09:54 GMT+0900 (GMT+09:00)',
  isBuyer: false,
  isMaker: true,
  isBestMatch: true },
  { symbol: 'BNBUSDT',
  id: 194966306,
  orderId: 1797329790,
  orderListId: -1,
  price: '315.00000000',
  qty: '0.42800000',
  quoteQty: '134.82000000',
  commission: '0.00032067',
  commissionAsset: 'BNB',
  time: 'Mon Jan 28 53219 11:34:39 GMT+0900 (GMT+09:00)',
  isBuyer: false,
  isMaker: true,
  isBestMatch: true },
  { symbol: 'BNBUSDT',
  id: 196389862,
  orderId: 1803582411,
  orderListId: -1,
  price: '342.00000000',
  qty: '0.32000000',
  quoteQty: '109.44000000',
  commission: '0.00024009',
  commissionAsset: 'BNB',
  time: 'Fri Apr 02 53221 22:17:30 GMT+0900 (GMT+09:00)',
  isBuyer: false,
  isMaker: true,
  isBestMatch: true },
  { symbol: 'BNBUSDT',
  id: 202811087,
  orderId: 1831996965,
  orderListId: -1,
  price: '384.26240000',
  qty: '0.10700000',
  quoteQty: '41.11607680',
  commission: '0.04111608',
  commissionAsset: 'USDT',
  time: 'Wed Jun 08 53233 14:43:25 GMT+0900 (GMT+09:00)',
  isBuyer: false,
  isMaker: false,
  isBestMatch: true } 
]