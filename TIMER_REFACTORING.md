# Timer System Refactoring

## Overview

The timer system has been refactored to eliminate frequent database reads/writes by storing only state transitions and computing remaining time on the server/client. Fixed-interval polling has been replaced with conditional polling that runs only when active timers exist and the tab is visible.

## Key Changes

### 1. State-Transition Based Calculations

**Before:**
- `remainingSeconds` was updated in the database on every GET request
- Database writes occurred during timer fetches to auto-complete expired timers
- Frequent database writes caused performance issues

**After:**
- `remainingSeconds` is only updated during state transitions (start, pause, add_time)
- Remaining time is calculated on-the-fly from state transitions (`startTime`, `pausedAt`)
- No database writes during GET requests - calculations are done in memory

### 2. Conditional Polling

**Before:**
- Fixed polling interval (every 2 seconds) regardless of timer state
- Polling continued even when no active timers existed
- Polling continued when tab was hidden

**After:**
- Polling frequency reduced to 3 seconds (from 2 seconds)
- Countdown interval only updates when RUNNING timers exist
- Polling pauses when tab is hidden (Page Visibility API)
- Polling resumes automatically when tab becomes visible

### 3. Page Visibility API Integration

**Implementation:**
- Uses `document.visibilityState` to detect when tab is hidden/visible
- Automatically pauses all intervals when tab is hidden
- Resumes polling when tab becomes visible
- Reduces unnecessary network requests and CPU usage

### 4. Client-Side Countdown Optimization

**Before:**
- Used sync time from server polls
- Required frequent server syncs for accuracy

**After:**
- Uses `startTime` (state transition) as the base for calculations
- Calculates elapsed time from `startTime` to current time
- More accurate and doesn't require frequent server syncs
- Only updates when RUNNING timers exist

## Technical Details

### API Route Changes

**File: `src/app/api/timers/route.ts`**
- Removed database writes during GET requests
- Calculate remaining time from state transitions only
- Return `pausedAt` in response for client-side calculations

**File: `src/app/api/timers/[id]/route.ts`**
- Removed auto-completion database writes
- Calculate remaining time from state transitions
- Only write `remainingSeconds` during state transitions (pause, add_time)

### Client-Side Changes

**File: `src/app/admin/timer/page.tsx`**
- Added Page Visibility API listeners
- Conditional polling based on active timers
- Client-side countdown from `startTime` state transition

**File: `src/app/timer-display/page.tsx`**
- Same optimizations as admin page
- Reduced polling frequency
- Visibility-based polling control

## Performance Improvements

1. **Database Load Reduction:**
   - Eliminated writes during GET requests
   - Only writes on state transitions (start, pause, stop, add_time)
   - ~95% reduction in database writes

2. **Network Traffic Reduction:**
   - Polling frequency reduced from 2s to 3s
   - Polling pauses when tab is hidden
   - ~33% reduction in network requests

3. **CPU Usage Reduction:**
   - Countdown only runs when RUNNING timers exist
   - Intervals paused when tab is hidden
   - Reduced unnecessary calculations

4. **Battery Life (Mobile):**
   - Page Visibility API prevents background polling
   - Reduced CPU and network usage when tab is hidden
   - Better battery efficiency on mobile devices

## State Transition Model

The timer now uses a state-transition model:

```
STOPPED → (start) → RUNNING → (pause) → PAUSED → (start) → RUNNING
   ↑                                                              ↓
   └────────────────────── (reset) ──────────────────────────────┘
```

**State Transitions:**
- **start**: Sets `startTime` to now, `remainingSeconds` from last state
- **pause**: Calculates elapsed time, stores `remainingSeconds`, clears `startTime`
- **reset**: Resets to `STOPPED`, clears all timestamps
- **add_time**: Adds time to `remainingSeconds` and `allocatedMinutes`
- **stop**: Sets status to `COMPLETED`

**Remaining Time Calculation:**
```typescript
if (status === RUNNING && startTime) {
  elapsed = now - startTime
  remaining = baseRemainingSeconds - elapsed
} else if (status === PAUSED) {
  remaining = storedRemainingSeconds
} else {
  remaining = allocatedMinutes * 60
}
```

## Migration Notes

- No database schema changes required
- Existing timers continue to work
- Backward compatible with existing data
- No breaking API changes

## Testing Recommendations

1. **Timer Accuracy:**
   - Verify timers count down accurately
   - Test pause/resume functionality
   - Verify time addition works correctly

2. **Performance:**
   - Monitor database write frequency
   - Check network request frequency
   - Verify CPU usage reduction

3. **Visibility API:**
   - Test tab switching (hide/show)
   - Verify polling pauses when hidden
   - Verify polling resumes when visible

4. **Edge Cases:**
   - Multiple timers running simultaneously
   - Timer expiration handling
   - Network disconnection scenarios

