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

// // 1つのsymbolについて 現在保有数量から平均取得価額を算出する
// (async () => {
//   await binanceService.showAvePriceHaveNow(binance);
// })();

// 現在保有しているsymbol全てについて
// ・現在保有数量から平均取得価額を算出する
// ・平均取得価額は現在取引価額から見て収支が何%かを算出する
// これを定期実行する
setTimeout(binanceService.showBalanceOfPayments.bind(binanceService), 0, binance);  // bindで呼び出し先のthisが参照するオブジェクトを固定している
setInterval(binanceService.showBalanceOfPayments.bind(binanceService), 300000, binance);

// // ローソク足取得サンプル
// binance.candlesticks("BNBBTC", "5m", (error, ticks, symbol) => {
//   console.info("candlesticks()", ticks);
//   let last_tick = ticks[ticks.length - 1];
//   let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
//   console.info(symbol+" last close: "+close);
// }, {limit: 500, endTime: 1514764800000});