import { defaultLanguage, i18n } from "@/lib/i18n/i18n";

const formatDate = (value: number) => {
  return new Intl.DateTimeFormat(i18n.language || defaultLanguage, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const isSameDate = (left: number, right: number) => {
  const leftDate = new Date(left);
  const rightDate = new Date(right);

  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  );
};

const formatTime = (value: number) => {
  return new Intl.DateTimeFormat(i18n.language || defaultLanguage, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

export { formatDate, formatTime, isSameDate };
