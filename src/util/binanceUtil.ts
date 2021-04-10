/**
 * Binanceからの情報の取得など、基本的な処理を記載するクラス
 */


const Binance = require('node-binance-api');

export class BinanceUtil {
  // 指定ペア
  // 金額を取得
  getSymbolPrice(symbol: string, binance: typeof Binance) {
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

  // 指定通貨
  // 現在保有額を取得
  getCoinBalance(coin: string, binance: typeof Binance) {
    return new Promise((resolve, reject) => {

      binance.balance(function(error, balances) {
        if( typeof balances[coin] !== undefined ) {
          // console.log(coin, " balance: ", balances[coin].available);
          return resolve(balances[coin].available);
        }else{
          return reject('エラー!');
        }
      });

    });
  }

  // 指定ペア
  // 取引履歴(売買両方)を取得(全ペア取得のメソッドは無い)
  getSymbolTrades(symbol: string, binance: typeof Binance) {
    return new Promise((resolve, reject) => {

      binance.trades(symbol, (error, trades, symbol) => {
        // UnixTimeを変換
        for( let key in trades ) {
          // console.log(trades[key]['time']);
          let dateTime = new Date(trades[key]['time']);
          trades[key]['time'] = `${dateTime.toLocaleDateString('ja-JP')} ${dateTime.toLocaleTimeString('ja-JP')}`;
        }
        if( typeof trades !== undefined ) {
          // console.log(symbol+" trade history", trades);
          return resolve(trades);
        }else{
          return reject('エラー!');
        }
      });

    });
  }



  // 指定ペア
  // 取引履歴(売り買い指定)を取得
  async getSymbolTradesBuyOrSell( isBuy: boolean, symbol: string, binance: typeof Binance) {
    const allTrades: any = await this.getSymbolTrades(symbol, binance)
                                  .then(result => { return result; })
                                  .catch(error => { console.error(error); });
    // console.log(allTrades);

    let buyTrades = [];
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

  // 全ペア
  // 現在保有額を取得
  getAllBalances(binance: typeof Binance): Promise<any> {

    return new Promise((resolve, reject) => {

      let balanceOfHasCoins = {};
      binance.balance(function(error, balances) {
        if( typeof balances !== undefined ) {
          // 保有している通貨のみに限定
          for( let balance in balances ) {
            if( parseFloat(balances[balance].available) !== 0 ) {
              balanceOfHasCoins[balance] = balances[balance];
            }
          }
          // console.log("balance: ", balanceOfHasCoins);
        }
        if(balanceOfHasCoins !== undefined) {
          return resolve(balanceOfHasCoins);
        }else{
          return reject('エラー！');
        }
      });

    });
  }

  // 現在保有している通貨リストを取得
  async getHasCoinList(binance: typeof Binance) {
    let balanceList: string[] = [];
    const balanceOfHasCoins: any = await this.getAllBalances(binance)
                                          .then(result => {return result})
                                          .catch(error => console.error(error));
    // console.log(balanceOfHasCoins);

    for( let balance in balanceOfHasCoins ) {
      balanceList.push(balance);
    }
    // console.log(balanceList);

    if(balanceList !== undefined) {
      return balanceList;
    }else{
      console.error('error: getHasCoinList')
    }
  }


}




