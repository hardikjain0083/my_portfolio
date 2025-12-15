import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float animation-delay-200" style={{ animationDelay: "2s" }} />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Available for work</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 opacity-0 animate-fade-up animation-delay-100" style={{ animationFillMode: "forwards" }}>
            Hi, I'm{" "}
            <span className="gradient-text">Hardik Jain</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 opacity-0 animate-fade-up animation-delay-200" style={{ animationFillMode: "forwards" }}>
            AI Engineer & Backend Developer
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10 opacity-0 animate-fade-up animation-delay-300" style={{ animationFillMode: "forwards" }}>
            B.Tech CSE (AIML) Student at VIT-Bhopal.
            Passionate about AI/ML, C/C++, and building scalable backend systems.
            TCS CodeVita AIR 5774 (Global Rank).
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 opacity-0 animate-fade-up animation-delay-400" style={{ animationFillMode: "forwards" }}>
            <Button variant="hero" size="lg" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
              View My Work
            </Button>
            <Button variant="hero-outline" size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              Get In Touch
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 opacity-0 animate-fade-up animation-delay-500" style={{ animationFillMode: "forwards" }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full glass hover:bg-secondary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full glass hover:bg-secondary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:hardikjain0083@gmail.com"
              className="p-3 rounded-full glass hover:bg-secondary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animation-delay-600" style={{ animationFillMode: "forwards" }}>
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-sm">Scroll to explore</span>
            <ArrowDown className="w-5 h-5 animate-bounce-subtle" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
