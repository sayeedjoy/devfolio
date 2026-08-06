import type { Personal } from "./types"

export const personal: Personal = {
  intro: "Outside work: photos, music, and tinkering.",
  // `title` is drawn over the photo in the slider; `caption` credits the gear
  // once, under the row. The slider repeats short lists to fill a wide screen,
  // so more photos here means less visible repetition.
  photos: [
    {
      src: "/photos/i1.webp",
      title: "Team Threatless with Cool Mentors",
      caption: "Shot with Samsung Galaxy S25 Ultra",
    },
    {
      src: "/photos/i2.webp",
      title: "SEU Boys at The Infinity AI BuildFest",
      caption: "Shot with Samsung Galaxy S25 Ultra",
    },
    {
      src: "/photos/i3.webp",
      title: "Team Threatless",
      caption: "Shot with Samsung Galaxy S25 Ultra",
    },
    {
      src: "/photos/impact-dhaka-hackathon-6a74f11c8b697.webp",
      title: "Krypton at Impact Dhaka Hackathon",
      caption: "Shot with Samsung Galaxy S25 Ultra",
    },
    {
      src: "/photos/iut-techathon.webp",
      title: "2RJSxThreatless at IUT Techathon",
      caption: "Shot with Samsung Galaxy S25 Ultra",
    },
    {
      src: "/photos/vitaminsea-6a74f11baa093.webp",
      title: "Vitamin Sea",
      caption: "Shot with Samsung Galaxy S25 Ultra",
    }
  ],
  instagram: "https://instagram.com/sayeedjoy",
}
