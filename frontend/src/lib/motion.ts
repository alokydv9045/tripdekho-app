export const duration = {
  micro:    0.12,   // button tap, icon flash
  fast:     0.18,   // dropdown open, input focus border
  standard: 0.22,   // card hover lift, tab indicator slide
  reveal:   0.45,   // section scroll reveal
  hero:     0.50,   // hero entry
};

export const stagger = {
  hero:  0.08,   // hero children (max 4 children)
  cards: 0.06,   // card grid stagger (max 6 cards)
};

export const ease = {
  smooth: [0.16, 1, 0.3, 1] as const,  // all entries
  out:    [0, 0, 0.2, 1] as const,      // hover exits
};

export const variants = {
  // Advanced reveals
  blurReveal: {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 10 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.6, ease: ease.smooth } }
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: ease.smooth } }
  },
  slideUpDeep: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.smooth } }
  },
  fadeDownLong: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: ease.smooth } }
  },

  // Section / hero entry
  fadeInUp: {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.smooth } },
  },
  fadeInLeft: {
    hidden:  { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0,  transition: { duration: duration.hero, ease: ease.smooth } },
  },
  fadeInRight: {
    hidden:  { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0,  transition: { duration: duration.hero, ease: ease.smooth } },
  },

  // Stagger container
  staggerContainer: {
    hidden:  {},
    visible: { transition: { staggerChildren: stagger.cards, delayChildren: 0 } },
  },
  heroStagger: {
    hidden:  {},
    visible: { transition: { staggerChildren: stagger.hero, delayChildren: 0 } },
  },

  // Stagger child
  staggerChild: {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0,  transition: { duration: duration.hero, ease: ease.smooth } },
  },
  staggerChildFadeDown: {
    hidden:  { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0,  transition: { duration: 1.0, ease: ease.smooth } },
  },
  staggerChildLeft: {
    hidden:  { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: duration.reveal, ease: ease.smooth } },
  },
  staggerChildRight: {
    hidden:  { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: duration.reveal, ease: ease.smooth } },
  },

  // Page transition
  pageEnter: { opacity: 0, y: 8 },
  pageAnimate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: ease.smooth } },
  pageExit:  { opacity: 0, y: -8, transition: { duration: 0.15, ease: ease.out } },
};
