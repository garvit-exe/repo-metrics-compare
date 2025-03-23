
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  description,
  className,
  children,
}) => {
  return (
    <Card className={cn("glass-card overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
