import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'glow';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const variantClass =
    variant === 'glow'
      ? 'glass-card-glow'
      : variant === 'subtle'
      ? 'glass-card-subtle'
      : 'glass-card-default';

  return (
    <div className={`glass-card ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
};
