import type { Metadata } from "next";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/seo/site";

const BIO = `As a Birth and VBAC certified doula, my greatest joy is providing compassionate support to every mother I have the honor of serving. My approach is rooted in inclusivity and a deep commitment to providing the physical, emotional, and educational guidance you need. I believe in empowering you through knowledge, from foundational childbirth education to hands-on patient advocacy, so you can feel confident and prepared for labor and delivery. This work is not transactional for me; it is a heartfelt dedication to walking alongside you on this incredible path. I give each of my clients my full heart, and my greatest goal is to help you find your most peaceful and empowered birth.`;

export const metadata: Metadata = buildPageMetadata({
  title: "About Your Doula",
  description:
    "Meet the doula behind The Missing Peace and learn about the calm, informed, and deeply supportive approach offered to Kansas City families.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <section
      className="w-full flex justify-center items-center min-h-[60vh] py-16 px-4 bg-[#f7f3ef]"
      aria-label="About section"
    >
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center md:items-stretch gap-12 md:gap-16">
        {/* Left: Bio */}
        <div className="flex-1 flex flex-col justify-center md:justify-start max-w-xl mx-auto md:mx-0">
          <h1 className="text-3xl font-semibold mb-6 text-[#7d5c3c] tracking-tight text-center md:text-left">About</h1>
          <p className="text-lg leading-relaxed text-[#3d2c1e]" style={{maxWidth: '40ch'}}>{BIO}</p>
        </div>
        {/* Right: Portrait */}
        <div className="flex-1 flex justify-center items-start md:items-center">
          <div className="w-64 h-80 md:w-72 md:h-[27rem] rounded-[2rem] overflow-hidden shadow-[0_20px_55px_rgba(109,75,54,0.14)] bg-[#e9e3db] flex items-center justify-center border border-[#e2d5c7]">
            <Image
              src="/headshot3.webp"
              alt="Portrait of Meagan"
              width={424}
              height={568}
              sizes="(min-width: 768px) 288px, 256px"
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
