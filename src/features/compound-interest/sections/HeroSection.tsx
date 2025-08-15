import React from "react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
}) => (
  <section aria-labelledby="hero-title">
    <header className="text-center space-y-6 py-8">
      <h1 className="heading-1 text-foreground" id="hero-title">
        {title}
      </h1>
      <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </header>
  </section>
);
