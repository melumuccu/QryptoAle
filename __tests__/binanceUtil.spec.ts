import {Config} from '../src/config/config';
import {BinanceUtil} from '../src/util/binanceUtil';
import {login} from '../src/config/login';

const Binance = require('node-binance-api');

//  クラス作成
const config = new Config();
const binance = new Binance().options(login);
const binanceUtil = new BinanceUtil();

// Trade型-toContainEqual()用
const Trade = {
  symbol: expect.any(String),
  id: expect.any(Number),
  orderId: expect.any(Number),
  orderListId: expect.any(Number),
  price: expect.any(String),
  qty: expect.any(String),
  quoteQty: expect.any(String),
  commission: expect.any(String),
  commissionAsset: expect.any(String),
  time: expect.any(String),
  isBuyer: expect.any(Boolean),
  isMaker: expect.any(Boolean),
  isBestMatch: expect.any(Boolean)
};

// // BalanceSub型
// type BalanceSub = {
//   available: string,
//   onOrder: string
// }
// // Balance型
// type Balance = {
//   [key: string]: BalanceSub
// }

// -----------------------

test('getSymbolPrice', async () => {
  // 通常パターン
  // 期待値: ex. 0.12516  5615.16545
  const targetA = binanceUtil.getSymbolPrice(config.symbol, binance);
  await expect(targetA).resolves.toMatch(/[0-9]+\.*[0-9]*/);

  // エラーパターン(fiat同士)
  const targetB = binanceUtil.getSymbolPrice(config.fiat + config.fiat, binance);
  await expect(targetB).rejects.toThrow('null');

  // エラーパターン(存在しないペア)
  const targetC = binanceUtil.getSymbolPrice("あア", binance);
  await expect(targetC).rejects.toThrow('null');
});

test('getCoinBalance', async () => {
  // 通常パターン
  // 期待値: ex. 0.12516  5615.16545
  const targetA = binanceUtil.getCoinBalance(config.coin, binance);
  await expect(targetA).resolves.toMatch(/[0-9]+\.*[0-9]*/);

  // エラーパターン(存在しない通貨)
  const targetB = binanceUtil.getCoinBalance("あ", binance);
  await expect(targetB).rejects.toThrow();
});

test('getSymbolTrades', async () => {
  // 通常パターン
  // 期待値: Trade型が含まれる配列
  const targetA = binanceUtil.getSymbolTrades(config.symbol, binance);
  await expect(targetA).resolves.toContainEqual( Trade );

  // エラーパターン(fiat同士)
  const targetB = binanceUtil.getSymbolTrades(config.fiat + config.fiat, binance);
  await expect(targetB).rejects.toThrow();

  // エラーパターン(存在しないペア)
  const targetC = binanceUtil.getSymbolTrades("あア", binance);
  await expect(targetC).rejects.toThrow();
});

test('getSymbolTradesBuyOrSell', async () => {
  // 通常パターン: BUY
  // 期待値: Tradeのプロパティを含む配列, isBuyer=trueのみ
  const targetBuyN1 = binanceUtil.getSymbolTradesBuyOrSell(config.buy, config.symbol, binance);
  await expect(targetBuyN1).resolves.toContainEqual( Trade );
  await expect(targetBuyN1).resolves.not.toContainEqual( {isBuyer: false} );

  // 通常パターン: SELL
  // 期待値: Tradeのプロパティを含む配列, isBuyer=falseのみ
  const targetSellN1 = binanceUtil.getSymbolTradesBuyOrSell(config.sell, config.symbol, binance);
  await expect(targetSellN1).resolves.toContainEqual( Trade );
  await expect(targetSellN1).resolves.not.toContainEqual( {isBuyer: true} );

  // エラーパターン(fiat同士): BUY
  const targetBuyE1 = binanceUtil.getSymbolTradesBuyOrSell(config.buy, config.fiat + config.fiat, binance);
  await expect(targetBuyE1).rejects.toThrow("allTrades == null");

  // エラーパターン(fiat同士): SELL
  const targetSellE1 = binanceUtil.getSymbolTradesBuyOrSell(config.sell, config.fiat + config.fiat, binance);
  await expect(targetSellE1).rejects.toThrow("allTrades == null");

  // エラーパターン(存在しないペア): BUY
  const targetBuyE2 = binanceUtil.getSymbolTradesBuyOrSell(config.buy, "あア", binance);
  await expect(targetBuyE2).rejects.toThrow("allTrades == null");

  // エラーパターン(存在しないペア): SELL
  const targetSellE2 = binanceUtil.getSymbolTradesBuyOrSell(config.sell, "あア", binance);
  await expect(targetSellE2).rejects.toThrow("allTrades == null");

  // エラーパターン(存在するペアだが取引を一度もしていない): BUY
  const targetBuyE3 = binanceUtil.getSymbolTradesBuyOrSell(config.buy, "ACMBTC", binance);
  await expect(targetBuyE3).rejects.toThrow("allTrades == null");

  // エラーパターン(存在するペアだが取引を一度もしていない): SELL
  const targetSellE3 = binanceUtil.getSymbolTradesBuyOrSell(config.sell, "ACMBTC", binance);
  await expect(targetSellE3).rejects.toThrow("allTrades == null");

});

test('getAllBalances', async () => {
  // onOrderを含むパターン
  // 期待値: ex. {"ADA": {"available": "0.00966000", "onOrder": "0.00000000"},...
  const targetTrue = binanceUtil.getAllBalances(true, binance);
  await expect(targetTrue).resolves.toBeTruthy();

  // onOrderを含まないパターン
  // 期待値: ex. {"ADA": {"available": "0.00966000", "onOrder": "0.00000000"},...
  const targetFalse = binanceUtil.getAllBalances(false, binance);
  await expect(targetFalse).resolves.toBeTruthy();
})

test('getHasCoinList', async () => {
  // onOrderを含むパターン
  // 期待値: ex. [ADA, XEM, ...]
  const targetTrue = await binanceUtil.getHasCoinList(true, binance);
  expect(targetTrue).toBeTruthy();

  // onOrderを含まないパターン
  // 期待値: ex. [ADA, XEM, ...]
  const targetFalse = await binanceUtil.getHasCoinList(false, binance);
  expect(targetTrue).toBeTruthy();
})

