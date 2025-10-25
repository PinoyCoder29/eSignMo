import SideBar from "@/components/layout/header/SideBar";
import { ReactNode } from "react";

export default function AslLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SideBar/>
      <main className="m-0 p-0">{children}</main>
    </div>
  );
}
