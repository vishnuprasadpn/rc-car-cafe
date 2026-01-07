// Google Analytics 4 Event Tracking Utility

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
  }
}

/**
 * Track a custom event in Google Analytics
 * @param eventName - Name of the event
 * @param eventParams - Additional parameters for the event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: {
    action?: string
    category?: string
    label?: string
    value?: number
    [key: string]: unknown
  }
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      event_category: eventParams?.category || "general",
      event_label: eventParams?.label,
      value: eventParams?.value,
      ...eventParams,
    })
  }
}

/**
 * Track page views (usually handled automatically, but can be used for custom tracking)
 */
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
      page_path: url,
    })
  }
}

/**
 * Track button clicks
 */
export const trackButtonClick = (
  buttonName: string,
  location?: string,
  additionalData?: Record<string, unknown>
) => {
  trackEvent("button_click", {
    category: "engagement",
    action: "click",
    label: buttonName,
    location: location || "unknown",
    ...additionalData,
  })
}

/**
 * Track form submissions
 */
export const trackFormSubmit = (
  formName: string,
  success: boolean,
  additionalData?: Record<string, unknown>
) => {
  trackEvent("form_submit", {
    category: "engagement",
    action: success ? "submit_success" : "submit_error",
    label: formName,
    ...additionalData,
  })
}

/**
 * Track authentication events
 */
export const trackAuth = (
  action: "sign_in" | "sign_up" | "sign_out",
  method: "email" | "google" = "email"
) => {
  trackEvent("auth", {
    category: "authentication",
    action,
    method,
  })
}

/**
 * Track booking events
 */
export const trackBooking = (
  action: "view" | "create" | "cancel" | "complete",
  gameId?: string,
  amount?: number
) => {
  trackEvent("booking", {
    category: "booking",
    action,
    game_id: gameId,
    value: amount,
  })
}

/**
 * Track payment events
 */
export const trackPayment = (
  action: "initiate" | "success" | "failure",
  amount?: number,
  method?: string
) => {
  trackEvent("payment", {
    category: "payment",
    action,
    value: amount,
    payment_method: method,
  })
}

/**
 * Track navigation events
 */
export const trackNavigation = (destination: string, source?: string) => {
  trackEvent("navigation", {
    category: "navigation",
    action: "navigate",
    label: destination,
    source,
  })
}

/**
 * Track email sent events
 */
export const trackEmailSent = (
  emailType: "booking_request" | "booking_confirmation" | "booking_cancellation" | "points_approval" | "admin_notification" | "password_reset" | "admin_login_test",
  recipientEmail: string,
  success: boolean,
  additionalData?: Record<string, unknown>
) => {
  trackEvent("email_sent", {
    category: "email",
    action: success ? "email_sent_success" : "email_sent_failed",
    label: emailType,
    recipient: recipientEmail,
    email_type: emailType,
    ...additionalData,
  })
}

