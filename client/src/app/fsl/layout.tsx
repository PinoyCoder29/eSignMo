import FslHeader from "@/components/layout/header/FslHeader";
import MainHeader from "@/components/layout/MainHeader";
import { ReactNode } from "react";

export default function AslLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <MainHeader />
      <main>{children}</main>
    </div>
  );
}
