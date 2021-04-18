/**
 * Binanceからの情報の取得など、基本的な処理を記載するクラス
 */

import BigNumber from "bignumber.js";
import {Config} from '../config/config';

const Binance = require('node-binance-api');

//  クラス作成
const config = new Config();

// 各コンフィグ
const {fiat, coin, symbol, buy, sell} = config;
const {cyan, red, green, yellow, magenta, reset} = config // ログの色付け用


export class BinanceUtil {

  /**
   * 指定ペアの現在価格を取得
   * @param symbol 指定ペア
   * @param binance
   * @returns 指定ペアの現在価格
   */
  getSymbolPrice(symbol: string, binance: typeof Binance): Promise<string> {
    return new Promise((resolve, reject) => {

      binance.prices(function(error, ticker) {
        if( typeof ticker[symbol] !== undefined ) {
          // console.log("Price of ", symbol, ": ", ticker[symbol]);
          return resolve(ticker[symbol]);
        }else{
          return reject('エラー!');
        }
      });

    });
  }

  /**
   * 指定通貨の現在保有数量を取得
   * @param coin 指定通貨
   * @param binance
   * @returns 現在保有数量(availableな数量に限る)
   */
  getCoinBalance(coin: string, binance: typeof Binance): Promise<string> {
    return new Promise((resolve, reject) => {

      binance.balance(function(error, balances) {
        if( typeof balances[coin] !== undefined ) {
          return resolve(balances[coin].available);
        }else{
          return reject('エラー!');
        }
      });

    });
  }

  /**
   * 指定ペアの取引履歴(売買両方)を取得
   * (全ペア分取得するメソッドは提供されていない)
   * @param symbol 指定ペア
   * @param binance
   * @returns 取引履歴(売買両方)
   */
  getSymbolTrades(symbol: string, binance: typeof Binance): Promise<{[key: string]: string;}[]> {
    return new Promise((resolve, reject) => {

      binance.trades(symbol, (error, trades:{[key: string]: string;}[], symbol: string) => {
        // UnixTime(13桁:ミリ秒)を変換
        for( let key in trades ) {
          let dateTime = new Date(trades[key]['time']);
          trades[key]['time'] = `${dateTime.toLocaleDateString('ja-JP')} ${dateTime.toLocaleTimeString('ja-JP')}`;
        }
        if( typeof trades !== undefined ) {
          return resolve(trades);
        }else{
          return reject('エラー!');
        }
      });

    });
  }

  /**
   * 指定ペアの取引履歴(売り買い指定)を取得
   * @param isBuy buy=true, sell=false
   * @param symbol 指定ペア
   * @param binance
   * @returns 取引履歴(売り買い指定)
   */
  async getSymbolTradesBuyOrSell( isBuy: boolean, symbol: string, binance: typeof Binance): Promise<{[key: string]: string;}[]> {
    const allTrades: any = await this.getSymbolTrades(symbol, binance)
                                  .then(result => { return result; })
                                  .catch(error => { console.error(error); });

    let buyTrades: {[key: string]: string;}[] = [];
    for(let trade of allTrades) {
      // console.log(trade['isBuyer']);
      const isBuyer = trade['isBuyer'];
      if( isBuyer === isBuy) {
        buyTrades.push(trade);
      }
    }

    if( buyTrades !== undefined ) {
      return buyTrades;
    }else{
      return undefined;
    }
  }

  /**
   * 全ペアの現在保有額を取得(onOrderの数量を除く)
   * @param binance
   * @returns 全ペアの現在保有額
   */
  getAllBalances(binance: typeof Binance): Promise<{[key: string]: string;}> {
    return new Promise((resolve, reject) => {

      let balanceOfHasCoins: {[key: string]: string;} = {};
      binance.balance(function(error, balances) {
        if( typeof balances !== undefined ) {
          // 保有している通貨のみに限定
          for( let balance in balances ) {
            if( parseFloat(balances[balance].available) !== 0 ) {
              balanceOfHasCoins[balance] = balances[balance];
              // console.log("file: binanceUtil.ts => line 130 => binance.balance => balanceOfHasCoins", balanceOfHasCoins);
            }
          }
        }
        if(balanceOfHasCoins != null) {
          return resolve(balanceOfHasCoins);
        }else{
          return reject('エラー！');
        }
      });
    });
  }

  /**
   * 現在保有している通貨リストを取得
   * 少額(Fiat通貨に換算後、○○Fiat以下)のコインは省く
   * @param binance
   * @returns 保有通貨リスト
   */
  async getHasCoinList(binance: typeof Binance): Promise<string[]> {
    let balanceList: string[] = [];
    const balanceOfHasCoins: any = await this.getAllBalances(binance)
                                            .then(result => {return result})
                                            .catch(error => console.error(error));

    for( let balance in balanceOfHasCoins ) {

      const symbol = balance + fiat;
      const symbolPrice: string | void = await this.getSymbolPrice(symbol, binance)
                                        .then(result => {
                                          return result
                                        }).catch(error => { console.error(error) });

      if(typeof symbolPrice === "undefined") {
        console.error(red + balance + " file: binanceUtil.ts => line 169 => getHasCoinList => symbolPrice", symbolPrice + reset);
      }
      // fiat換算
      const availableAmountB = new BigNumber(parseFloat(balanceOfHasCoins[balance]['available']));
      const symbolPriceB = new BigNumber(parseFloat(symbolPrice));
      const convartUsdt: BigNumber = availableAmountB.times( symbolPriceB );

      // 少額通貨は省略
      if( convartUsdt.gt(1) ) { // more than 1$
        balanceList.push(balance);
      }
    }

    if(balanceList !== undefined) {
      return balanceList;
    }else{
      console.error('error: getHasCoinList')
    }
  }


}




