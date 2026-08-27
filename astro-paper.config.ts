import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://harrylu99.github.io",
    title: "Harry's Blog",
    description: "Almost there...",
    author: "Harry Lu",
    profile: "https://harrylu99.github.io",
    ogImage: "favicon.ico",
    lang: "en",
    timezone: "UTC",
    dir: "ltr",
  },
  posts: {
    perPage: 10,
    perIndex: 10,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [{ name: "github", url: "https://github.com/harrylu99" }],
  shareLinks: [],
});
