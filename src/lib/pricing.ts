// Centralized pricing logic for sessions
// New pricing (RC tracks):
// 1 Hour Plan:
// - Single: ₹699
// - 2 Players: ₹1099
// - Additional player: ₹500 each (from 3rd player onward)
//
// 15 mins session:
// - ₹199 per player

export function calculateSessionPrice(durationMinutes: number, players: number): number {
  if (!players || players <= 0) {
    return 0
  }

  // Treat any duration of 45 minutes or more as a 1-hour plan
  if (durationMinutes >= 45) {
    if (players === 1) return 699
    if (players === 2) return 1099
    return 1099 + (players - 2) * 500
  }

  // Short sessions (e.g., 15 minutes) use flat per-player pricing
  return 199 * players
}

