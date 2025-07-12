"use client";

import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import {
  IconHome,
  IconUser,
  IconSettings,
  
} from "@tabler/icons-react";

export const LandingFloatingNav = () => {
  const navItems = [
    {
      name: "Home",
      link: "#home",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "#about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Features",
      link: "#features",
      icon: <IconSettings className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    
  ];

  return <FloatingNav navItems={navItems} />;
};
