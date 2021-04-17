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


// -------------- binanceServiceクラス_発展編 --------------

// // 現在保有数量から平均取得価額を算出する
// // [1つのsymbol]
// (async () => {
//   const calAvePriceHaveNow = await binanceService.calAvePriceHaveNow(coin, binance);
//   console.log('calAvePriceHaveNow:' + coin + ' = ');
//   console.log(calAvePriceHaveNow);
// })();



// 現在保有数量から平均取得価額を算出する
// [現在保有しているsymbol全て]
binanceUtil.getHasCoinList(binance)
.then(result => {
  const calAvePriceHaveNow = binanceService.calAvePriceHaveNow(result, binance);
  // console.log('calAvePriceHaveNow = ');
  // console.log(calAvePriceHaveNow);
});










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
    { symbol: 'SANDUSDT',
      id: 5590127,
      orderId: 112367043,
      orderListId: -1,
      price: '0.21360400',
      qty: '216.00000000',
      quoteQty: '46.13846400',
      commission: '0.21600000',
      commissionAsset: 'SAND',
      time: '2021-2-28 23:09:00',
      isBuyer: true,
      isMaker: false,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 8040883,
      orderId: 136795968,
      orderListId: -1,
      price: '0.66827100',
      qty: '215.00000000',
      quoteQty: '143.67826500',
      commission: '0.14367827',
      commissionAsset: 'USDT',
      time: '2021-3-15 16:44:06',
      isBuyer: false,
      isMaker: false,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 8307430,
      orderId: 140128086,
      orderListId: -1,
      price: '0.54543100',
      qty: '220.00000000',
      quoteQty: '119.99482000',
      commission: '0.22000000',
      commissionAsset: 'SAND',
      time: '2021-3-17 17:31:53',
      isBuyer: true,
      isMaker: false,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 8307642,
      orderId: 140129494,
      orderListId: -1,
      price: '0.54739400',
      qty: '75.00000000',
      quoteQty: '41.05455000',
      commission: '0.07500000',
      commissionAsset: 'SAND',
      time: '2021-3-17 17:33:01',
      isBuyer: true,
      isMaker: false,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 8307643,
      orderId: 140129494,
      orderListId: -1,
      price: '0.54739400',
      qty: '144.00000000',
      quoteQty: '78.82473600',
      commission: '0.14400000',
      commissionAsset: 'SAND',
      time: '2021-3-17 17:33:01',
      isBuyer: true,
      isMaker: false,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 8928866,
      orderId: 149873995,
      orderListId: -1,
      price: '0.58335500',
      qty: '190.00000000',
      quoteQty: '110.83745000',
      commission: '0.00031448',
      commissionAsset: 'BNB',
      time: '2021-3-22 18:12:01',
      isBuyer: true,
      isMaker: true,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 8929636,
      orderId: 149884014,
      orderListId: -1,
      price: '0.58851700',
      qty: '189.00000000',
      quoteQty: '111.22971300',
      commission: '0.00031506',
      commissionAsset: 'BNB',
      time: '2021-3-22 18:16:38',
      isBuyer: true,
      isMaker: false,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 9176081,
      orderId: 153341955,
      orderListId: -1,
      price: '0.62900000',
      qty: '220.00000000',
      quoteQty: '138.38000000',
      commission: '0.00040509',
      commissionAsset: 'BNB',
      time: '2021-3-24 13:05:35',
      isBuyer: false,
      isMaker: true,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 9647021,
      orderId: 153350482,
      orderListId: -1,
      price: '0.69700000',
      qty: '93.00000000',
      quoteQty: '64.82100000',
      commission: '0.00018324',
      commissionAsset: 'BNB',
      time: '2021-3-28 02:10:12',
      isBuyer: false,
      isMaker: true,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 9647022,
      orderId: 153350482,
      orderListId: -1,
      price: '0.69700000',
      qty: '126.00000000',
      quoteQty: '87.82200000',
      commission: '0.00024827',
      commissionAsset: 'BNB',
      time: '2021-3-28 02:10:12',
      isBuyer: false,
      isMaker: true,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 9773975,
      orderId: 161500758,
      orderListId: -1,
      price: '0.76300000',
      qty: '190.00000000',
      quoteQty: '144.97000000',
      commission: '0.00039131',
      commissionAsset: 'BNB',
      time: '2021-3-28 13:49:09',
      isBuyer: false,
      isMaker: true,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 10234782,
      orderId: 166321012,
      orderListId: -1,
      price: '0.82000000',
      qty: '94.00000000',
      quoteQty: '77.08000000',
      commission: '0.00019562',
      commissionAsset: 'BNB',
      time: '2021-3-31 01:06:03',
      isBuyer: false,
      isMaker: true,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 10713960,
      orderId: 172371786,
      orderListId: -1,
      price: '0.68500000',
      qty: '149.00000000',
      quoteQty: '102.06500000',
      commission: '0.00022821',
      commissionAsset: 'BNB',
      time: '2021-4-4 16:42:57',
      isBuyer: true,
      isMaker: true,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 10925942,
      orderId: 174592703,
      orderListId: -1,
      price: '0.64863800',
      qty: '154.00000000',
      quoteQty: '99.89025200',
      commission: '0.15400000',
      commissionAsset: 'SAND',
      time: '2021-4-6 21:41:18',
      isBuyer: true,
      isMaker: false,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 10925943,
      orderId: 174592703,
      orderListId: -1,
      price: '0.64863900',
      qty: '30.00000000',
      quoteQty: '19.45917000',
      commission: '0.03000000',
      commissionAsset: 'SAND',
      time: '2021-4-6 21:41:18',
      isBuyer: true,
      isMaker: false,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 11052891,
      orderId: 175764720,
      orderListId: -1,
      price: '0.56500000',
      qty: '234.00000000',
      quoteQty: '132.21000000',
      commission: '0.23400000',
      commissionAsset: 'SAND',
      time: '2021-4-7 20:19:37',
      isBuyer: true,
      isMaker: true,
      isBestMatch: true },
    { symbol: 'SANDUSDT',
      id: 11052892,
      orderId: 175764720,
      orderListId: -1,
      price: '0.56500000',
      qty: '6.00000000',
      quoteQty: '3.39000000',
      commission: '0.00000681',
      commissionAsset: 'BNB',
      time: '2021-4-7 20:19:37',
      isBuyer: true,
      isMaker: true,
      isBestMatch: true }
]