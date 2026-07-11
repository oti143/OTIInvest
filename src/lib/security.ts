// Security utilities and rate limiting

interface RateLimitStore {
  [key: string]: { attempts: number; lastAttempt: number };
}

const rateLimitStore: RateLimitStore = {};
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_LOGIN_ATTEMPTS = 5;
const MAX_REGISTRATION_ATTEMPTS = 3;

/**
 * Check rate limiting for login attempts
 */
export function checkLoginRateLimit(username: string): { allowed: boolean; remaining: number } {
  const key = `login_${username}`;
  const now = Date.now();

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { attempts: 0, lastAttempt: now };
  }

  const record = rateLimitStore[key];

  // Reset if window expired
  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    record.attempts = 0;
    record.lastAttempt = now;
  }

  record.attempts++;
  record.lastAttempt = now;

  const allowed = record.attempts <= MAX_LOGIN_ATTEMPTS;
  const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - record.attempts);

  console.log(`🔒 Login attempt for ${username}: ${record.attempts}/${MAX_LOGIN_ATTEMPTS}`);

  return { allowed, remaining };
}

/**
 * Check rate limiting for registration
 */
export function checkRegistrationRateLimit(): { allowed: boolean; waitTime: number } {
  const key = "registration";
  const now = Date.now();

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { attempts: 0, lastAttempt: now };
  }

  const record = rateLimitStore[key];

  // Reset if window expired
  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    record.attempts = 0;
    record.lastAttempt = now;
  }

  const allowed = record.attempts < MAX_REGISTRATION_ATTEMPTS;

  if (!allowed) {
    const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - record.lastAttempt)) / 1000);
    console.log(`⛔ Rate limit exceeded. Wait ${waitTime}s before trying again`);
    return { allowed: false, waitTime };
  }

  record.attempts++;
  record.lastAttempt = now;

  console.log(`📝 Registration attempt: ${record.attempts}/${MAX_REGISTRATION_ATTEMPTS}`);

  return { allowed: true, waitTime: 0 };
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim()
    .substring(0, 255); // Max 255 chars
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return true; // Email is optional in some cases
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  // Accept 10-13 digit numbers (international format)
  const phoneRegex = /^\d{10,13}$/;
  return phoneRegex.test(phone.replace(/[\s\-\+]/g, ""));
}

/**
 * Validate Aadhaar format (12 digits)
 */
export function isValidAadhaar(aadhaar: string): boolean {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaar.replace(/[\s\-]/g, ""));
}

/**
 * Validate PAN format (Indian format)
 */
export function isValidPAN(pan: string): boolean {
  // PAN format: AAAPL5055K
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
}

/**
 * Validate bank account number
 */
export function isValidBankAccount(account: string): boolean {
  // Accept 9-18 digit account numbers
  const accountRegex = /^\d{9,18}$/;
  return accountRegex.test(account.replace(/[\s\-]/g, ""));
}

/**
 * Validate IFSC code
 */
export function isValidIFSC(ifsc: string): boolean {
  // IFSC format: SBIN0001234
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc.toUpperCase());
}

/**
 * Hash a string for client-side obfuscation (NOT for password security!)
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Generate a secure session ID
 */
export function generateSessionId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Clear sensitive data from memory
 */
export function clearSensitiveData(data: any): void {
  if (data && typeof data === "object") {
    Object.keys(data).forEach((key) => {
      if (
        key.toLowerCase().includes("password") ||
        key.toLowerCase().includes("secret") ||
        key.toLowerCase().includes("token")
      ) {
        data[key] = "";
      }
    });
  }
}
