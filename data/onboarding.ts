export const onboardingData = {
  buttons: {
    skip: 'Skip',
    next: 'Next',
    begin: 'Begin',
  },
  preview: 'Preview',
  instructions: [
    `Settle into your body and let time slow down. As you breathe, feel yourself dropping into this moment—the only moment that truly exists.`,
    `Focus on your Power center below the navel. Here you discover timelessness through your core strength. Let yourself sink so deeply into this center that time dissolves, revealing your natural`,
    `Move to your Heart center in your chest. In timelessness, love flows freely. Practice letting go—or if needed, dive so completely into what you're feeling that attachment releases itself.`,
    `Rest in your Wisdom center at your forehead. From timelessness comes true knowing. Whether through gentle release or complete surrender, find the space where wisdom naturally arises.`,
  ],
  pages: [
    {
      title: '',
      subtitle: '', // Uses SwipeIndicator component instead
    },
    {
      title: 'Three Sacred Centers',
      subtitle: 0, // Index into instructions array
    },
    {
      title: 'Wheel of Power',
      subtitle: 1,
    },
    {
      title: 'Wheel of Heart',
      subtitle: 2,
    },
    {
      title: 'Wheel of Wisdom',
      subtitle: 3,
    },
    {
      title: 'Ready to Begin?',
      subtitle: 'Tap the Meditate tab below to start your first session. Choose your duration and press Start.',
    },
  ],
} as const;
