/**
 * All wording, dates and links for the invitation live in this one file.
 * Edit here; no component needs to change.
 *
 * Times are Indian Standard Time and are written as ISO strings with the
 * +05:30 offset so the countdown and "save the date" links are exact.
 */

export type InviteEvent = {
  id: string;
  title: string;
  /** Accent used for this event's icon. */
  tint: string;
  icon: "haldi" | "mehndi" | "wedding";
  dayName: string;
  dateText: string;
  timeText: string;
  venue: string;
  /** Start of the event (IST). */
  start: string;
  /** Length used for the calendar entry, in hours. */
  hours: number;
  /** Google Maps link. Replace with the exact pin link if you have one. */
  mapUrl: string;
};

const mapsSearch = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const homeAddress = "रैदोपुर, आजमगढ़";
const homeMap = mapsSearch("Raidopur, Azamgarh, Uttar Pradesh");
const weddingVenue = "रॉयल उत्सव बैंक्वेट, आजमगढ़";
const weddingMap = mapsSearch("Royal Utsav Banquet, Azamgarh");

export const invite = {
  /** Shown on the gate seal before the invitation is opened. */
  monogram: "SR",

  bride: {
    honorific: "आयुष्मती",
    name: "शिवानी",
    fullName: "शिवानी सिंह",
    relation: "सुपुत्री",
    parents: "श्रीमती रागिनी एवं श्री बृजेश कुमार सिंह",
  },
  groom: {
    honorific: "चिरंजीव",
    name: "रितेश",
    fullName: "रितेश सिंह",
    relation: "सुपुत्र",
    parents: "श्रीमती सरिता एवं श्री नीरज सिंह",
  },

  wedding: {
    dayName: "शनिवार",
    day: "21",
    month: "नवंबर",
    year: "2026",
    dateText: "21 नवंबर 2026",
    place: weddingVenue,
    /** Countdown target (IST). */
    start: "2026-11-21T17:00:00+05:30",
  },

  events: [
    {
      id: "haldi",
      title: "हल्दी",
      tint: "#d39a17",
      icon: "haldi",
      dayName: "गुरुवार",
      dateText: "19 नवंबर 2026",
      timeText: "सायं 5:00 बजे से",
      venue: `निवास स्थान, ${homeAddress}`,
      start: "2026-11-19T17:00:00+05:30",
      hours: 3,
      mapUrl: homeMap,
    },
    {
      id: "mehndi-sangeet",
      title: "मेहंदी एवं संगीत",
      tint: "#5f7d2e",
      icon: "mehndi",
      dayName: "शुक्रवार",
      dateText: "20 नवंबर 2026",
      timeText: "सायं 5:00 बजे से",
      venue: `निवास स्थान, ${homeAddress}`,
      start: "2026-11-20T17:00:00+05:30",
      hours: 4,
      mapUrl: homeMap,
    },
    {
      id: "wedding",
      title: "शुभ विवाह",
      tint: "#b0323a",
      icon: "wedding",
      dayName: "शनिवार",
      dateText: "21 नवंबर 2026",
      timeText: "सायं 5:00 बजे से",
      venue: weddingVenue,
      start: "2026-11-21T17:00:00+05:30",
      hours: 6,
      mapUrl: weddingMap,
    },
  ] satisfies InviteEvent[],

  rsvp: {
    /**
     * WhatsApp number that receives RSVPs, with country code and no "+",
     * e.g. "919876543210". Leave empty to let the guest pick a contact.
     */
    whatsappNumber: "",
    deadline: "18 नवंबर 2026",
  },

  /**
   * Background music. It starts when the guest taps the seal (browsers only
   * allow sound after a tap) and loops; the button at the bottom right
   * pauses/resumes it. Put the file in public/audio/. If the file is missing,
   * the button simply doesn't appear.
   */
  music: {
    src: "/audio/music.mp3",
    /**
     * Loop only part of the file, in seconds. 0 and 0 = the whole file, with
     * silence at the edges trimmed and a short crossfade between repeats.
     */
    loopStart: 0,
    loopEnd: 0,
    volume: 0.8,
  },

  /** "प्रेषक" — who is sending the invitation. */
  senders: ["श्रीमती रागिनी एवं श्री बृजेश कुमार सिंह"],
  senderAddress: "रैदोपुर, आजमगढ़ (उ.प्र.)",

  /** Used for the page title and link previews. */
  meta: {
    title: "शिवानी संग रितेश · शुभ विवाह",
    description:
      "शनिवार, 21 नवंबर 2026 · रॉयल उत्सव बैंक्वेट, आजमगढ़। आप सपरिवार सादर आमंत्रित हैं।",
  },
};

export type Invite = typeof invite;
