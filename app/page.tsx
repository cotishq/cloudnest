import { Features } from "@/components/landing/Feature";
import Footer from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { LandingFloatingNav } from "@/components/LandingFloating";
import { LiveDemoSection } from "@/components/LiveDemoSection";
import { TestimonialsSection } from "@/components/Testemonials";
import { ModeToggle } from "@/components/ThemeToggle";




export default function Home() {
  return (

    <>
    <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-background/80 backdrop-blur-md border-b border-border">
    <ModeToggle />
    

    </div>
    <LandingFloatingNav />
    

    <section id="home">
      <Hero />
    </section>
    
      

      <section id="features">
        <Features />
      </section>
      
      <section id="about">
        <LiveDemoSection />
      <TestimonialsSection />
      </section>
    
    <Footer />

    
    </>

    
      
  );
}
