import {login} from './config/login';
import {Config} from './config/config';
import {BinanceUtil} from './util/binanceUtil';
import {CalculateUtil} from './util/calculateUtil';
import {BinanceService} from './service/binanceService'

import BigNumber from "bignumber.js";

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
//   const calAvePriceHaveNow: {[key: string]: string | BigNumber;} = await binanceService.calAvePriceHaveNow(coin, binance);
//   console.log(config.magenta + "-------------------" + config.reset);
//   for(let key in calAvePriceHaveNow) {
//     console.log(config.magenta + key + ": " + calAvePriceHaveNow[key] + config.reset);
//   }
//   console.log(config.magenta + "-------------------" + config.reset);
// })();



// 現在保有数量から平均取得価額を算出する
// [現在保有しているsymbol全て]
(async () => {
  const hasCoinList: string[] = await binanceUtil.getHasCoinList(binance);
  // console.log("file: app.ts => line 82 => hasCoinList", hasCoinList);

  const avePriceHasCoins: {[key: string]: string | BigNumber}[] = await binanceService.calAvePriceHaveNow(hasCoinList, binance);
  console.log(config.magenta + "-------------------" + config.reset);
  for(let avePrice of avePriceHasCoins) {
    for(let key in avePrice) {
      console.log(config.magenta + key + ": " + avePrice[key] + config.reset);
    }

    const coin = avePrice['coin'];
    if(typeof coin === 'string') {
      const nowSymbolPrice: string= await binanceUtil.getSymbolPrice(coin+config.fiat, binance)
      console.log(config.magenta + "nowSymbolPrice: " + nowSymbolPrice + config.reset);

      const balanceOfPayments: BigNumber = new BigNumber( parseFloat(nowSymbolPrice) ).div(avePrice['aveBuyPrice']).times(100);
      console.log(config.magenta + "balanceOfPayments: " + balanceOfPayments + config.reset);
    }
    console.log(config.magenta + "-------------------" + config.reset);
  }
})();

