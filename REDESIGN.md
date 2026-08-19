# TASK: Build "Timewheel" App Session Screen Component

Build a minimalist, highly tactile meditation & timer UI in React / React Native (or Swift/SwiftUI) called "Timewheel". The interface replaces traditional linear timers with three concentric, expanding, and slowly spinning rings that represent three stages of a session.

---

## 1. Theme & Color System (Light & Dark Mode)

Support dynamic switching between Dark Mode (Default) and Light Mode:

### Dark Mode (Default)

- **Screen Background:** Deep Charcoal / Obsidian (`#121212` or `#141312`)
- **Center Cloud Effect:** A soft, smoky, blurred white-to-grey radial gradient glow at the center behind the timer numbers.
- **Rings (Inactive):** 1px stroke in Muted Ash Grey (`#383532`)
- **Rings (Active Progress):** Solid Bone White (`#EAE3D2`) with a subtle outer glow
- **Text & Controls:** Bone White (`#EAE3D2`)

### Light Mode

- **Screen Background:** Soft Off-White / Parchment (`#F9F8F6`)
- **Center Cloud Effect:** A smoky, blurred black-to-grey radial gradient cloud at the center.
- **Rings (Inactive):** 1px stroke in Light Slate Grey (`#D0CECA`)
- **Rings (Active Progress):** Deep Charcoal / Black (`#1A1A1A`)
- **Text & Controls:** Deep Charcoal (`#1A1A1A`)

---

## 2. Layout & Component Hierarchy

1. **Footer:** Minimal clean footer.
2. **Central Canvas (The Timewheel):**
   - **Smokey Center Cloud:** Render a soft, organic blur (`backdrop-filter: blur` or SVG Gaussian blur) behind the main timer.
   - **Central Digital Timer:** Display time as `MM:SS` in a bold, elegant sans-serif font dead center inside the cloud.
   - **3 Concentric Rings:**
     - Ring 1 (Inner) -> Stage 1
     - Ring 2 (Middle) -> Stage 2
     - Ring 3 (Outer) -> Stage 3
3. **Control Area (Bottom):**
   - A single minimalist pill button container.

---

## 3. Interactive Behaviors & Controls

### Time Picker (Idle State)

- Remove standard wheel pickers/inputs.
- Implement a **Circular Gesture Controller**: Brushing a finger in a clockwise or counter-clockwise arc around the central ring perimeter increases/decreases the session time.
- Update the central `MM:SS` display in real time as the user dials.

### Button States

- **Idle State:** Show a single primary pill button: `[ Start ]`.
- **Active State:** The primary button smoothly transitions into split controls: `[ Pause ]` and a smaller secondary `[ Cancel ]` button below.

---

## 4. Animation & Motion Design

### Concentric Ring Expansion

- Calculate session duration divided equally into 3 stages (e.g., a 6-minute timer = three 2-minute stages).
- As time counts down:
  1. The progress fill expands outward from the central cloud into **Ring 1**.
  2. Upon reaching Ring 1 completion, trigger milestone cues (see Section 5), lock Ring 1 into a solid stroke, and expand progress into **Ring 2**.
  3. Expand into **Ring 3** until the full wheel is bloomed at `00:00`.

### Ring Rotation ("Timespinning")

- While the session is **Active**, apply a slow, continuous rotational motion to the concentric rings (e.g., a slow linear CSS/Canvas rotation matrix).
- Keep rotation subtle ($15\text{--}30\text{ seconds}$ per full rotation) to evoke a spinning wheel without causing visual distraction.

---

## 5. Milestone Cues (Stage Transitions)

When the progress animation hits the boundary of Ring 1, Ring 2, or Ring 3:

1. **Haptic Feedback:** Trigger a heavy/impact haptic pulse (`Haptics.impactAsync(HapticFeedbackStyle.Heavy)` in React Native / `UIImpactFeedbackGenerator(style: .heavy)` in iOS).
2. **Visual Snap:** The completed ring line momentarily flashes/pulses in opacity before solidifying.
3. **Sonic Cue (Optional setting):** Play a short, soft resonant chime/gong sound.

---

## Implementation Log (Session Screen)

**Status:** Session screen redesigned & wired up. Visual QA + E2E still pending.

### Confirmed decisions

- **Terminology:** The app is **Timewheel** (aka **Kalachakra**). The timer component is **the Wheel** (the chakra). The three concentric phase layers inside it are **Rings** (Ring 1/2/3 = phase 1/2/3). `src/components/Session/Wheel` = the chakra; `src/components/Session/Wheel/Ring` = one phase ring; the old card-style circle used by Onboarding is `Session/RingCard`.
- **Cloud, not hard lines:** The wheel is a **smoky cloud**, not a solid hub with hard 1px rings. A radial gradient runs from a bright core out to the screen color — dark mode: white core fading to obsidian; light mode: charcoal core fading to parchment. The numerals invert against the core (`wheelText`). The cloud **gradually expands** as the session progresses.
- **Timespinning:** ~~A rotating nebula~~ **Removed (round 11)** — the glowing smoke streaks looked wrong while spinning. The wheel is now the **expanding cloud** + idle **dial** + center timer. A new motion design is pending; `prefers-reduced-motion` handling stays with Onboarding's `RingCard`.
- **Scope:** Keep the existing session engine (`usePhasedTimer`, notifications, chime/haptic alerts, completion reset, duration persistence). Rebuild only the session screen visual layer.
- **Center timer:** Counts down the **overall** session time (`MM:SS`). Stage changes are signalled by haptics + chimes.
- **No rings (round 9):** Dropped the three phase rings entirely — the wheel is just the **expanding cloud** + **spinning nebula** + idle **dial** + center timer. Stage boundaries are marked by the **heavy haptic** + **chime** alone; the wheel itself only grows and spins.
- **Palette:** Monochrome progress color (Bone White in dark / Charcoal in light). `wheelRings` tokens are now unused (kept for now).
- **Dial (idle):** The wheel IS the slider. A hard 1px base ring + minute ticks (every minute, longer every 5), labels **5–60** around it, and a draggable nub. Tap a spot to jump to that minute; brush clockwise/counterclockwise to adjust. Absolute finger-angle mapping: 12 o'clock = 60, one full circle = 60 min, clamped to 1–60. Defaults to last-used duration. (Native `@react-native-picker/picker` list was removed.)
- **Footer:** Existing tab bar kept and restyled to match the new palette; rest of the app is not redesigned yet.
- **Wheel form:** Idle shows only the soft cloud + nebula + timer + dial. While running, the cloud swells and the nebula spins; nothing else forms.
- **Stage signifiers:** Stage changes are marked by the **heavy haptic** and the **chime** — no visual flash, snap, or color shift.

### What's implemented

- **Theme** (`src/hooks/ui/use-theme.ts`, `src/types/index.ts`): new monochrome palette — Dark: obsidian `#121212` / bone `#EAE3D2` / ash `#383532`; Light: parchment `#F9F8F6` / charcoal `#1A1A1A` / slate `#D0CECA`. Added `ringInactive`, `ringActive`, `wheelCloud: [string,string,string]` (center cloud gradient stops), `wheelRings: [string,string,string]` (per-stage tone), `wheelText` tokens to `AppColors`. Applies to the whole app (other screens follow the new colors but aren't redesigned).
- **Wheel** (`src/components/Session/Wheel/index.tsx`): the chakra/timer —
  - **Expanding center cloud**: a radial-gradient disc (`timewheel-cloud`) whose radius swells from `~0.44×half` (idle) to `~0.92×half` (full bloom) driven by `overallProgress` — "white going out to black" (dark) / "black going out to white" (light).
  - Center digital timer: `MM:SS`, `~size * 0.11` font, `wheelText` (charcoal light-mode / black dark-mode) on the cloud's bright core.
- **Nebula** (`Nebula.tsx`): **removed in round 11** — the spinning smoke-streak "orbs" looked wrong. (`use-reduced-motion` still used by Onboarding's `RingCard`.)
  - Circular slider dial (idle only): `Dial.tsx` renders a soft cloud track + minute labels + nub; a `Gesture.Pan` (`.minDistance(0)`, `.shouldCancelWhenOutside(false)`) maps the finger's angle via `fingerAngleToMinutes` and commits via `runOnJS` → `onDialMinutes`. Accessibility `adjustable` role with increment/decrement actions.
- **Ring** (`src/components/Session/Wheel/Ring.tsx`): **removed in round 9** — the phase rings are gone. Its gradient math (`ringBandStops`) moved into `src/utils/ring.ts` for the dial track.
- **Nebula** (`src/components/Session/Wheel/Nebula.tsx`): the rotating smoke-streak cloud — **removed in round 11**.
- **Dial** (`src/components/Session/Wheel/Dial.tsx`): the circular slider — hard base ring, minute ticks (every minute, longer every 5), labels every 5, current-minute nub. Rendered only while idle.
- **Dial math** (`src/utils/dial.ts`): `angleDeltaRad`, `radiansToMinutes`, `clampMinutes` (1–60), `minuteToRadians`, `fingerAngleToMinutes`, `DIAL_*` constants. Worklet-safe.
- **Ring math** (`src/utils/ring.ts`): `overallProgress(now, phaseSeconds)` → 0..1 across the whole session (drives the cloud expansion); `clamp01`. (`ringProgress` and `ringBandStops` were removed with the rings and the soft dial track.)
- **Control** (`src/components/Session/Control/index.tsx`): minimalist pill buttons — single `[Start]` idle; `[Pause]`/`[Resume]` + smaller secondary `[Cancel]` below when started. Test IDs preserved: `start-button`, `pause-button`, `resume-button`, `cancel-button`.
- **Session screen** (`src/app/(tabs)/session.tsx`): engine untouched; `Wheels`/`DurationPicker` removed; `DismissKeyboard` removed (no inputs, and its `ScrollView` was swallowing the dial gesture).
- **Footer** (`src/app/(tabs)/_layout.tsx`): tab bar background now blends with the screen.
- **Milestones**: stage-transition haptic upgraded to **Heavy** (`use-session-effects.ts`); chimes unchanged.
- **Button** (`src/components/Button/index.tsx`): now uses theme colors (was hardcoded green); pill radius.

### Files changed/added

- Added: `src/components/Session/Wheel/` (Wheel timer + `Cloud.tsx` rotating cloud + `Dial.tsx` circular slider), `src/utils/dial.ts`, `src/utils/ring.ts`, `src/tests/dial.test.ts`, `src/tests/ring.test.ts`, `src/tests/wheel.test.tsx`
- Modified: `src/hooks/ui/use-theme.ts`, `src/types/index.ts`, `src/app/(tabs)/session.tsx`, `src/app/(tabs)/_layout.tsx`, `src/components/Session/{index,Control}`, `src/components/Button/index.tsx`, `src/hooks/session/use-session-effects.ts`, `vitest.config.ts`
- Renamed: `Session/Timewheel` → `Session/Wheel`, `Session/Ring` (card, Onboarding) → `Session/RingCard`, `utils/wheel.ts` → `utils/ring.ts`, tests `timewheel→wheel`, `ring(card)`, `wheel(utils)→ring`
- Removed: `src/components/Session/Wheels/`, `src/components/Session/DurationPicker/`, `src/components/Session/Wheel/InkRing.tsx`, `src/utils/ink-ring.ts`

### How to verify

- Unit: `npm test` (61 passing), `npm run lint`, `npx tsc --noEmit`
- Visual: `npm run ios` — check the cloud slowly expanding during a session, the idle dial (base ring + minute ticks + labels + nub), the heavy haptic + chime at each stage change, completion state (full cloud bloom, `00:00`)
- E2E: `npm run e2e:session` (test IDs intact; needs a build)

### Next steps / backlog

- [x] **Feedback round 3 (terminology + numerals):**
  - Naming clarified in code: the timer is **Wheel** (the chakra), its three phase layers are **Rings**, the card-style circle used by Onboarding is **RingCard**, the ring-progress math moved to `utils/ring.ts`.
  - Numerals now render on a **contrast-inverted wheel hub** (light: charcoal hub + bone digits; dark: white hub + black digits on the obsidian screen) — added `wheelHubColors` + `wheelText` theme tokens.
- [x] **Feedback round 6 (cloud design):**
  - Dropped the hard 1px rings and solid hub. The wheel is now a **smoky cloud**: a radial gradient from a bright core out to the screen color (white→obsidian in dark, charcoal→parchment in light) that **gradually expands** with `overallProgress` as the session runs.
  - Each stage's ring is a **soft gradient band** (`ringBandStops`) that blooms in, brightens and slightly swells with the stage's progress, and carries a **subtle per-stage tone** (`wheelRings`) so crossing a ring boundary visibly shifts the gradient.
  - The idle dial lost its hard base ring + tick marks in favor of a soft cloud track; minute labels + nub + brush gesture unchanged.
- [x] **Feedback round 7 (timespinning):**
  - Removed the **pulsing**: dropped the milestone flash/pulse animation and the ring opacity ramping — rings fade in once and stay steady. Stage changes are signalled by the haptic, chime, the new ring blooming, and the per-stage tone shift.
  - Added a **rotating nebula** (`Nebula.tsx`): 14 soft smoke streaks (elliptical radial-gradient wisps) orbit the hub via `useFrameCallback` — **still until the session starts**, spinning from `~9.6°/s` up to `~16°/s` while running ("generating power"), expanding outward with the cloud. Respects `prefers-reduced-motion` (spin stops).
- [x] **Feedback round 4 (circular slider):**
  - Swipe-to-change replaced with an absolute finger-angle mapping (`fingerAngleToMinutes`, worklet-safe) — tap the ring to jump to a duration, brush to adjust. Fixed the 12 o'clock = 0 → 1 clamp edge so 60 reads correctly. Gesture hardened with `.minDistance(0)` + `.shouldCancelWhenOutside(false)`.
  - New `Dial.tsx`: minute ticks around the inner ring, labels 5–60, draggable nub — the wheel IS the slider, integrated, idle-only.
  - **Crash fix:** worklet functions must NOT reference module constants in default parameter values (e.g. `min = DIAL_MIN_MINUTES`) — they aren't captured on the UI thread and throw `ReferenceError`. `clampMinutes`/`radiansToMinutes` now default to literals. Constants in the function *body* are fine.
- [x] **Feedback round 5 (default + stability):**
  - Default duration is now **10 minutes** everywhere (initial phases, persistence default `lastDurationMinutes`, `parseInt(input) || 10` fallbacks in `session.tsx` + dead `SessionContext.tsx`).
  - Layout no longer jumps on start: the primary pill (`[Start]`/`[Pause]`/`[Resume]`) is **always mounted in a fixed bottom-anchored slot** — it never remounts or moves. `[Cancel]` fades in/out (`FadeIn`/`FadeOut`) inside an always-reserved slot below it, so the primary sits a little higher and Cancel appears/disappears beneath without shifting anything. `Control` keeps its fixed 152px height; the completion message sits in a fixed 48px slot in `session.tsx`. The wheel stays put through idle → running → complete.
- [x] **Feedback round 9 (no rings):**
  - Removed the three phase rings (`Ring.tsx` deleted). The wheel is now just the expanding cloud + rotating nebula + idle dial + center timer. Stage boundaries rely on the existing **heavy haptic** + **chime** from `use-session-effects.ts`; no visual stage marker.
  - `ringBandStops` moved from `Ring.tsx` into `utils/ring.ts` (still used for the dial track gradient); `ringProgress` deleted with its tests.
  - Backlog: a future visual cue with the **time text itself** (e.g. digits shifting color/weight at 1/3 and 2/3) if a passive "which third" indicator is wanted.
- [x] **Round 10 (dial restored):** Replaced the soft cloud dial track with the earlier hard **base ring + minute ticks** dial (every-minute ticks, longer every 5) so the idle time picker reads as a dial again. `ringBandStops` fully removed (`utils/ring.ts`), `timewheel-dial-track` gradient deleted.
- [x] **Round 11 (nebula removed):** Deleted `Nebula.tsx` — the glowing smoke streaks ("orbs") looked wrong, especially while spinning. The wheel is now just the **expanding cloud** + idle **dial** + center timer; a fresh motion design is pending. `timewheel-wisp` gradient and the `use-reduced-motion` wiring in the Wheel removed (hook still used by Onboarding `RingCard`).
- [ ] Visual QA on simulator/device (dial feel, dark hub + numerals, cloud growth pacing)
- [ ] E2E session suite (`npm run e2e:session`) once a build is made
- [ ] Backlog: time-text cue at the 1/3 and 2/3 boundaries (see round 9) once stage visuals are confirmed unnecessary
- [ ] Cleanup: `wheelRings` tokens in `use-theme.ts` / `types/index.ts` are unused after the ring removal — remove once no screens reference them
- [ ] Eventually: apply the new palette/design to Home, Explore, Settings pages
- [ ] Leftover: `src/components/Session/RingCard/index.tsx` (old card-style ring) is now only used by Onboarding — revisit when onboarding is redesigned
