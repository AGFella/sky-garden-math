# Sky Garden Math

A browser game for children to practice arithmetic with playful visuals and bilingual/trilingual UI (RU/IT/EN).

## Features
- Three difficulty levels: Easy, Medium, Hard (always selectable)
- 10-question rounds with segmented progress (green for correct, red for wrong)
- Start modal with player name, difficulty, and timer toggle
- Optional timer (`MM:SS`) with pause/continue and round time on completion popup
- Round celebration: kitten reactions, encouragement speech bubble, confetti, delayed result popup
- Flower-building mechanic (10 parts) and flower transfer to background islands after each round
- Dynamic background elements: floating clouds and periodic rainbow appearance
- Hall of Fame / score system (localStorage):
  - Mini scoreboard on main screen (top 3)
  - Full Hall of Fame overlay
  - Separate storage for timer and no-timer games
  - Save result button with duplicate-protection and update-by-name behavior
  - Clear results flow with confirmation dialog

## Difficulty Rules
- Easy:
  - Operations: `+`, `-`, `x`, `/` with equal 25% mix
  - No zero operands
  - Addition result always `<= 20`
  - Multiplication/division factors up to `6`
- Medium:
  - Operations: `+`, `-`, `x`, `/` with equal 25% mix
  - No zero operands
  - `+`/`-` operands up to `30`
  - `x`/`/` factors up to `9`
- Hard:
  - Operations: `+`, `-`, `x`, `/` with equal 25% mix
  - No zero operands
  - Operands/factors up to `100`

## Scoring
- Correct answer gives base points multiplied by difficulty:
  - Easy: `x1.0`
  - Medium: `x1.1`
  - Hard: `x1.2`
- Streak bonus every 3 consecutive correct answers (same multiplier applied)

## Run Locally
Open `/Users/AIzotov/Documents/MathGame/index.html` in your browser.

## Project Structure
- `/Users/AIzotov/Documents/MathGame/index.html`: UI markup and overlays
- `/Users/AIzotov/Documents/MathGame/styles.css`: layout, animations, visuals
- `/Users/AIzotov/Documents/MathGame/app.js`: game rules, scoring, localization, storage
- `/Users/AIzotov/Documents/MathGame/assets/rainbow.png`: rainbow asset

## Notes
- Division questions are always generated with integer results.
- Scores are stored locally in browser storage and are device/browser specific.
