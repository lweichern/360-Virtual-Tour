import type { PortfolioItem } from "@/types";

export const portfolioItems: PortfolioItem[] = [
  {
    id: "skyline-residences",
    title: "Skyline Residences",
    location: "Kuala Lumpur, Malaysia",
    category: "residential",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    tourUrl: "https://my.matterport.com/show/?m=SxQL3iGyvMk",
  },
  {
    id: "marina-bay-offices",
    title: "Marina Bay Offices",
    location: "Singapore",
    category: "commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  },
  {
    id: "grand-hyatt-suites",
    title: "Grand Hyatt Suites",
    location: "Penang, Malaysia",
    category: "hospitality",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
  },
  {
    id: "verdant-heights",
    title: "Verdant Heights Show Unit",
    location: "Johor Bahru, Malaysia",
    category: "show-unit",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
  },
  {
    id: "tech-park-hub",
    title: "Tech Park Innovation Hub",
    location: "Cyberjaya, Malaysia",
    category: "commercial",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
  },
  {
    id: "azure-condominiums",
    title: "Azure Condominiums",
    location: "Mont Kiara, KL",
    category: "residential",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
  },
];

export const categories = [
  { label: "All", value: "all" },
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Show Units", value: "show-unit" },
] as const;
