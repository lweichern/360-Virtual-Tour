import type { Metadata } from "next";
import ShowcaseHero from "@/components/sections/showcase/ShowcaseHero";
import ShowcaseViewer from "@/components/sections/showcase/ShowcaseViewer";

export const metadata: Metadata = {
  title: "3D Showcase",
  description:
    "Experience cinematic 3D transitions between rooms in our interactive virtual walkthrough demo. Explore a condo unit from a dollhouse overview or dive into individual rooms.",
};

export default function ShowcasePage() {
  return (
    <>
      <ShowcaseHero />
      <ShowcaseViewer />
    </>
  );
}
