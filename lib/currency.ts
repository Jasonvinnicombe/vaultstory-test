export type CurrencyCode = "AUD" | "USD" | "GBP" | "EUR";

const EURO_COUNTRIES = new Set([
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
]);

const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  AU: "AUD",
  US: "USD",
  GB: "GBP",
  UK: "GBP",
};

const COUNTRY_HEADER_CANDIDATES = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-geo-country",
  "x-country-code",
  "x-country",
  "x-vertex-country",
  "x-forwarded-country",
  "x-geoip-country",
  "x-geoip-country-code",
  "x-appengine-country",
  "x-railway-country",
];

const CURRENCY_COOKIE = "vs_currency";

function normalizeCountry(value: string | null | undefined) {
  if (!value) return null;
  const trimmed = value.trim().toUpperCase();
  if (!trimmed || trimmed === "XX" || trimmed === "ZZ") return null;
  return trimmed;
}

function normalizeCurrency(value: string | null | undefined): CurrencyCode | null {
  if (!value) return null;
  const trimmed = value.trim().toUpperCase();
  if (trimmed === "AUD" || trimmed === "USD" || trimmed === "GBP" || trimmed === "EUR") {
    return trimmed;
  }
  return null;
}

function getCountryFromHeaders(headers: Headers) {
  for (const header of COUNTRY_HEADER_CANDIDATES) {
    const value = normalizeCountry(headers.get(header));
    if (value) return value;
  }

  const acceptLanguage = headers.get("accept-language");
  if (!acceptLanguage) return null;

  const match = acceptLanguage.match(/[a-zA-Z]{2}-([a-zA-Z]{2})/);
  return normalizeCountry(match?.[1]);
}

function getCurrencyFromCookie(headers: Headers) {
  const cookieHeader = headers.get("cookie");
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.toLowerCase().startsWith(`${CURRENCY_COOKIE}=`));

  if (!match) return null;

  const value = match.split("=").slice(1).join("=");
  return normalizeCurrency(value);
}

export function getCurrencyForCountry(country: string | null | undefined): CurrencyCode | null {
  const normalized = normalizeCountry(country);
  if (!normalized) return null;

  if (COUNTRY_CURRENCY_MAP[normalized]) {
    return COUNTRY_CURRENCY_MAP[normalized];
  }

  if (EURO_COUNTRIES.has(normalized)) {
    return "EUR";
  }

  return null;
}

export function getCurrencyFromHeaders(headers: Headers, override?: string | null): CurrencyCode {
  const forced = normalizeCurrency(override);
  if (forced) return forced;

  const cookieCurrency = getCurrencyFromCookie(headers);
  if (cookieCurrency) return cookieCurrency;

  const country = getCountryFromHeaders(headers);
  return getCurrencyForCountry(country) ?? "USD";
}

export function getCurrencyCookieName() {
  return CURRENCY_COOKIE;
}
