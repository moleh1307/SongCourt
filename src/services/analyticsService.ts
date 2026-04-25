export const analyticsService = {
  track(eventName: string, properties?: Record<string, unknown>) {
    if (__DEV__) {
      console.log(`[analytics] ${eventName}`, properties ?? {});
    }
  },
};
