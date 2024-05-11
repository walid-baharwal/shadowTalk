import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shadow Talk",
  description: "Send Anoymous Messages to Shadow User",
};
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <div>{children}</div>;
}
