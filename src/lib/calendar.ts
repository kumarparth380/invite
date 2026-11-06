const toUtcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** "Add to Google Calendar" link for an event that starts at an ISO time. */
export function googleCalendarUrl({
  title,
  start,
  hours,
  location,
  details,
}: {
  title: string;
  start: string;
  hours: number;
  location: string;
  details?: string;
}) {
  const s = new Date(start);
  const e = new Date(s.getTime() + hours * 3_600_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toUtcStamp(s)}/${toUtcStamp(e)}`,
    location,
    ctz: "Asia/Kolkata",
  });
  if (details) params.set("details", details);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
