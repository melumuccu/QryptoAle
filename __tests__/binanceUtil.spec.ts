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

// BalanceSub型
type BalanceSub = {
  available: string,
  onOrder: string
}
// Balance型
type Balance = {
  [key: string]: BalanceSub
}

// -----------------------

test('getSymbolPrice', async () => {
  const target = binanceUtil.getSymbolPrice(config.symbol, binance);
  // 期待値: ex. 0.12516  5615.16545
  await expect(target).resolves.toMatch(/[0-9]+\.*[0-9]*/);
});

test('getCoinBalance', async () => {
  const target = binanceUtil.getCoinBalance(config.coin, binance);
  // 期待値: ex. 0.12516  5615.16545
  await expect(target).resolves.toMatch(/[0-9]+\.*[0-9]*/);
})

test('getSymbolTrades', async () => {
  const target =  binanceUtil.getSymbolTrades(config.symbol, binance);
  // 期待値: Tradeのプロパティを含む配列
  await expect(target).resolves.toContainEqual( Trade );
})

test('getSymbolTradesBuyOrSell', async () => {
  const targetBuy =  binanceUtil.getSymbolTradesBuyOrSell(config.buy, config.symbol, binance);
  // 期待値: Tradeのプロパティを含む配列
  await expect(targetBuy).resolves.toContainEqual( Trade );

  const targetSell =  binanceUtil.getSymbolTradesBuyOrSell(config.sell, config.symbol, binance);
  // 期待値: Tradeのプロパティを含む配列
  await expect(targetSell).resolves.toContainEqual( Trade );
})

test('getAllBalances', async () => {
  // onOrderを含むパターン
  const targetTrue = await binanceUtil.getAllBalances(true, binance);
  // 期待値: ex. {"ADA": {"available": "0.00966000", "onOrder": "0.00000000"},...
  await expect(targetTrue).toBeTruthy();

  // onOrderを含まないパターン
  const targetFalse = await binanceUtil.getAllBalances(false, binance);
  // 期待値: ex. {"ADA": {"available": "0.00966000", "onOrder": "0.00000000"},...
  await expect(targetFalse).toBeTruthy();
})

test('getHasCoinList', async () => {
  // onOrderを含むパターン
  const targetTrue = await binanceUtil.getHasCoinList(true, binance);
  // 期待値: ex. [ADA, XEM, ...]
  await expect(targetTrue).toBeTruthy();

  // onOrderを含まないパターン
  const targetFalse = await binanceUtil.getHasCoinList(false, binance);
  // 期待値: ex. [ADA, XEM, ...]
  await expect(targetTrue).toBeTruthy();
})

