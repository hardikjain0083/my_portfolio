import { useEffect, useRef, useState } from "react";
import { Code2, Rocket, Users, Zap } from "lucide-react";

const stats = [
  { icon: Code2, value: "2nd", label: "Year Student" },
  { icon: Rocket, value: "500k+", label: "Participants Beaten (CodeVita)" },
  { icon: Users, value: "2+", label: "Leadership Roles" },
  { icon: Zap, value: "AIML", label: "Specialization" },
];

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="text-primary font-mono text-sm tracking-wider">ABOUT ME</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Turning Ideas Into <span className="gradient-text">Reality</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A passionate developer dedicated to crafting exceptional digital experiences
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - About Text */}
            <div className={`space-y-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm a Second Year B.Tech Computer Science student specializing in AI and Machine Learning at VIT-Bhopal University.
                I have a strong foundation in Python, C, and C++, with a keen interest in building intelligent backend systems.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Currently, I serve as the **Co-Founder of CertiFLEX**, a startup validating educational content, and as the **Treasurer of the Entrepreneurship Cell (E-Cell)** at my university.
                I previously served as a Core Member of the Finance and Sponsorship team at E-Cell.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                My technical journey is marked by achievements like securing a **Global Rank of 5774** in TCS CodeVita Season 12 (Top 1%) and publishing research on AI-driven recruitment.
              </p>

              {/* Highlight Box */}
              <div className="glass p-6 rounded-xl mt-8">
                <p className="text-foreground font-medium">
                  "I believe in the power of AI to solve real-world problems, from educational verification to healthcare accessibility."
                </p>
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className={`grid grid-cols-2 gap-6 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="glass p-8 rounded-2xl hover-lift group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <stat.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
