import { useRef, useState, useEffect } from "react";
import { Award, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";

const certificates = [
    {
        title: "Applied Machine Learning in Python",
        issuer: "University of Michigan (Coursera)",
        date: "Dec 2025",
        type: "Course Certification",
        link: "https://www.coursera.org/account/accomplishments/verify/R9L8Z0J5POUA",
        description: "Applied machine learning techniques using Python (scikit-learn).",
    },
    {
        title: "Prepare Data for ML APIs on Google Cloud",
        issuer: "Google Cloud",
        date: "Dec 2025",
        type: "Skill Badge",
        link: "https://www.credly.com/badges/fd9ea153-c656-4038-b855-ff9a39e0a804/linked_in_profile",
        description: "Validated ability to build data processing pipelines using Google Cloud tools including Dataprep, Dataflow, Dataproc, and BigQuery.",
    },
    {
        title: "Programming With Generative AI",
        issuer: "NPTEL (IISc Bangalore)",
        date: "Nov 2025",
        type: "Course Certification",
        link: "#", // No link provided for NPTEL, keeping generic
        description: "Comprehensive course on leveraging LLMs, Prompt Engineering, RAG applications, and AI tool efficiency.",
    },
    {
        title: "Python for Data Science, AI & Development",
        issuer: "Coursera (IBM)",
        date: "Oct 2024",
        type: "Course Certification",
        credentialId: "HJ9U7P0UJTVM",
        link: "https://www.coursera.org/account/accomplishments/verify/HJ9U7P0UJTVM",
        description: "Foundational training in Data Science ecosystem (Pandas, NumPy, Web Scraping) and API interaction.",
    },
];

const CertificatesSection = () => {
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
        <section id="certificates" ref={sectionRef} className="py-32 relative bg-secondary/20">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <span className="text-primary font-mono text-sm tracking-wider">ACHIEVEMENTS</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                            Certifications & <span className="gradient-text">Badges</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certificates.map((cert, index) => (
                            <div
                                key={index}
                                className={`glass p-6 rounded-2xl transition-all duration-700 hover-lift group flex flex-col h-full ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                                    }`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                                        <Award className="w-8 h-8 text-primary" />
                                    </div>
                                    {cert.link !== "#" && (
                                        <a
                                            href={cert.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {cert.title}
                                </h3>

                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-4">
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                        {cert.issuer}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {cert.date}
                                    </span>
                                </div>

                                <p className="text-muted-foreground text-sm flex-grow mb-4">
                                    {cert.description}
                                </p>

                                {cert.credentialId && (
                                    <div className="mt-auto pt-4 border-t border-border/50">
                                        <p className="text-xs text-muted-foreground font-mono">
                                            ID: {cert.credentialId}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CertificatesSection;
