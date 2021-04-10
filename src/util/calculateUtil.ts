/**
 * 主に計算などの処理をまとめるクラス
 */

import BigNumber from 'bignumber.js' // 少数の計算を正確に行うためのライブラリ
const Binance = require('node-binance-api');

// ------------------------------------------

export class CalculateUtil {

  /**
   * 渡した売買履歴から平均価格を算出
   * @param trades 任意の売買履歴
   * @param binance 
   * @returns 平均価格
   */
  calAvePrice(trades: any[], binance: typeof Binance): BigNumber {
    let sumPriceB = new BigNumber(0);
    let divisionNum = 0;
    // 各取引履歴の取引時の値段を全て足す
    for(let trade of trades) {
      const priceB = new BigNumber(parseFloat(trade['price']));
      sumPriceB = sumPriceB.plus(priceB);
      divisionNum++;
      // console.log('--------' + divisionNum + '回目の足し算' + '--------');
      // console.log('sumPrice: ' + sumPrice);
      // console.log('divisionNum: ' + divisionNum);
    }
    // console.log('-----------------------------');
    // 取引数で割る
    let avePriceB = sumPriceB.dividedBy(divisionNum);
    return avePriceB;
  }

  
  /**
   * 渡した売買履歴から合計取引量を算出
   * @param trades 任意の売買履歴
   * @param binance 
   * @returns 合計取引数量
   */
  calSumOfQty(trades: any[], binance: typeof Binance): BigNumber {
    let sumQtyB = new BigNumber(0);
    // 各取引履歴の取引量を全て足す
    for(let trade of trades) {
      const qtyB = new BigNumber(parseFloat(trade['qty']));
      sumQtyB = sumQtyB.plus(qtyB);
      // console.log('sumQtyB: ' + sumQtyB);
    }
    return sumQtyB;
  }


  /**
   * 現在持っている数量分の購入履歴を返す
   * (売却した数量分、古い購入履歴と相殺）
   * @param buyTrades 購入履歴
   * @param allSellQty 全売却数量
   * @param binance 
   * @returns 売却数量分が差し引かれた後の購入履歴
   */
  calTradesHaveNow(buyTrades: any[], allSellQty: BigNumber, binance: typeof Binance): {[key: string]: string;}[] {
    
    // console.log('buyTrades = ');
    // console.log(buyTrades);
    // console.log('buyTrades.length = ' + buyTrades.length);

    for(let i=0; i<buyTrades.length; i++) {
      // console.log('---------------------------------------');
      const buyQtyB = new BigNumber(parseFloat(buyTrades[i]['qty']));
      // console.log('buyQtyB = ' + buyQtyB);
      // console.log('-----------');
      // console.log('allSellQty(before minus buyQtyB) = ' + parseFloat(allSellQty));
      allSellQty = allSellQty.minus(buyQtyB);
      // console.log('allSellQty(after minus buyQtyB) = ' + parseFloat(allSellQty));
      // console.log('---------------------------------------');
      // 全売却数量から購入数を差し引いた結果
      if(allSellQty.lt(0)) { // sellQty < 0
        // console.log('allSellQty = ' + parseFloat(allSellQty));
        buyTrades[i]['qty'] = Math.abs(allSellQty.toNumber()).toString();
        // console.log('Math.abs(allSellQty.parseFloat).toString = ' + Math.abs(parseFloat(allSellQty)).toString());
        const splicedTrade: any[] = buyTrades.splice(0, i);
        // console.log('splicedTrade = ');
        // console.log(splicedTrade);
        break
      }else{
        delete buyTrades[i];
        // console.log('buyTrades.length = ' + buyTrades.length);
        continue;
      }
    }
    const buyTradesHaveNow: {[key: string]: string;}[] = buyTrades;
    return buyTradesHaveNow;
  }


}





