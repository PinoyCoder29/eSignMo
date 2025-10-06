import FslHeader from "@/components/layout/header/FslHeader";
import { ReactNode } from "react";

export default function AslLayout({children}:{children: ReactNode}) {
    return(
        <div>
            <FslHeader/>
            <main>{children}</main>
        </div>
    )
}