export const AESTHETICS_OPTIONS = [
  { value: "ugly", label: "Ugly" },
  { value: "meh", label: "Meh" },
  { value: "not_bad", label: "Not bad" },
  { value: "very_pretty", label: "Very pretty" },
  { value: "beautiful", label: "Beautiful" },
];

export const VALUE_FOR_MONEY_OPTIONS = [
  { value: "rip_off", label: "Absolute rip off" },
  { value: "pricey", label: "Bit on the pricey side" },
  { value: "about_right", label: "About right" },
  { value: "good_value", label: "Good value" },
  { value: "worth_every_penny", label: "Worth every penny" },
];

const AESTHETICS_VALUES = new Set(AESTHETICS_OPTIONS.map((option) => option.value));
const VALUE_VALUES = new Set(VALUE_FOR_MONEY_OPTIONS.map((option) => option.value));

export function getAestheticsLabel(value) {
  return AESTHETICS_OPTIONS.find((option) => option.value === value)?.label ?? null;
}

export function getValueForMoneyLabel(value) {
  return VALUE_FOR_MONEY_OPTIONS.find((option) => option.value === value)?.label ?? null;
}

export function isValidAesthetics(value) {
  return AESTHETICS_VALUES.has(value);
}

export function isValidValueForMoney(value) {
  return VALUE_VALUES.has(value);
}
