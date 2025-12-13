import { useEffect, useRef, useState } from "react";
import { Code2, Rocket, Users, Zap } from "lucide-react";

const stats = [
  { icon: Code2, value: "5+", label: "Years Experience" },
  { icon: Rocket, value: "50+", label: "Projects Completed" },
  { icon: Users, value: "30+", label: "Happy Clients" },
  { icon: Zap, value: "99%", label: "Success Rate" },
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
                I'm a full-stack developer with a passion for creating beautiful, 
                functional, and user-centered digital experiences. With over 5 years 
                of experience in the field, I'm always looking for new and innovative 
                ways to bring my clients' visions to life.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I specialize in building modern web applications using cutting-edge 
                technologies like React, TypeScript, Node.js, and AI/ML tools. 
                My approach combines clean code practices with creative problem-solving 
                to deliver solutions that exceed expectations.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When I'm not coding, you can find me exploring new technologies, 
                contributing to open-source projects, or sharing knowledge with the 
                developer community.
              </p>

              {/* Highlight Box */}
              <div className="glass p-6 rounded-xl mt-8">
                <p className="text-foreground font-medium">
                  "I believe great software is born from the intersection of technical 
                  excellence and genuine understanding of user needs."
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
