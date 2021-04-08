const Binance = require('node-binance-api');
const BigNumber = require('bignumber.js');// 少数の計算を正確に行うためのライブラリ

// ------------------------------------------

export class CalculateUtil {

  // ひながた
  aaa(binance: typeof Binance) {

  }

  // 渡した売買履歴から平均価格を算出
  calAveOfPrice(trades: any[], binance: typeof Binance) {

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

    return avePriceB.toNumber();
  }

}





