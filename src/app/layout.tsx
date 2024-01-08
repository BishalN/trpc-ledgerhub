import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { UserDropDown } from "@/components/user-dropdown";
import { DrawerMenu } from "@/components/drawer-menu";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Ledger Hub",
  description: "Manage your business finances with ease",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <div className="min-h-screen bg-[#464343]">
            <Container>{children}</Container>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto max-w-4xl px-4">{children}</div>;
}

export async function NavBar() {
  // TODO: Use a static sidebar instead of drawer
  return (
    <div className="flex justify-between pt-4">
      <DrawerMenu />
      <UserDropDown />
    </div>
  );
}
