---
outline: [2, 3]
pageClass: project-case
---

# Priya Sleep: Telegram Mini App & Sleep Tracking Bot <Badge type="tip" text="Telegram Mini App" /> <Badge type="warning" text="Python 3 / aiogram" /> <Badge type="info" text="PHP REST API" /> <Badge type="tip" text="Vanilla JS ES6+" />

![Priya Sleep Application Interface and Character Artwork](/images/priya-sleep/main.png)

::: info <SolarIcon name="clipboard" /> Project Card

| Parameter | Value |
|---|---|
| **Stack** | Telegram WebApp API, Vanilla JavaScript (ES6+), Python 3.11 (aiogram, asyncio), PHP 8 REST API, CSS3 (Glassmorphism, CSS Grid), SVG Animations |
| **Duration** | 3 weeks (architecture, design system, Mini App, notification bot, reliability audit) |
| **Role** | Full-stack Developer / App Architect / UI Designer |
| **Architecture** | Telegram Mini App (Frontend) + PHP Data API (Storage) + Python Bot (Awake Alerts & Background Scheduler) |
| **Key Features** | 1-tap state toggle, day/night norm calculation, Awake Alerts (over-tiredness prevention), Admin Connect (consultant mode), swipe editing, Dev Mode |
| **Result** | Standalone mobile web application in Telegram with sub-100ms response time, 3G/LTE resilience, and complete data safety |

:::

---

## <SolarIcon name="pin" /> Project Overview & Specification

**Priya Sleep** is a specialized Telegram Mini App paired with an intelligent Telegram bot designed for parents and pediatric sleep consultants. The application automates baby sleep and wakefulness tracking, prevents overtiredness, and provides clear visual analytics of daily routines.

<figure>
  <img src="/images/priya-sleep/whole-day-stat.webp" alt="Daily sleep and awake timeline in Priya Sleep">
  <figcaption>24-hour timeline with Day/Night partitioning, awake window calculation, and sleep quota analytics</figcaption>
</figure>

### Challenges of Existing Solutions

1. **Cluttered Mobile Store Apps:** Most commercial trackers are overloaded with invasive ads, demand recurring subscriptions, take seconds to cold-boot, and lack effortless data sharing between spouses or consultants.
2. **Parental Fatigue Context:** Logging events often happens in dark rooms, one-handed, while coping with severe sleep deprivation. Any unnecessary clicks, complicated date pickers, or UI glitches lead to input errors.
3. **Flaky Mobile Connections (Slow 3G / Offline):** Putting a baby to sleep in low-reception areas or country houses often causes standard web apps to drop unsaved intervals or create double sessions upon repeated taps.
4. **Need for Proactive Interventions:** Parents need more than a passive logbook; they require **timely proactive warnings** when the child approaches their maximum awake window threshold to start wind-down rituals.

### Technical Specification & Goals

- **Telegram-First Ecosystem:** Operates natively inside Telegram via `window.Telegram.WebApp` without requiring external app installations.
- **One-Tap Logging UX:** A prominent action button toggling between “Fell Asleep” 🌙 and “Woke Up” ☀️ with automated time prefill and interactive wheel picker adjustments.
- **Intelligent Routine Analytics:** Automated calculation of sleep durations, awake windows (ВБ), Day (08:00–20:00) and Night (20:00–08:00) segmentation, total daily rest, and age-based norm achievement percentages.
- **Telegram Bot (Awake Alerts):** An asynchronous Python service built on `aiogram` monitoring active awake sessions in the background and delivering personalized push alerts before overtiredness occurs, with quiet hours respect.
- **Consultant Mode (Admin Connect):** Allows certified sleep consultants or co-parents to temporarily inspect and adjust records via bot commands (`/userId`) without credential sharing.

---

## <SolarIcon name="palette" /> Design System & User Experience (UX)

The user interface is crafted around the concept of **“Soft Minimalism”** and soothing Glassmorphism.

```
┌─────────────────────────────────────────────────────────────┐
│  🌙 Priya Sleep                                      [DEV]  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   [ 14:00 ]                           │  │
│  │            ▲                      ▼                   │  │
│  │   ┌───────────────────────────────────────────────┐   │  │
│  │   │          ☀️  WOKE UP (at 14:00)               │   │  │
│  │   └───────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  📅 TODAY                         🌙 11h 15m   ☀️ 12h 45m   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 🌓 NIGHT PERIOD (20:00 — 08:00)                       │  │
│  │ 🌙 22:30 → 07:45       9 h 15 min        [night sleep]│  │
│  │                                                       │  │
│  │ ☀️ DAY PERIOD (08:00 — 20:00)                         │  │
│  │ ☀️ 07:45 → 11:30       3 h 45 min        [awake]      │  │
│  │ 🌙 11:30 → 13:30       2 h 00 min        [day nap]    │  │
│  │ ☀️ 13:30 → 14:00*      0 h 30 min        [awake]      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Core UI/UX Components

1. **Pastel Calming Palette:**
   - Background: Gentle diagonal gradient `#F5F0FF` → `#FFF8F5` (lilac to warm cream).
   - Lilac accent (`#C9B1FF` / `#A78BFA`) — sleep phase, headers, relaxation.
   - Rose accent (`#FFB5C5` / `#F9A8D4`) — wake phase and active status.
   - Sage green (`#B5D4C1`) — norm progress and success indicators.
2. **Glassmorphic Cards:** Translucent `rgba(255, 255, 255, 0.7)` cards with `backdrop-filter: blur(12px)` providing optical depth and clarity.
3. **Interactive Wheel Time Picker:**
   - Displays real-time by default.
   - Allows quick ±5, ±15 min adjustments or smooth wheel scrolling.
   - **Wheel Picker Interaction Guard:** A protective timer that prevents accidental status toggles during active momentum scrolling.
4. **Mobile Touch Gestures:**
   - **Right Swipe on Record:** Triggers a modal dialog to edit start/end times with cascading adjustments to neighboring intervals.
   - **Left Swipe:** Instant safe record deletion with smooth collapse animations.
5. **Personal Room (User Custom UI):** Style isolation architecture that allows individual UI color and widget customization stored as JSON delta overrides.

---

## <SolarIcon name="clipboard" /> Complete Registry of Engineering Tasks

::: details <SolarIcon name="clipboard" /> View the Complete List of Tasks and Implementation Milestones

### <SolarIcon name="rocket" /> 1. Core Architecture & Frontend Mini App (`app/js/`)

#### 01 — Dev Mode & Isolation Environment <Badge type="tip" text="Done" />
> **Goal:** Build `telegram.js` with auto-environment detection: initializes native `window.Telegram.WebApp` with HapticFeedback in Telegram, and activates Dev Mode with mock user state and `localStorage` toggle in standard desktop browsers.

#### 02 — Interactive Timeline & Day/Night Calculations <Badge type="tip" text="Done" />
> **Goal:** Implement `app.js`: parse timestamps, group by calendar days, segment into Day (08:00–20:00) and Night (20:00–08:00), dynamically computing total sleep and awake windows in hours and minutes.

#### 03 — Gesture Swipe Controller & Modal Editing <Badge type="tip" text="Done" />
> **Goal:** Create touch controller supporting right swipe (interval editing with neighbor synchronization) and left swipe (instant deletion).

#### 04 — Background Tab Synchronization (Visibility Refresh) <Badge type="tip" text="Done" />
> **Goal:** Implement `document.addEventListener('visibilitychange')` and `window.onfocus` handlers: recalculates elapsed time on system clock delta and syncs with backend upon app reopening.

---

### <SolarIcon name="settings" /> 2. Backend & Data Storage Layer (`app/api/`)

#### 05 — PHP REST API & User JSON Storage <Badge type="tip" text="Done" />
> **Goal:** Develop lightweight REST API (`api/data.php`) operating on isolated user files (`data/users/{userId}.json`) supporting `get`, `save`, `addRecord`, `updateRecord`, `deleteRecord` actions with `flock(LOCK_EX)` concurrency control.

#### 06 — Telegram initData Authentication <Badge type="tip" text="Done" />
> **Goal:** Implement HMAC-SHA256 signature verification of Telegram's `initData` payload on the server, ensuring zero-password tamper-proof requests.

---

### <SolarIcon name="cpu" /> 3. Telegram Bot & Notification Service (`app/bot/`)

#### 07 — Asynchronous Bot on aiogram 3.x <Badge type="tip" text="Done" />
> **Goal:** Develop `telegram_bot.py`: Mini App menu launch button, user registration, `/start`, `/help`, and `/stats` commands.

#### 08 — Awake Alerts Background Worker <Badge type="tip" text="Done" />
> **Goal:** Build an asynchronous cron worker (`asyncio.create_task`) evaluating active wakefulness sessions every 60 seconds. When nearing `awakeThresholdMinutes`, the bot delivers personalized notifications respecting configured quiet hours.

#### 09 — Admin Connect & Merge Accounts Module <Badge type="tip" text="Done" />
> **Goal:** Enable temporary consultant inspection via `/{userId}` command with session routing in `data/admin-sessions.json` and reset via `/me`.

---

### <SolarIcon name="shield" /> 4. Reliability Audit & Concurrency Hardening

#### BUG-01 — Eliminate State Race Conditions & Duplicate Sessions on Slow Networks <Badge type="danger" text="Fixed" />
> **Goal:** Fix critical session gap bug occurring during slow 3G network latency or double tapping through an atomic transition state pattern.

:::

---

## <SolarIcon name="lightbulb" /> Deep Dive: Resolving Slow-Network Race Conditions

During real-world mobile testing over erratic 3G/LTE connections, a critical flaw emerged: tapping “Woke Up” occasionally generated **two concurrent sleep sessions** or aborted the sleep timer without opening a wakefulness interval.

<figure>
  <img src="/images/priya-sleep/moon-stat.webp" alt="Monthly sleep trends in Priya Sleep">
  <figcaption>Reliable trend analysis requires 100% record continuity without gaps, overlaps, or orphan states</figcaption>
</figure>

### Root Cause Analysis

The original implementation suffered from an **asynchronous state gap** between finishing an active record and starting a new one:

```javascript
// ❌ ORIGINAL PROBLEMATIC CODE (Race Condition)
async function endSleep(time) {
    // 1. Finish active sleep
    const duration = await finishActiveRecord(time);
    // ⚠️ Inside finishActiveRecord: state.activeRecord = null;
    // ⚠️ Browser waits for slow network response (1-3 seconds).
    
    // 2. If user taps again or a timer fires while waiting:
    // UI sees activeRecord === null and thinks child is already awake, triggering duplicate starts!
    
    await startAwake(time);
}
```

### Architectural Solution: Atomic State Transition

Implemented an atomic state transition model with optimistic UI feedback:

1. **State Locking:** Interface actions are locked during transition.
2. **Instant Optimistic State Replacement:** `state.activeRecord` is immediately populated with a temporary wakefulness object (`id: 'temp-active'`) before any asynchronous network call.
3. **Sequential Mutation with In-Place ID Patching:**

```javascript:line-numbers [app/js/app.js]
async function endSleep(time) {
    const currentRecord = state.activeRecord;
    
    if (!currentRecord || currentRecord.type !== 'sleep') {
        return;
    }

    // 1. Guard against duplicate clicks (Locking Guard) // [!code ++]
    if (state.isTransitioning) return; // [!code ++]
    state.isTransitioning = true; // [!code ++]

    const sleepDuration = calculateDuration(currentRecord.startTime, time);
    
    const awakeRecord = {
        type: 'awake',
        startTime: time,
        date: getCurrentDateString(),
        createdAt: new Date().toISOString()
    };
    
    // 2. ATOMICALLY set optimistic state BEFORE any await // [!code ++]
    state.activeRecord = { ...awakeRecord, id: 'temp-active' }; // [!code ++]
    updateUI(); // Instant visual feedback for the user // [!code ++]
    
    try {
        // 3. Persist completed sleep on server
        await Storage.updateRecord(currentRecord.id, {
            endTime: time,
            duration: sleepDuration,
            isCompleted: true
        });
        
        // 4. Create awake record and receive permanent server ID
        const savedAwake = await Storage.addRecord(awakeRecord);
        
        // 5. Update ID in-place without ever reverting to null
        if (state.activeRecord && state.activeRecord.id === 'temp-active') { // [!code highlight]
            state.activeRecord = savedAwake; // [!code highlight]
        } // [!code highlight]
        
        showToast('Priya is awake ☀️');
    } catch (error) {
        // Revert on network failure
        state.activeRecord = currentRecord;
        showToast('Network issue. Please try again', 'danger');
    } finally {
        state.isTransitioning = false; // [!code ++]
        updateUI();
    }
}
```

---

## <SolarIcon name="bolt" /> Technical Challenges & Solutions

### 1. Tab Focus & Timer Desync (Visibility Refresh)

::: warning Problem
Telegram Mini Apps are often backgrounded. Browser timer throttling slows down or freezes `setInterval` executions, causing the clock to display stale awake times upon reopening.
:::

::: tip <SolarIcon name="lightbulb" /> Solution: System Clock Synchronization on Focus
Attached listeners to `visibilitychange` and `focus` to instantly compute elapsed duration against the device's real-time hardware clock and reconcile with the backend:

```javascript
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        recalculateActiveTimers();
        Storage.syncLatest();
    }
});
```
:::

---

### 2. Background Awake Alerts via Python & aiogram 3.x

::: info <SolarIcon name="speaker" /> Notification Architecture
The bot runs an asynchronous evaluation loop checking wakefulness thresholds without heavy external queue dependencies:

1. Every 60 seconds, a background task reads active sessions from `data/users/*.json`.
2. When elapsed awake time reaches `awakeThresholdMinutes` (e.g., 90 minutes), the bot checks configured quiet hours (`quietHours`: 22:00–07:00).
3. If active, the bot delivers a personalized message:
   > 🔔 **Awake Window Alert:** Priya has been awake for **1 h 30 min** (Target for 7 months: 1 h 15 min – 1 h 45 min). Time to begin the wind-down routine!
4. Follow-up reminders are spaced by `reminderIntervalMinutes` to prevent spam.
:::

---

### 3. Consultant Access (Admin Connect) with Zero Credential Sharing

::: warning Problem
Certified sleep consultants need to inspect and adjust a client's sleep log without requiring parents to share login credentials or merging unrelated user datasets.
:::

::: tip <SolarIcon name="shield" /> Solution: Session-Based Proxy Routing via Bot
1. The consultant issues `/{targetUserId}` to the bot.
2. The bot validates admin privileges against `data/config.json` and updates session routing in `data/admin-sessions.json`.
3. When the consultant launches the Mini App, the backend serves the client's dataset with an active `“Consultant Mode: Viewing User #12345”` banner.
4. Issuing `/me` restores the consultant's personal profile instantly.
:::

---

## <SolarIcon name="trophy" /> Final Results & Key Metrics

::: tip 🏆 Priya Sleep Milestones & Performance Outcomes

| Metric | Traditional Trackers | Priya Sleep Mini App | Result |
|---|---|---|:---:|
| **Startup Latency** | 4–8 sec (heavy app launch) | **< 300 ms** inside Telegram | **Instant access** |
| **Input Effort** | 4–6 clicks across multiple screens | **1 tap** on home screen | **Effortless for parents** |
| **Slow Network Resilience** | Dropped entries / duplicates | Atomic optimistic transition | **Zero lost records** |
| **Overtiredness Alerts** | None or static alarms | Dynamic bot awake tracking | **Timely wind-downs** |
| **Co-Parenting / Consulting** | Expensive family plans | Admin Connect & Merge via bot | **Frictionless sharing** |
| **Privacy & Ads** | Invasive banner tracking | Clean stack, zero ads | **100% Private** |

:::
