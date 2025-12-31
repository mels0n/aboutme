/**
 * Analytics Utility
 * 
 * Provides a type-safe wrapper around Google Analytics (GA4) event tracking.
 * Safely handles server-side rendering checks and missing gtag instances.
 */

/**
 * Sends a custom event to Google Analytics.
 * 
 * @param eventName - The name of the event (e.g., 'manifesto_opened', 'click').
 * @param params - Optional parameters to send with the event (e.g., { context: 'engineer' }).
 */
export const sendEvent = (eventName: string, params?: Record<string, any>) => {
    // Ensure we are in the browser and gtag exists
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, params);
    } else if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] Event: ${eventName}`, params);
    }
};
