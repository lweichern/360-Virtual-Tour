import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "virtual-tours",
    title: "360 Virtual Tours",
    description:
      "Full interactive walkthrough tours with hotspots, info tags, and measurement tools. Let buyers explore every corner of your property from anywhere.",
    icon: "View",
    features: [
      "Interactive hotspots & info tags",
      "Measurement tools",
      "Dollhouse & floor plan views",
      "Embeddable on any website",
      "Mobile & VR compatible",
    ],
  },
  {
    id: "photography",
    title: "360 Photography",
    description:
      "High-resolution panoramic stills captured with professional-grade 360 cameras. Perfect for listings, brochures, and marketing materials.",
    icon: "Camera",
    features: [
      "Ultra-high resolution capture",
      "Professional color grading",
      "HDR processing",
      "Multiple format delivery",
      "Cloud-hosted galleries",
    ],
  },
  {
    id: "drone",
    title: "Drone Aerial Photography",
    description:
      "Stunning aerial shots that showcase the full scope of your property, surrounding neighbourhood, and site overview from above.",
    icon: "Plane",
    features: [
      "4K aerial photography",
      "Neighbourhood overview shots",
      "Site progress documentation",
      "Cinematic video footage",
      "Licensed drone operators",
    ],
  },
  {
    id: "floor-plans",
    title: "Floor Plan Generation",
    description:
      "Accurate 2D and 3D floor plans extracted from scan data. Give buyers a clear spatial understanding of every room and level.",
    icon: "LayoutDashboard",
    features: [
      "2D schematic floor plans",
      "3D interactive floor plans",
      "Accurate measurements",
      "Furniture layout options",
      "Multiple file formats",
    ],
  },
  {
    id: "video",
    title: "Video Walkthroughs",
    description:
      "Narrated or music-backed video tours optimized for social media, YouTube, and property listing platforms.",
    icon: "Video",
    features: [
      "Professional narration options",
      "Music-backed walkthroughs",
      "Social media optimized formats",
      "Branded intros & outros",
      "4K video quality",
    ],
  },
  {
    id: "staging",
    title: "Virtual Staging",
    description:
      "Digitally furnish empty rooms to show their full potential. Help buyers visualise the lifestyle your property offers.",
    icon: "Sofa",
    features: [
      "Photorealistic furniture placement",
      "Multiple style options",
      "Before & after comparisons",
      "Quick turnaround",
      "Cost-effective vs physical staging",
    ],
  },
];
