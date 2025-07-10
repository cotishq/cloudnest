"use client"


import Link from "next/link";
import { Button } from "../ui/button";

import {motion} from "framer-motion";
import GridBackgroundDemo from "../ui/grid-background-demo";




export function Hero(){
    return (
        <GridBackgroundDemo>
          
            <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl leading-tight md:leading-[1.2] font-bold tracking-tight mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        The Modern Way to Manage Your Files.
        
      </motion.h1>

      <motion.p
        className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
       Upload, organize, and share — all in one beautiful, blazing-fast platform.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex justify-center gap-4 mt-6"
      >
        <Link href="/sign-up">
          <Button size="lg" >Get Started for Free</Button>
        </Link>
        <Link href="#features">
          <Button variant="outline" size="lg">Learn More</Button>
        </Link>
      </motion.div>
            
        </GridBackgroundDemo>
    )
}