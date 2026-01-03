import { useState } from 'react';

interface AgencyAvatarProps {
  /** Image URL (can be broken or undefined) */
  imageUrl?: string;
  /** Agency name/title for alt text and fallback initial */
  name: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeClasses = {
  sm: 'h-10 w-10 text-lg',
  md: 'h-14 w-14 text-xl',
  lg: 'h-20 w-20 text-2xl',
};

/**
 * Agency avatar component with broken image fallback.
 * Shows the first letter of the agency name when image fails to load.
 */
export default function AgencyAvatar({
  imageUrl,
  name,
  size = 'md',
  className = '',
}: AgencyAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const sizeClass = sizeClasses[size];
  const initial = name.charAt(0).toUpperCase();

  // Show fallback if no image URL or if image failed to load
  const showFallback = !imageUrl || imageError;

  if (showFallback) {
    return (
      <div
        className={`${sizeClass} bg-gradient-to-br from-th-navy-100 to-th-navy-200 rounded-full flex items-center justify-center group-hover:from-th-navy-200 group-hover:to-th-navy-300 transition-colors ${className}`}
      >
        <span className="text-th-navy-600 font-bold">{initial}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className={`${sizeClass} object-contain ${className}`}
      onError={() => setImageError(true)}
    />
  );
}
