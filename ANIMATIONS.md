# Anime.js Animation Library

This project includes Anime.js v4.0.2 for creating smooth and powerful animations.

## Installation

The package is already installed in this project:

```bash
npm install animejs
npm install --save-dev @types/animejs
```

## Basic Usage

### Direct Import

```typescript
import { animate } from 'animejs';

// Basic animation
animate(element, {
  translateX: 250,
  rotate: '1turn',
  backgroundColor: '#FFC107',
  duration: 800,
  direction: 'alternate',
  loop: true
});
```

### Using Animation Utilities

We've created utility functions to make common animations easier to use:

```typescript
import { animations, staggerAnimation, animateOnScroll } from '@/utils/animation';

// Fade in animation
animations.fadeIn(element, 600);

// Slide in from left
animations.slideInLeft(element, 800);

// Scale in with elastic easing
animations.scaleIn(element, 1000);
```

## Available Animation Presets

### Basic Animations
- `fadeIn(element, duration)` - Fade in from transparent to opaque
- `fadeOut(element, duration)` - Fade out from opaque to transparent
- `slideInLeft(element, duration)` - Slide in from the left
- `slideInRight(element, duration)` - Slide in from the right
- `slideInTop(element, duration)` - Slide in from the top
- `slideInBottom(element, duration)` - Slide in from the bottom
- `scaleIn(element, duration)` - Scale in from 0 to 1 with elastic easing

### Interactive Animations
- `bounce(element, duration)` - Bounce scale animation
- `shake(element, duration)` - Shake horizontally
- `pulse(element, duration)` - Pulse scale animation

## Advanced Features

### Stagger Animation

Animate multiple elements with a delay between each:

```typescript
import { staggerAnimation, animations } from '@/utils/animation';

const elements = [element1, element2, element3];
staggerAnimation(elements, (el) => animations.fadeIn(el), 200);
```

### Scroll-Triggered Animation

Animate elements when they come into view:

```typescript
import { animateOnScroll, animations } from '@/utils/animation';

animateOnScroll(element, (el) => animations.scaleIn(el), 0.1);
```

### Sequential Animation Chain

Chain multiple animations together:

```typescript
import { chainAnimation } from '@/utils/animation';

chainAnimation([
  () => animations.fadeIn(element1),
  () => animations.slideInLeft(element2),
  () => animations.scaleIn(element3)
], 300);
```

## Examples

### React Component Example

```typescript
"use client";

import { useEffect, useRef } from 'react';
import { animations } from '@/utils/animation';

export default function AnimatedComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      animations.fadeIn(elementRef.current, 800);
    }
  }, []);

  return (
    <div ref={elementRef} className="opacity-0">
      This element will fade in on mount
    </div>
  );
}
```

### Click Animation Example

```typescript
"use client";

import { useRef } from 'react';
import { animations } from '@/utils/animation';

export default function ClickableComponent() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (buttonRef.current) {
      animations.bounce(buttonRef.current);
    }
  };

  return (
    <button ref={buttonRef} onClick={handleClick}>
      Click me to bounce!
    </button>
  );
}
```

## Animation Parameters

### Common Properties

- `duration` - Animation duration in milliseconds
- `easing` - Easing function (e.g., 'easeOutExpo', 'easeInOutSine')
- `delay` - Delay before animation starts
- `direction` - 'normal', 'reverse', 'alternate', 'alternate-reverse'
- `loop` - Number of times to loop (true for infinite)
- `complete` - Callback function when animation completes

### Transform Properties

- `translateX` - Horizontal translation
- `translateY` - Vertical translation
- `scale` - Scale transformation
- `rotate` - Rotation (e.g., '1turn', '180deg')
- `skewX` - Horizontal skew
- `skewY` - Vertical skew

### Style Properties

- `opacity` - Opacity value (0-1)
- `backgroundColor` - Background color
- `color` - Text color
- `width` - Element width
- `height` - Element height

## Easing Functions

Anime.js provides many built-in easing functions:

- `linear` - Linear easing
- `easeInQuad` - Quadratic ease-in
- `easeOutQuad` - Quadratic ease-out
- `easeInOutQuad` - Quadratic ease-in-out
- `easeInCubic` - Cubic ease-in
- `easeOutCubic` - Cubic ease-out
- `easeInOutCubic` - Cubic ease-in-out
- `easeInExpo` - Exponential ease-in
- `easeOutExpo` - Exponential ease-out
- `easeInOutExpo` - Exponential ease-in-out
- `easeInElastic(1, .8)` - Elastic ease-in
- `easeOutElastic(1, .8)` - Elastic ease-out

## Best Practices

1. **Performance**: Use `transform` and `opacity` properties for best performance
2. **Accessibility**: Ensure animations don't interfere with user experience
3. **Reduced Motion**: Consider users who prefer reduced motion
4. **Mobile**: Test animations on mobile devices for performance
5. **Cleanup**: Remove animation listeners when components unmount

## Examples in This Project

- `/examples/animations/page.tsx` - Basic Anime.js examples
- `/examples/animations/utility-example.tsx` - Animation utilities examples
- `/utils/animation.ts` - Animation utility functions

## Resources

- [Anime.js Documentation](https://animejs.com/)
- [Anime.js GitHub](https://github.com/juliangarnier/anime)
- [Easing Functions](https://easings.net/) 