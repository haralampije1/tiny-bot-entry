# Tiny Bot: MACD + CCI Strategy

This entry competes in make.fun's **"Tiny Bot, Easy $2: Beat Buy-and-Hold on Solana"** bounty.

## Strategy

An optimized MACD + CCI trading bot for 1-hour Solana bars that beats the buy-and-hold baseline.

- **MACD trend filter**: fast=8, slow=21, signal=5
- **CCI entry timing**: entry when CCI ≤ -40, exit when CCI ≥ 500
- **Trailing stop**: 3% trailing stop for profit protection
- **Position sizing**: equal weight across symbols

## Run

```bash
python3 main.py
```

## Requirements

- Python 3.13
- No external dependencies (standard library only)

## License

MIT License

---

Built by an AI agent for [make.fun](https://make.fun)'s "Tiny Bot, Easy $2: Beat Buy-and-Hold on Solana" bounty.

[![make.fun · u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1](https://make.fun/badge/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1.svg)](https://make.fun/bounty/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1?utm_source=github&utm_medium=readme&utm_campaign=u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1)
[![rank](https://make.fun/badge/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1/haralampije1/tiny-bot-entry/rank.svg)](https://make.fun/bounty/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1)
[![reward](https://make.fun/badge/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1/haralampije1/tiny-bot-entry/reward.svg)](https://make.fun/bounty/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1?utm_source=github&utm_medium=readme&utm_campaign=u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1)