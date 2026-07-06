/**
 * Formats a number as Indian Rupee (INR) currency.
 */
export const formatCurrency = (amount: number): string => {
  const numStr = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹${numStr}`;
};

/**
 * Alias for formatCurrency or specific price formatting
 */
export const formatPrice = (amount: number): string => formatCurrency(amount);


/**
 * Formats a date string into a readable format.
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

/**
 * Formats a date string into a readable date and time.
 */
export const formatDateTime = (dateString: string | number | Date): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formats a date into a time-only string.
 */
export const formatTime = (dateString: string | number | Date): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * WhatsApp / iMessage-style timestamp for chat conversations.
 * - Today: "10:30 AM"
 * - Yesterday: "Yesterday"
 * - Within last 7 days: "Monday", "Tuesday", ...
 * - Older: "Oct 12" or "Oct 12, 2024"
 */
export const formatChatTime = (dateString: string | number | Date): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
    const startOf7DaysAgo = new Date(startOfToday.getTime() - 6 * 86400000);

    if (date >= startOfToday) {
      // Today → show Today
      return 'Today';
    }
    if (date >= startOfYesterday) {
      return 'Yesterday';
    }
    if (date >= startOf7DaysAgo) {
      // Within 7 days → show day name
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
    // Older → show "Oct 12" (or include year if not current year)
    const sameYear = date.getFullYear() === now.getFullYear();
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(sameYear ? {} : { year: 'numeric' }),
    });
  } catch {
    return '';
  }
};


/**
 * Formats a number of days into a "X Days / Y Nights" format.
 */
export const formatDuration = (days: number): string => {
  if (days <= 0) return '';
  if (days === 1) return '1 Day';
  return `${days} Days / ${days - 1} ${days - 1 === 1 ? 'Night' : 'Nights'}`;
};

/**
 * Formats a rating with 1 decimal precision.
 */
export const formatRating = (rating: number): string => {
  return (rating || 0).toFixed(1);
};

/**
 * Truncates a string to a specified length.
 */
export const truncate = (text: string, length: number = 100): string => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Capitalizes the first letter of each word in a string.
 */
export const capitalizeWords = (text: string): string => {
  if (!text) return '';
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Fixes absolute URLs that contain localhost or IP addresses.
 * Rewrites them to go through the current domain's /storage/ proxy path,
 * so images served from MinIO (http://IP:9000/bucket/...) become
 * https://tripdekho.in/storage/bucket/... — avoiding Mixed Content blocks.
 */
export const fixImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('/')) return url;
  
  try {
    const parsedUrl = new URL(url);
    const isIPAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsedUrl.hostname);
    const isLocalhost = parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1';
    
    if (isIPAddress || isLocalhost) {
      // Return a relative path for both Server and Client to avoid hydration mismatch.
      // The browser will naturally resolve this against the current domain.
      return `/storage${parsedUrl.pathname}${parsedUrl.search}`;
    }
  } catch (error) {
    return url;
  }
  
  return url;
};
