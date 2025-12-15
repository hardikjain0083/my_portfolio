import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactSection = () => {
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



  const contactInfo = [
    { icon: Mail, label: "Email", value: "hardikjain0083@gmail.com", href: "mailto:hardikjain0083@gmail.com" },
    { icon: Phone, label: "Phone", value: "+91 9680500881", href: "tel:+919680500881" },
    { icon: MapPin, label: "Location", value: "Bhiwadi, Rajasthan", href: "#" },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-32 relative bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="text-primary font-mono text-sm tracking-wider">GET IN TOUCH</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Let's Work <span className="gradient-text">Together</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Have a project in mind? I'd love to hear about it. Let's create something amazing together.
            </p>
          </div>

          <div className={`grid md:grid-cols-2 gap-8 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {/* Contact Info */}
            <div className="glass p-8 rounded-2xl h-full flex flex-col justify-center">
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-foreground font-medium group-hover:text-primary transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* AI Chatbot Promo */}
            <div className="glass p-8 rounded-2xl h-full flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-4">Prefer a quick chat?</h3>
              <p className="text-muted-foreground mb-4">
                Use the AI chatbot in the corner to ask me anything about my experience,
                skills, or availability. It's trained on my portfolio and can answer
                your questions instantly!
              </p>
              <div className="flex items-center gap-2 text-primary mt-auto">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium">AI Assistant is online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
