

import { cn } from "@/lib/file-utils";
import { ReactNode } from "react";

export default function GridBackgroundDemo({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[50rem] w-full items-center justify-center bg-background overflow-visible">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      
      <div className="relative z-20 text-center">
        {children}
      </div>
    </div>
  );
}
