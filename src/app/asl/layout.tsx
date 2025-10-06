import AslHeader from "@/components/layout/header/AslHeader";
import { ReactNode } from "react";

export default function AslLayout({children}:{children: ReactNode}) {
    return(
        <div>
            <AslHeader/>
            <main>{children}</main>
        </div>
    )
}