import { cn } from "@/lib/file-utils";
import {
  IconLock,
  IconBolt,
  IconFolder,
  IconLink,
  IconDatabase,
  IconLayoutDashboard,
  IconCloudUpload,
  IconMoonStars,
} from "@tabler/icons-react";

export function Features() {
  const features = [
    {
    title: "Secure Uploads",
    description: "Your files are encrypted and stored safely.",
    icon: <IconLock className="h-6 w-6" />,
  },
  {
    title: "Fast Performance",
    description: "Uploads and access with lightning speed.",
    icon: <IconBolt className="h-6 w-6" />,
  },
  {
    title: "Folder Organization",
    description: "Neatly organize files into folders.",
    icon: <IconFolder className="h-6 w-6" />,
  },
  {
    title: "Shareable Links",
    description: "Public and private link support.",
    icon: <IconLink className="h-6 w-6" />,
  },
  {
    title: "Storage Insights",
    description: "Track file size, usage and activity.",
    icon: <IconDatabase className="h-6 w-6" />,
  },
  {
    title: "Simple UI",
    description: "Clean, distraction-free user experience.",
    icon: <IconLayoutDashboard className="h-6 w-6" />,
  },
  {
    title: "Drag & Drop Upload",
    description: "Upload files by simply dropping them.",
    icon: <IconCloudUpload className="h-6 w-6" />,
  },
  {
    title: "Dark Mode Ready",
    description: "Fully responsive with dark/light themes.",
    icon: <IconMoonStars className="h-6 w-6" />,
  },
  ];
  return (
    <section className="bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">Everything You Need to Manage Your Files</h2>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          CloudNest is built with simplicity, performance, and privacy in mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
