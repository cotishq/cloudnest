
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LiveDemoSection = () => {
  return (
    <section
      id="demo"
      className="w-full py-20 px-6 md:px-10 bg-muted/30 dark:bg-muted/10 border-t border-border"
    >
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Experience CloudNest in Action
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          See how easy it is to upload, organize, and share files. Try the full experience with no sign-up required.
        </p>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <Link href="/demo">
            <Button className="text-base">Try Live Demo</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" className="text-base">
              Explore Features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
