import { animate } from 'animejs';

// Common animation presets
export const animations = {
  // Fade in animation
  fadeIn: (element: Element, duration = 600) => {
    return animate(element, {
      opacity: [0, 1],
      duration,
      easing: 'easeOutExpo'
    });
  },

  // Fade out animation
  fadeOut: (element: Element, duration = 600) => {
    return animate(element, {
      opacity: [1, 0],
      duration,
      easing: 'easeInExpo'
    });
  },

  // Slide in from left
  slideInLeft: (element: Element, duration = 600) => {
    return animate(element, {
      translateX: [-100, 0],
      opacity: [0, 1],
      duration,
      easing: 'easeOutExpo'
    });
  },

  // Slide in from right
  slideInRight: (element: Element, duration = 600) => {
    return animate(element, {
      translateX: [100, 0],
      opacity: [0, 1],
      duration,
      easing: 'easeOutExpo'
    });
  },

  // Slide in from top
  slideInTop: (element: Element, duration = 600) => {
    return animate(element, {
      translateY: [-50, 0],
      opacity: [0, 1],
      duration,
      easing: 'easeOutExpo'
    });
  },

  // Slide in from bottom
  slideInBottom: (element: Element, duration = 600) => {
    return animate(element, {
      translateY: [50, 0],
      opacity: [0, 1],
      duration,
      easing: 'easeOutExpo'
    });
  },

  // Scale in animation
  scaleIn: (element: Element, duration = 600) => {
    return animate(element, {
      scale: [0, 1],
      opacity: [0, 1],
      duration,
      easing: 'easeOutElastic(1, .8)'
    });
  },

  // Bounce animation
  bounce: (element: Element, duration = 600) => {
    return animate(element, {
      scale: [1, 1.1, 1],
      duration,
      easing: 'easeOutElastic(1, .8)'
    });
  },

  // Shake animation
  shake: (element: Element, duration = 600) => {
    return animate(element, {
      translateX: [0, -10, 10, -10, 10, 0],
      duration,
      easing: 'easeInOutSine'
    });
  },

  // Pulse animation
  pulse: (element: Element, duration = 600) => {
    return animate(element, {
      scale: [1, 1.05, 1],
      duration,
      easing: 'easeInOutSine'
    });
  }
};

// Stagger animation for multiple elements
export const staggerAnimation = (
  elements: Element[],
  animation: (element: Element) => any,
  delay = 100
) => {
  elements.forEach((element, index) => {
    setTimeout(() => {
      animation(element);
    }, index * delay);
  });
};

// Sequential animation chain
export const chainAnimation = (
  animations: Array<() => any>,
  delay = 0
) => {
  let currentIndex = 0;

  const runNext = () => {
    if (currentIndex < animations.length) {
      animations[currentIndex]();
      currentIndex++;
      if (delay > 0) {
        setTimeout(runNext, delay);
      } else {
        runNext();
      }
    }
  };

  runNext();
};

// Utility to animate on scroll
export const animateOnScroll = (
  element: Element,
  animation: (element: Element) => any,
  threshold = 0.1
) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animation(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  observer.observe(element);
  return observer;
};

// Export the main animate function for direct use
export { animate }; 