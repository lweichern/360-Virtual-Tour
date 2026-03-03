export const COMPANY = {
  name: "ImmersiveSpace",
  tagline: "360 Virtual Tours for Real Estate",
  email: "hello@immersivespace.com",
  phone: "+60 12-345 6789",
  address: "Level 15, Menara XYZ, Kuala Lumpur, Malaysia",
  socials: {
    instagram: "https://instagram.com/immersivespace",
    linkedin: "https://linkedin.com/company/immersivespace",
    facebook: "https://facebook.com/immersivespace",
    youtube: "https://youtube.com/@immersivespace",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Viewer", href: "/viewer" },
  // { label: "Showcase", href: "/showcase" },
  { label: "Contact", href: "/contact" },
] as const;
