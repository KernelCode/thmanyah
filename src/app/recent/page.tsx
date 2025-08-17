import type { Metadata } from "next";
import ClientLastPlays from "./ClientLastPlays";

export const metadata: Metadata = {
  title: "اخر ماتم تشغيلة",
  description: "Browse recently played episodes.",
};

const Page = () => {
  return <ClientLastPlays />;
};

export default Page;
