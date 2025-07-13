
"use client";

export const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="w-full py-20 px-6 md:px-10 bg-muted/30 dark:bg-muted/10 border-t border-border"
    >
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Trusted by Developers & Creators
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Real feedback from people who’ve used CloudNest in their workflow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-background border border-border p-6 rounded-xl shadow-sm text-left">
            <p className="text-sm text-muted-foreground italic">
              “CloudNest has made organizing and sharing files incredibly simple. The UI is super clean and fast.”
            </p>
            <p className="mt-4 font-semibold">— Aarya S., Freelance Designer</p>
          </div>

          <div className="bg-background border border-border p-6 rounded-xl shadow-sm text-left">
            <p className="text-sm text-muted-foreground italic">
              “I replaced Google Drive for my dev team with CloudNest. It’s faster, focused, and privacy-friendly.”
            </p>
            <p className="mt-4 font-semibold">— Dev K., Indie Hacker</p>
          </div>
        </div>
      </div>
    </section>
  );
};
