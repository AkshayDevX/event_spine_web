---
name: anime-js
description: Anime.js v4 animation library. Use when building complex UI animations, staggering effects, timelines, scoped animations, and SVG animations with JavaScript. Keywords: animejs, anime, animation, timeline, SVG animation, createTimeline, animate, stagger, createScope.
---

# Anime.js v4 Skill

This skill provides guidelines and patterns for using **Anime.js v4**, a lightweight JavaScript animation library with a simple, yet powerful API.
It works with CSS properties, SVG, DOM attributes and JavaScript Objects.

> **IMPORTANT**: This documents Anime.js **v4** (4.x). The API is completely different from v3.
> - `anime()` → `animate()`
> - `anime.timeline()` → `createTimeline()`
> - `anime.stagger()` → `stagger()`
> - `easing: "easeOutExpo"` → `ease: "outExpo"`
> - `translateY` → `y`, `translateX` → `x`
> - Timeline `.add()` signature changed: `.add(target, params, position)`

## Installation

```bash
npm install animejs
# or
bun add animejs
```

## Module Imports

Every Anime.js module can be directly imported from the main module `'animejs'`:

```javascript
import { animate, createTimeline, stagger, createScope } from 'animejs';
```

### Subpath Imports (tree-shaking without bundler)

```javascript
import { animate } from 'animejs/animation';
import { createTimeline } from 'animejs/timeline';
import { createScope } from 'animejs/scope';
import * as utils from 'animejs/utils';       // stagger, random, etc.
import * as svg from 'animejs/svg';
import * as text from 'animejs/text';          // splitText
```

### Full list of available subpaths

```javascript
import { animate } from 'animejs/animation';
import { createTimer } from 'animejs/timer';
import { createTimeline } from 'animejs/timeline';
import { createAnimatable } from 'animejs/animatable';
import { createDraggable } from 'animejs/draggable';
import { createLayout } from 'animejs/layout';
import { createScope } from 'animejs/scope';
import { engine } from 'animejs/engine';
import * as events from 'animejs/events';
import * as easings from 'animejs/easings';
import * as utils from 'animejs/utils';
import * as svg from 'animejs/svg';
import * as text from 'animejs/text';
import * as waapi from 'animejs/waapi';
```

## Basic Animation

```javascript
import { animate } from 'animejs';

// animate(targets, parameters)
const animation = animate('.el', {
  x: 250,           // NOT translateX
  duration: 800,
  ease: 'inOutQuad'  // NOT easing: 'easeInOutQuad'
});
```

## Animatable Properties

- **CSS Properties**: `opacity`, `backgroundColor`, `borderRadius`, etc.
- **CSS Transforms**: `x`, `y`, `rotate`, `scale`, `skew` (shorthand for translateX/translateY).
- **Object properties**: Any object property containing a numerical value.
- **DOM Attributes**: Any DOM attribute containing a numerical value.
- **SVG Attributes**: e.g., `stroke-dashoffset`.

## Tween Parameters

Property-specific parameters use an object with `to`, `from`, `duration`, `delay`, `ease`:

```javascript
animate('.el', {
  x: { to: 250, duration: 800 },
  rotate: { to: 360, duration: 1800, ease: 'inOutSine' },
  scale: { to: 2, duration: 1600, delay: 800, ease: 'inOutQuart' },
  delay: 250
});
```

### Tween value types

```javascript
// From-to array syntax
animate('.el', { opacity: [0, 1] });

// Property keyframes
animate('.el', {
  y: [
    { to: '-2.75rem', ease: 'outExpo', duration: 600 },
    { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
  ]
});
```

## Playback Settings

- **duration**: (default 1000) Duration in ms.
- **delay**: (default 0) Delay in ms.
- **loop**: `true`, `false`, or a number.
- **loopDelay**: Delay between loops.
- **alternate**: `true` to alternate direction each loop (replaces `direction: 'alternate'`).
- **reversed**: `true` to play in reverse.
- **autoplay**: `true` (default), `false`.
- **ease**: e.g., `'outExpo'`, `'inOutQuad'`, `'linear'`, `'outBounce'`, `spring(...)`.

## Easing Names (v4)

**v4 uses simplified easing names** (no `ease` prefix):
- `'outExpo'` (not `'easeOutExpo'`)
- `'inOutQuad'` (not `'easeInOutQuad'`)
- `'outSine'` (not `'easeOutSine'`)
- `'outBounce'` (not `'easeOutBounce'`)
- `'linear'` stays the same
- `'inOut(3)'` — parametric shorthand
- `spring({ bounce: .7 })` — spring easing

## Staggering

```javascript
import { animate, stagger } from 'animejs';

animate('.el', {
  x: 250,
  delay: stagger(100)              // 100ms between each element
});

// Stagger from center of a grid
delay: stagger(30, { grid: [10, 10], from: 'center' })

// Stagger starting from a value
delay: stagger(100, { start: 500 })

// Stagger in reverse
delay: stagger(100, { direction: 'reverse' })
```

## Timelines

Timelines synchronize multiple animations, timers, and callbacks together.

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline({
  defaults: { duration: 750 }    // default params for all children
});

// .add(target, animationParams, position)
tl.add('.square', { x: '15rem' }, 500)        // starts at 500ms absolute
  .add('.circle', { x: '15rem' }, 'start')    // starts at label 'start'
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500'); // 500ms before prev ends
```

### Timeline Methods

```javascript
timeline.add(target, animationParameters, position);  // Add animation
timeline.add(timerParameters, position);               // Add timer
timeline.sync(timelineB, position);                    // Sync another timeline
timeline.call(callbackFunction, position);             // Call a function
timeline.label(labelName, position);                   // Add a named label
```

### Time Position Syntax

- **Absolute**: `500` — starts at 500ms
- **Relative to previous**: `'-=600'` — starts 600ms before previous ends
- **Relative to previous start**: `'<-=500'` — starts 500ms before previous starts
- **Label**: `'myLabel'` — starts at the position of a label

## Callbacks

- `onBegin`: Called once the animation starts.
- `onComplete`: Called once the animation has finished.
- `onUpdate`: Called every frame.
- `onLoop`: Called each time a loop completes.
- `onPause`: Called when paused.
- `then()`: Promise-based completion.

```javascript
animate('.el', {
  x: 250,
  onBegin: (anim) => console.log('started'),
  onComplete: (anim) => console.log('done'),
});
```

## Controls

```javascript
const anim = animate('.el', { x: 250, autoplay: false });

anim.play();
anim.pause();
anim.restart();
anim.reverse();
anim.seek(500);        // Seek to 500ms
anim.revert();          // Revert all changes
anim.cancel();          // Cancel animation
```

## Using with React & Next.js

### 1. The `"use client"` Directive (Next.js)

Anime.js requires browser APIs. In Next.js App Router, components using Anime.js **must** include `"use client"`.

### 2. Using `createScope` for React (RECOMMENDED)

The official v4 pattern for React uses `createScope` for proper cleanup:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createScope, stagger, createTimeline } from "animejs";

function AnimatedComponent() {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    // Create scope tied to the root ref — all selectors are scoped automatically
    scope.current = createScope({ root }).add((self) => {
      // Every animate/createTimeline inside here is scoped to <div ref={root}>
      // CSS selectors like '.my-class' only target elements inside root

      animate('.logo', {
        scale: [
          { to: 1.25, ease: 'inOut(3)', duration: 200 },
          { to: 1, ease: 'outBounce' }
        ],
        loop: true,
        loopDelay: 250,
      });

      // Register methods callable outside the scope
      self.add('rotateLogo', (i: number) => {
        animate('.logo', { rotate: i * 360, ease: 'out(4)', duration: 1500 });
      });
    });

    // Cleanup: reverts all animations inside the scope
    return () => scope.current?.revert();
  }, []);

  return (
    <div ref={root}>
      <img className="logo" src="/logo.svg" alt="Logo" />
    </div>
  );
}
```

### Key React best practices:

1. **Always use `createScope`** — it handles cleanup automatically on `revert()`.
2. **CSS selectors are scoped** — inside `createScope.add()`, selectors like `.my-class` only match elements inside the root ref.
3. **No need for manual `querySelectorAll`** — the scope handles scoping for you.
4. **StrictMode safe** — `scope.current.revert()` in the cleanup function handles React 18+ double-mount.
5. **Use `self.add(name, fn)`** to register methods callable outside the effect via `scope.current.methods.methodName()`.

### 3. Timeline Example in React

```tsx
"use client";

import { useEffect, useRef } from "react";
import { createTimeline, stagger, createScope } from "animejs";

export default function EntranceAnimation() {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      const tl = createTimeline({ defaults: { ease: "outExpo" } });

      tl.add(".hero-title", { y: [50, 0], opacity: [0, 1], duration: 1000 }, 0)
        .add(".hero-subtitle", { y: [30, 0], opacity: [0, 1], duration: 800 }, "-=600")
        .add(".cta-button", { scale: [0.8, 1], opacity: [0, 1], duration: 600 }, "-=400");
    });

    return () => scope.current?.revert();
  }, []);

  return (
    <div ref={root}>
      <h1 className="hero-title" style={{ opacity: 0 }}>Hello World</h1>
      <p className="hero-subtitle" style={{ opacity: 0 }}>Welcome</p>
      <button className="cta-button" style={{ opacity: 0 }}>Get Started</button>
    </div>
  );
}
```

### 4. Hardware Acceleration

Anime.js automatically promotes opacity and transform animations to the compositor. Use `x`/`y` instead of `left`/`top` for better performance.

## Text Splitting

```javascript
import { splitText, animate, stagger } from 'animejs';

const { chars, words, lines } = splitText('h2', { words: true, chars: true });

animate(chars, {
  y: [{ to: '-2.75rem', ease: 'outExpo', duration: 600 }, { to: 0, ease: 'outBounce', duration: 800 }],
  delay: stagger(50),
  loop: true,
});
```

## v3 → v4 Migration Quick Reference

| v3 | v4 |
|---|---|
| `import anime from 'animejs'` | `import { animate, createTimeline, stagger } from 'animejs'` |
| `anime({ targets, ... })` | `animate(targets, { ... })` |
| `anime.timeline({})` | `createTimeline({ defaults: {} })` |
| `tl.add({ targets, ... })` | `tl.add(targets, { ... })` |
| `anime.stagger(100)` | `stagger(100)` |
| `easing: 'easeOutExpo'` | `ease: 'outExpo'` |
| `translateX` / `translateY` | `x` / `y` |
| `direction: 'alternate'` | `alternate: true` |
| Manual cleanup | `createScope({ root }).revert()` |