import TitlePage from "@/components/ask/title-page";

export default async function Title({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;

  return <TitlePage title={title} />;
}
