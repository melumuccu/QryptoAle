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
const {jpy, fiat, coin, symbol, buy, sell} = config;
const {cyan, red, green, yellow, magenta, reset} = config; // ログの色付け用

// -------------- binanceUtilクラス_基本編 --------------

// binanceUtil.getSymbolPrice(symbol, binance)
// .then(result => {
//   console.log(`getSymbolPrice: ${symbol} => ${result}`);
// })
// .catch(error => {
//   console.error(error);
// });

// binanceUtil.getCoinBalance(coin, binance)
// .then(result => {
//   console.log(`getCoinBalance: ${coin} => ${result}`);
// })
// .catch(error => {
//   console.error(error);
// });

// binanceUtil.getSymbolTrades(symbol, binance)
// .then(result => {
//   console.log(`getSymbolTrades: ${symbol} => `);
//   console.log(result);
// }).catch(error => {
//   console.error(error);
// });

// binanceUtil.getAllBalances(true, binance)
// .then(result => {
//   console.log('getAllBalances: ');
//   console.log(result);
// }).catch(error => {
//   console.error(error);
// });

// binanceUtil.getHasCoinList(true, binance)
// .then(result => {
//   console.log(`getHasCoinList: ${result}`);
// }).catch(error => {
//   console.error(error);
// });

// binanceUtil.getSymbolTradesBuyOrSell( buy, config.fiat + config.fiat, binance )
// .then(result => {
//   console.log(`getSymbolTradesBuy: `);
//   console.log(result);
// }).catch(error => {
//   console.error(error);
// });


// // -------------- binanceServiceクラス_発展編 --------------

// // 1つのsymbolについて 現在保有数量から平均取得価額を算出
// // 定期実行する
// setTimeout(binanceService.showAvePriceHaveNow.bind(binanceService), 0, binance);
// setInterval(binanceService.showAvePriceHaveNow.bind(binanceService), 7000, binance);


// 現在保有しているsymbol全てについて
// ・現在保有数量から平均取得価額を算出する
// ・平均取得価額は現在取引価額から見て収支が何%かを算出する
// これを定期実行する
setTimeout(binanceService.showBalanceOfPayments.bind(binanceService), 0, binance);  // bindで呼び出し先のthisが参照するオブジェクトを固定している
setInterval(binanceService.showBalanceOfPayments.bind(binanceService), 300000, binance);

// // // 金額換算
// // // (1通貨分)
// // (async () => {
// //   await binanceService.convert(coin, fiat, binance);
// // })();

// 金額換算
// (全通貨分)
(async () => {
  binanceService.convertAllCoins(jpy, binance);
})();
