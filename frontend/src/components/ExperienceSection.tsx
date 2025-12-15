import { useRef, useState, useEffect } from "react";
import { Briefcase, Calendar, Building2 } from "lucide-react";

// Define the structure for experiences with potentially multiple roles
type Role = {
    title: string;
    date: string;
    description: string[];
};

type Experience = {
    company: string;
    roles: Role[];
};

const experiences: Experience[] = [
    {
        company: "Entrepreneurship Cell (E-Cell), VIT-Bhopal",
        roles: [
            {
                title: "Treasurer",
                date: "Sep 2025 - Present",
                description: [
                    "Managing financial operations, budget allocation, and funding strategies.",
                    "Leading the financial planning for upcoming events and club activities.",
                ],
            },
            {
                title: "Core Member (Finance & Sponsorship)",
                date: "Sep 2024 - Aug 2025",
                description: [
                    "Facilitated sponsorships and managed financial logistics for events.",
                    "Collaborated with the team to secure funding for club initiatives.",
                ],
            },
        ],
    },
    {
        company: "CertiFLEX",
        roles: [
            {
                title: "Co-Founder",
                date: "Aug 2025 - Present",
                description: [
                    "Building a browser extension to validate educational content consumption on YouTube.",
                    "Implemented features for timestamp verification and random attention checks.",
                    "Pitched startup idea at 'Parichat X Illuminate 2025'.",
                ],
            },
        ],
    },
    {
        company: "Edunet Foundation",
        roles: [
            {
                title: "Virtual Intern (AI)",
                date: "Jun 2025 - Jul 2025",
                description: [
                    "Completed 4-week intensive internship focused on AI pipelines.",
                    "Developed a 'Garbage Classifier' using Transfer Learning as a capstone project.",
                ],
            },
        ],
    },
];

const ExperienceSection = () => {
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
        <section id="experience" ref={sectionRef} className="py-32 relative">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Section Header */}
                    <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <span className="text-primary font-mono text-sm tracking-wider">MY JOURNEY</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                            Professional <span className="gradient-text">Experience</span>
                        </h2>
                    </div>

                    <div className="space-y-12">
                        {experiences.map((exp, companyIndex) => (
                            <div
                                key={companyIndex}
                                className={`glass p-8 rounded-2xl transition-all duration-700 hover-lift ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                                    }`}
                                style={{ transitionDelay: `${companyIndex * 200}ms` }}
                            >
                                <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                                    <Building2 className="w-6 h-6 text-primary" />
                                    <h3 className="text-2xl font-bold text-foreground">{exp.company}</h3>
                                </div>

                                <div className="space-y-8 relative">
                                    {/* Vertical Connector Line if multiple roles */}
                                    {exp.roles.length > 1 && (
                                        <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-border/50" />
                                    )}

                                    {exp.roles.map((role, roleIndex) => (
                                        <div key={roleIndex} className="relative pl-0">
                                            {/* Timeline Dot for multiple roles */}
                                            {exp.roles.length > 1 && (
                                                <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-secondary border-2 border-primary z-10" />
                                            )}

                                            <div className={exp.roles.length > 1 ? "pl-8" : ""}>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                    <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                                                        {exp.roles.length === 1 && <Briefcase className="w-5 h-5 text-primary" />}
                                                        {role.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-muted-foreground text-sm bg-secondary/50 px-3 py-1 rounded-full w-fit">
                                                        <Calendar className="w-4 h-4" />
                                                        {role.date}
                                                    </div>
                                                </div>

                                                <ul className="space-y-2 mt-3 ml-4 list-disc marker:text-primary">
                                                    {role.description.map((item, i) => (
                                                        <li key={i} className="text-muted-foreground">
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
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

export default ExperienceSection;
