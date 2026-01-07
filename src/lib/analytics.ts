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
 * Track email sent events (server-side)
 * Uses Google Analytics Measurement Protocol API for server-side tracking
 * Falls back to console logging if API secret is not configured
 */
export const trackEmailSent = async (
  emailType: "booking_request" | "booking_confirmation" | "booking_cancellation" | "points_approval" | "admin_notification" | "password_reset" | "admin_login_test" | "contact_form",
  recipientEmail: string,
  success: boolean,
  additionalData?: Record<string, unknown>
) => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const apiSecret = process.env.GA_API_SECRET
  
  if (!measurementId) {
    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Email Tracking] ${emailType} - ${success ? 'Success' : 'Failed'} - ${recipientEmail}`)
    }
    return
  }

  // Generate a unique client ID (using a hash of recipient email for consistency)
  const clientId = `email_${Buffer.from(recipientEmail).toString('base64').substring(0, 16)}`
  
  // Prepare event data
  const eventData = {
    client_id: clientId,
    events: [{
      name: "email_sent",
      params: {
        event_category: "email",
        event_action: success ? "email_sent_success" : "email_sent_failed",
        event_label: emailType,
        recipient: recipientEmail.substring(0, 50), // Truncate for privacy
        email_type: emailType,
        ...additionalData,
      }
    }]
  }

  try {
    if (apiSecret) {
      // Use Measurement Protocol API with authentication
      const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        console.warn(`[Email Tracking] Failed to send to GA: ${response.status} ${response.statusText}`)
      }
    } else {
      // Fallback: Log in development, silent in production
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Email Tracking] ${emailType} - ${success ? 'Success' : 'Failed'} - ${recipientEmail}`, additionalData)
        console.log(`[Email Tracking] Note: Set GA_API_SECRET for production tracking`)
      }
    }
  } catch (error) {
    // Don't throw - email tracking failure shouldn't break email sending
    if (process.env.NODE_ENV === 'development') {
      console.warn("[Email Tracking] Error:", error instanceof Error ? error.message : String(error))
    }
  }
}

