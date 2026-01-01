import { Metadata } from "next";
import { getYachtById } from "@/lib/yachts";

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const yacht = getYachtById(id);

  if (!yacht) {
    return {
      title: "Yacht Not Found",
    };
  }

  const priceStr = yacht.price 
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: yacht.price_currency, maximumFractionDigits: 0 }).format(yacht.price) 
    : "Price on Request";
  const title = yacht.name + " - " + yacht.length_m + "m " + yacht.yacht_type_detail;
  const description = yacht.year_built + " " + yacht.builder + " " + yacht.yacht_type_detail + ". " + yacht.cabins + " cabins, " + yacht.berths + " berths. Located in " + yacht.location + ", Japan. " + priceStr;

  return {
    title,
    description,
    openGraph: {
      title: yacht.name + " | Avisail Yachts",
      description,
      type: "website",
      url: "https://avisail-yachts.vercel.app/yachts/" + yacht.id,
      images: [
        {
          url: yacht.thumbnail,
          width: 1200,
          height: 630,
          alt: yacht.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: yacht.name + " | Avisail Yachts",
      description,
      images: [yacht.thumbnail],
    },
  };
}

export default function YachtLayout({ children }: Props) {
  return <>{children}</>;
}
