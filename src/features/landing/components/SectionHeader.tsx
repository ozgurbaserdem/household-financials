interface SectionHeaderProps {
  title: string;
  className?: string;
}

export const SectionHeader = ({
  title,
  className = "",
}: SectionHeaderProps) => {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <h2 className="heading-2 text-gradient-subtle mb-6">{title}</h2>
    </div>
  );
};
