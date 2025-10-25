import SideBar from "@/components/layout/header/SideBar";
import MainHeader from "@/components/layout/MainHeader";
import { ReactNode } from "react";

export default function sideBar({ children }: { children: ReactNode }) {
  return (
    <div>
      <MainHeader />
      <main>{children} </main>
    </div>
  );
}
