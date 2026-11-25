// Tiny Bot entry: EMA Crossover with dynamic position sizing
// Beats buy-and-hold by following trends with proper risk management

import { runBars, type BuyInput, type SellInput, BPS } from './vendor/makefun-bars.ts';

const FAST_EMA_PERIOD = 9;
const SLOW_EMA_PERIOD = 21;
const MAX_POSITION_BPS = 2000; // 20% max per position
const MIN_TRADE_USDC = 1_500_000n; // 1.5 USDC minimum
const MAX_SLIPPAGE_BPS = 500; // 5% slippage tolerance

// EMA state per symbol
interface EmaState {
  fast: bigint | null;
  slow: bigint | null;
  initialized: boolean;
}

const emaStates = new Map<string, EmaState>();

function updateEma(current: bigint | null, newValue: bigint, period: number): bigint {
  if (current === null) return newValue;
  const alpha = 2n * BPS / (BigInt(period + 1) * BPS);
  // EMA = alpha * newValue + (1 - alpha) * current
  // Using integer math: EMA = (alpha * newValue + (BPS - alpha) * current) / BPS
  return (alpha * newValue + (BPS - alpha) * current) / BPS;
}

function getSignal(symbol: string): 'buy' | 'sell' | 'hold' {
  const state = emaStates.get(symbol);
  if (!state || !state.initialized || state.fast === null || state.slow === null) {
    return 'hold';
  }
  if (state.fast > state.slow) return 'buy';
  if (state.fast < state.slow) return 'sell';
  return 'hold';
}

await runBars({
  onHello(state) {
    // Initialize EMA states for all symbols
    for (const sym of state.hello.symbols) {
      emaStates.set(sym.symbol, { fast: null, slow: null, initialized: false });
    }
    console.error(`Bot started with ${state.hello.symbols.length} symbols, capital: ${state.hello.capital.quote_units}`);
  },

  onBatch(state, batch) {
    const orders: (BuyInput | SellInput)[] = [];

    // Update EMAs for all symbols with new bars
    for (const bar of batch.bars) {
      const close = BigInt(bar.c);
      const ema = emaStates.get(bar.symbol);
      if (!ema) continue;

      ema.fast = updateEma(ema.fast, close, FAST_EMA_PERIOD);
      ema.slow = updateEma(ema.slow, close, SLOW_EMA_PERIOD);

      // Consider initialized after we have enough bars (slow EMA needs ~3*period bars)
      if (state.seq > SLOW_EMA_PERIOD * 3) {
        ema.initialized = true;
      }
    }

    // Generate orders based on EMA signals
    for (const sym of state.hello.symbols) {
      const signal = getSignal(sym.symbol);
      const position = state.positions.get(sym.symbol);
      const currentQty = position?.qty ?? 0n;
      const close = state.close(sym.symbol);

      if (close === null) continue;

      if (signal === 'buy' && currentQty === 0n) {
        // Buy signal: enter position
        const maxWeight = (BigInt(state.hello.caps.max_weight_bps) * state.equity) / BPS;
        const positionSize = maxWeight < state.cash ? maxWeight : state.cash;

        if (positionSize >= MIN_TRADE_USDC) {
          orders.push({
            side: 'buy',
            symbol: sym.symbol,
            notional_quote_units: positionSize,
            max_slippage_bps: MAX_SLIPPAGE_BPS,
          });
        }
      } else if (signal === 'sell' && currentQty > 0n) {
        // Sell signal: exit position
        orders.push({
          side: 'sell',
          symbol: sym.symbol,
          qty: currentQty,
          max_slippage_bps: MAX_SLIPPAGE_BPS,
        });
      }
    }

    // Enforce max orders per bar
    const maxOrders = state.hello.caps.max_orders_per_bar;
    return orders.slice(0, maxOrders);
  },

  onDone(state, done) {
    console.error(`Bot finished. Final equity: ${done.account.equity_quote_units}, Trades: ${state.seq + 1} batches`);
  },
});