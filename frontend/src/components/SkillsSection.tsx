import { useEffect, useRef, useState } from "react";

const skillCategories = [
  {
    title: "Languages",
    skills: [
      { name: "Python", level: 95 },
      { name: "C++", level: 90 },
      { name: "C", level: 85 },
      { name: "SQL", level: 85 },
    ],
  },
  {
    title: "Backend & Databases",
    skills: [
      { name: "MongoDB", level: 85 },
      { name: "PostgreSQL", level: 85 },
      { name: "System Design", level: 80 },
      { name: "API Design", level: 90 },
    ],
  },
  {
    title: "AI & Machine Learning",
    skills: [
      { name: "TensorFlow/PyTorch", level: 85 },
      { name: "RAG Systems", level: 90 },
      { name: "NLP (BERT/LLMs)", level: 90 },
      { name: "Computer Vision", level: 80 },
    ],
  },
  {
    title: "Tools & Cloud",
    skills: [
      { name: "Git/GitHub", level: 95 },
      { name: "Docker", level: 85 },
      { name: "Google Cloud (GCP)", level: 80 },
      { name: "VS Code", level: 95 },
    ],
  },
];

const SkillsSection = () => {
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
    <section id="skills" ref={sectionRef} className="py-32 relative bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="text-primary font-mono text-sm tracking-wider">MY EXPERTISE</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Skills & <span className="gradient-text">Technologies</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A comprehensive toolkit built through years of hands-on experience
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, catIndex) => (
              <div
                key={category.title}
                className={`glass p-8 rounded-2xl transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                style={{ transitionDelay: `${catIndex * 150}ms` }}
              >
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  {category.title}
                </h3>

                <div className="space-y-5">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-foreground font-medium">{skill.name}</span>
                        <span className="text-muted-foreground text-sm">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: isVisible ? `${skill.level}%` : "0%",
                            background: "var(--gradient-primary)",
                            transitionDelay: `${catIndex * 150 + skillIndex * 100}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
