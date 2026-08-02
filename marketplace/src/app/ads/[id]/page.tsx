import { AdCard } from "@/app/components/ad-card";
import { OptimisticTitleEditor } from "@/app/components/optimistic-title-editor";
import { parseAdId } from "@/lib/ad-query";
import { getAdById } from "@/lib/ads";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const adId = parseAdId(id);

  if (adId === null) {
    notFound();
  }

  const adDetail = await getAdById(adId);

  if (!adDetail) {
    notFound();
  }

  return {
    title: adDetail.title,
    description: adDetail.description,
  };
}

export default async function AdDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const adId = parseAdId(id);
  const query = await searchParams;

  if (
    process.env.NODE_ENV === "development" &&
    query.demoError === "1"
  ) {
    throw new Error("Controlled ad detail failure");
  }

  if (adId === null) {
    notFound();
  }

  const adDetail = await getAdById(adId);

  if (!adDetail) {
    notFound();
  }

  return (
    <section className="grid gap-6">
      <OptimisticTitleEditor
        confirmedTitle={adDetail.title}
        labMode={process.env.NODE_ENV === "development"}
        adId={adDetail.id}
      />
      <AdCard hideTitle ad={adDetail} />
    </section>
  );
}
