import {login} from './config/login';
import {Config} from './config/config';
import {BinanceUtil} from './util/binanceUtil';
import {CalculateUtil} from './util/calculateUtil';
import {BinanceService} from './service/binanceService';

import BigNumber from "bignumber.js";

// Binance ログイン
const Binance = require('node-binance-api');
const binance = new Binance().options(login);

//  クラス作成
const config = new Config();
const binanceUtil = new BinanceUtil();
const calculateUtil = new CalculateUtil();
const binanceService = new BinanceService();

// 各コンフィグ
const {fiat, coin, symbol, buy, sell} = config;
const {cyan, red, green, yellow, magenta, reset} = config; // ログの色付け用

// プリミティブの判定
const isString = (arg: any): arg is string  => typeof arg === "string";
const isNumber = (arg: any): arg is number  => typeof arg === "number";




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
//   console.error(red + error + reset);
// });

// binanceUtil.getAllBalances(true, binance)
// .then(result => {
//   console.log('getAllBalances: ');
//   console.log(result);
// });

// binanceUtil.getHasCoinList(binance)
// .then(result => {
//   console.log(`getHasCoinList: ${result}`);
// });

// binanceUtil.getSymbolTradesBuyOrSell( buy, symbol, binance )
// .then(result => {
//   console.log(`getSymbolTradesBuy: `);
//   console.log(result);
// });


// -------------- binanceServiceクラス_発展編 --------------

// // 現在保有数量から平均取得価額を算出する
// // [1つのsymbol]
// (async () => {
//   const calAvePriceHaveNow= await binanceService.calAvePriceHaveNow(coin, binance);
//   for(let key in calAvePriceHaveNow) {
//     console.log(magenta + key + ": " + calAvePriceHaveNow[key] + reset);
//   }
//   const targetCoin = calAvePriceHaveNow['coin'];
//   if(typeof targetCoin === 'string') {
//     const nowSymbolPrice = await binanceUtil.getSymbolPrice(targetCoin+fiat, binance)
//     console.log(magenta + "nowSymbolPrice: " + nowSymbolPrice + reset);

//     const balanceOfPayments = new BigNumber( parseFloat(nowSymbolPrice) ).div(calAvePriceHaveNow['aveBuyPrice']).times(100);
//     console.log(magenta + "balanceOfPayments: " + balanceOfPayments + reset);
//   }
// })();



// ・現在保有数量から平均取得価額を算出する
// ・平均取得価額は現在取引価額から見て収支何%かを算出する
// [現在保有しているsymbol全て]
const show = function() {
  (async () => {
    const hasCoinList: string[] = await binanceUtil.getHasCoinList(true, binance);
    // console.log("file: app.ts => line 82 => hasCoinList", hasCoinList);

    const avePriceHasCoins = await binanceService.calAvePriceHaveNow(hasCoinList, binance);
    const result = [];
    for(let avePrice of avePriceHasCoins) {
      const {coin: propCoin, aveBuyPrice: propAveBuyPrice} = avePrice;

      if( isString(propCoin) && isNumber(propAveBuyPrice) ) {
        // 平均購入価額を丸める(四捨五入)
        const propAveBuyPriceDp = new BigNumber( propAveBuyPrice ).dp(6); // 6桁精度
        // 現在価格を取得
        const nowSymbolPrice: string = await binanceUtil.getSymbolPrice(propCoin+fiat, binance)
        const nowSymbolPriceDp = new BigNumber( parseFloat(nowSymbolPrice) ).dp(6);
        // 平均取得価額は現在価額から見て収支は何%かを算出
        const balanceOfPayments: BigNumber = new BigNumber( parseFloat(nowSymbolPrice) ).div( new BigNumber(propAveBuyPrice) ).times(100);
        const balanceOfPaymentsDp = balanceOfPayments.dp(1);
        // 結果をプッシュ
        result.push({
            coin: propCoin
          , aveBuyPrice: propAveBuyPriceDp.toNumber()
          , nowSymbolPrice: nowSymbolPriceDp.toNumber()
          , balanceOfPayments: balanceOfPaymentsDp.toNumber()
        });
      }else{
        console.error(red + "file: app.ts => line 110 " + reset);
        console.error(red + "【propCoin != null && propAveBuyPrice != null】 => false" + reset);
      }
    }
    // 収支率で降順ソート
    // result.sort((a, b) => {
    //   if (a.balanceOfPayments > b.balanceOfPayments) {
    //     return -1;
    //   } else {
    //     return 1;
    //   }
    // });

    // 結果の出力
    console.table(result);
  })();
}

setTimeout(show, 0);
setInterval(show, 180000);

// binance.candlesticks("BNBBTC", "5m", (error, ticks, symbol) => {
//   console.info("candlesticks()", ticks);
//   let last_tick = ticks[ticks.length - 1];
//   let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
//   console.info(symbol+" last close: "+close);
// }, {limit: 500, endTime: 1514764800000});