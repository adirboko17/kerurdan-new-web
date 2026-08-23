export const PHONE_ERROR = "נא להזין מספר טלפון ישראלי תקין";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function toLocalDigits(raw: string) {
  let value = raw.trim().replace(/[()\-.\s]/g, "");
  if (value.startsWith("+")) value = value.slice(1);
  const numeric = digitsOnly(value);

  if (numeric.startsWith("972")) return `0${numeric.slice(3)}`;
  if (numeric.startsWith("0")) return numeric;
  if (/^5\d{8}$/.test(numeric)) return `0${numeric}`;
  if (/^7\d{8}$/.test(numeric)) return `0${numeric}`;
  if (/^[23489]\d{7}$/.test(numeric)) return `0${numeric}`;
  return numeric;
}

export function normalizeIsraeliPhone(raw: string) {
  const digits = toLocalDigits(raw);
  if (/^05\d{8}$/.test(digits)) return digits;
  if (/^0[23489]\d{7}$/.test(digits)) return digits;
  if (/^07[2-9]\d{7}$/.test(digits)) return digits;
  return null;
}

export function formatIsraeliPhone(digits: string) {
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length === 9) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return digits;
}

export function parseIsraeliPhone(raw: string) {
  const digits = normalizeIsraeliPhone(raw);
  return digits ? formatIsraeliPhone(digits) : null;
}

export function phoneValidityMessage(raw: string) {
  if (!raw.trim()) return "נא למלא מספר טלפון";
  if (!normalizeIsraeliPhone(raw)) return PHONE_ERROR;
  return "";
}
