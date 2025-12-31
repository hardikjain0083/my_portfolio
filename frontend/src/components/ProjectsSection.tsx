import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const projects = [
  {
    title: "AutoEmail-RAG",
    description: "Draft replies of the mails by using your previous replies as knowledge base and your companies policy as knowledge base.",
    image: "/autoemail_rag_thumbnail.png",
    tags: ["RAG", "AI", "Email Automation"],
    liveUrl: "https://email-rag-gilt.vercel.app",
    githubUrl: "#",
    featured: true,
  },
  {
    title: "Aarogya Saathi",
    description: "Rural healthcare platform with multilingual chatbot & government scheme checker. (Hackathon Winner)",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    tags: ["React", "AI Chatbot", "Healthcare"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    title: "CertiFLEX (Startup)",
    description: "Browser extension to validate educational content consumption on YouTube with timestamp verification.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    tags: ["Chrome Extension", "Validation Logic", "Startup"],
    liveUrl: "https://thecertiflex.vercel.app/",
    githubUrl: "#",
    featured: true,
  },
  {
    title: "ResumeBERT-HireNet",
    description: "Intelligent recruitment agent parsing resumes using BERT & NLP. Published research paper.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",
    tags: ["BERT", "NLP", "Research"],
    liveUrl: "https://ijirt.org/publishedpaper/IJIRT185215_PAPER.pdf",
    githubUrl: "#",
    featured: true,
  },
  {
    title: "Garbage Classifier",
    description: "Computer vision model identifying 6 waste classes using Transfer Learning.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=600&fit=crop",
    tags: ["Python", "TensorFlow", "Transfer Learning"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
];

const ProjectsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="text-primary font-mono text-sm tracking-wider">MY WORK</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A selection of projects that showcase my skills and passion for building
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={`group glass rounded-2xl overflow-hidden hover-lift transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Project Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                      Featured
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <a
                      href={project.liveUrl}
                      className="p-3 rounded-full bg-foreground/90 text-background hover:scale-110 transition-transform"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <a
                      href={project.githubUrl}
                      className="p-3 rounded-full bg-foreground/90 text-background hover:scale-110 transition-transform"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <Button variant="hero-outline" size="lg" className="group">
              View All Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
