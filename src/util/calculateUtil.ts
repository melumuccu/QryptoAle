/**
 * 主に計算などの処理をまとめるクラス
 */

import BigNumber from 'bignumber.js' // 少数の計算を正確に行うためのライブラリ
import {BinanceUtil} from '../util/binanceUtil';
import {Config} from '../config/config';

const Binance = require('node-binance-api');

//  クラス作成
const config = new Config();
const binanceUtil = new BinanceUtil();


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


  // /**
  //  * 現在持っている数量分の購入履歴を返す
  //  * (売却した数量分、古い購入履歴と相殺）
  //  * @param buyTrades 購入履歴
  //  * @param allSellQty 全売却数量
  //  * @param binance
  //  * @returns 売却数量分が差し引かれた後の購入履歴
  //  */
  // calTradesHaveNow(buyTrades: any[], allSellQty: BigNumber, binance: typeof Binance): {[key: string]: string;}[] {

  //   // console.log('buyTrades = ');
  //   // console.log(buyTrades);
  //   // console.log('buyTrades.length = ' + buyTrades.length);

  //   for(let i=0; i<buyTrades.length; i++) {
  //     // console.log('---------------------------------------');
  //     const buyQtyB = new BigNumber(parseFloat(buyTrades[i]['qty']));
  //     // console.log('buyQtyB = ' + buyQtyB);
  //     // console.log('-----------');
  //     // console.log('allSellQty(before minus buyQtyB) = ' + allSellQty.toNumber());
  //     allSellQty = allSellQty.minus(buyQtyB);
  //     // console.log('allSellQty(after minus buyQtyB) = ' + allSellQty.toNumber());
  //     // console.log('---------------------------------------');
  //     // 全売却数量から購入数を差し引いた結果
  //     if(allSellQty.lt(0)) { // sellQty < 0
  //       // console.log('allSellQty = ' + allSellQty.toNumber());
  //       buyTrades[i]['qty'] = Math.abs(allSellQty.toNumber()).toString();
  //       // console.log('Math.abs(allSellQty.parseFloat).toString = ' + Math.abs(allSellQty.toNumber()).toString());
  //       const splicedTrade: any[] = buyTrades.splice(0, i);
  //       // console.log('splicedTrade = ');
  //       // console.log(splicedTrade);
  //       break
  //     }else{
  //       delete buyTrades[i];
  //       // console.log('buyTrades.length = ' + buyTrades.length);
  //       continue;
  //     }
  //   }

  //   let buyTradesHaveNow: {[key: string]: string;}[] = buyTrades;

  //   // ToDo 外部送金料を考慮しないといけない
  //   // (暫定的処理) XRPのように全ての購入数量を差し引いても売却数量が多い場合
  //   // (=外部からの送金などで辻褄が合わない場合)
  //   if(allSellQty.gt(0)){
  //     buyTradesHaveNow = [];
  //   }

  //   return buyTradesHaveNow;
  // }



  /**
   * 現在持っている数量分の購入履歴を返す
   * @param coin ex. XYM
   * @param binance
   * @returns 購入履歴
   */
  async calTradesHaveNow(coin: string, binance: typeof Binance): Promise<{[key: string]: string;}[]> {
  // console.log("file: calculateUtil.ts => line 123 => calTradesHaveNow => coin", coin);

    const symbol = coin + config.fiat;
    // console.log("file: calculateUtil.ts => line 127 => calTradesHaveNow => symbol", symbol);

    // 通貨の現在保有数量を取得
    const coinBalance: string = await binanceUtil.getCoinBalance( coin, binance);
    // console.log("file: calculateUtil.ts => line 130 => calTradesHaveNow => coinBalance", coinBalance);
    let coinBalanceB: BigNumber = new BigNumber( coinBalance );

    // シンボルの購入履歴を取得
    const symbolBuyTrades = await binanceUtil.getSymbolTradesBuyOrSell(config.buy, symbol, binance);
    // console.log("file: calculateUtil.ts => line 135 => calTradesHaveNow => symbolBuyTrades", symbolBuyTrades);

    // 現在の保有数量にあたる購入履歴を抜き出し(最新の購入履歴から抜き出し)
    const tmpTrades: {[key: string]: string;}[] = [];
    for(let i=symbolBuyTrades.length-1; i>=0; i--) {
      // console.log('------------------');

      // 取引量
      const buyQtyB: BigNumber = new BigNumber( symbolBuyTrades[i]['qty'] );
      // console.log("file: calculateUtil.ts => line 144 => calTradesHaveNow => buyQtyB", buyQtyB.toNumber());

      // 現在保有数量-購入取引量
      coinBalanceB = coinBalanceB.minus( buyQtyB );
      // console.log("file: calculateUtil.ts => line 148 => calTradesHaveNow => coinBalanceB", coinBalanceB.toNumber());

      if( coinBalanceB.lt(0) ) {
        // マイナスになった(=現在保有数量をここまでの購入取引量が上回った)場合
        // 差の絶対値を購入履歴にセット
        symbolBuyTrades[i]['qty'] = coinBalanceB.abs().toString();

        // 配列をプッシュ
        tmpTrades.push( symbolBuyTrades[i] );
        // console.log("file: calculateUtil.ts => line 157 => calTradesHaveNow => tmpTrades", tmpTrades);

        // console.log('------------------for break');
        break;

      }else{
        // 配列をプッシュ
        tmpTrades.push( symbolBuyTrades[i] );
        // console.log("file: calculateUtil.ts => line 165 => calTradesHaveNow => tmpTrades", tmpTrades);

        // console.log('------------------for continue');
        continue;
      }
    } // ------------ for end

    // リターンの配列(配列内が新しいものから順に並んでいるので逆順に)
    const returnTrades: {[key: string]: string;}[] = tmpTrades.reverse();
    return returnTrades;
  }





}





