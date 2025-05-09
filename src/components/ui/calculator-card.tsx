import { Box } from "@/components/ui/box";

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function CalculatorCard({
  title,
  description,
  icon,
  children,
}: CalculatorCardProps) {
  return (
    <Box className="bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-md p-6">
      <Box className="flex items-center gap-4 mb-4">
        <Box className="p-2 bg-blue-100 rounded-lg">{icon}</Box>
        <Box>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </Box>
      </Box>
      <Box className="space-y-4">{children}</Box>
    </Box>
  );
}
