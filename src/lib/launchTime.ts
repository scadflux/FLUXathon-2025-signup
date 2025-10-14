/**
 * Launch time configuration utility
 *
 * The launch time is configured via VITE_LAUNCH_TIME environment variable
 * Format: ISO 8601 with timezone offset (e.g., "2025-10-16T12:00:00-04:00" for EDT)
 */

const DEFAULT_LAUNCH_TIME = "2025-10-16T12:00:00-04:00"; // Oct 16, 2025 12:00 PM EDT

/**
 * Get the configured launch time
 */
export const getLaunchTime = (): Date => {
  const launchTimeString = import.meta.env.VITE_LAUNCH_TIME || DEFAULT_LAUNCH_TIME;
  return new Date(launchTimeString);
};

/**
 * Check if the launch time has been reached
 */
export const hasLaunched = (): boolean => {
  const now = new Date();
  const launchTime = getLaunchTime();
  return now >= launchTime;
};

/**
 * Calculate time remaining until launch
 */
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const calculateTimeRemaining = (): TimeRemaining => {
  const now = new Date().getTime();
  const target = getLaunchTime().getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isExpired: false,
  };
};
