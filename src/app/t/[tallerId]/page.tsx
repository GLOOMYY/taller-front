import { redirect } from "next/navigation";
export default async function TallerPage({ params }: PageProps<"/t/[tallerId]">) { const { tallerId } = await params; redirect(`/t/${tallerId}/inicio`); }
