/**
 * REUSABLE PRIMARY BUTTON COMPONENT
 * 
 * Main action button used throughout listing pages
 * 
 * SPECIFICATIONS:
 * - Height: 40px (h-10)
 * - Padding: 28px horizontal (px-7)
 * - Background: primary-600
 * - Hover Background: primary-700
 * - Active Background: primary-800
 * - Text Color: white
 * - Border Radius: 8px (rounded-lg)
 * - Icon Size: 16px × 16px (w-4 h-4)
 * - Gap between icon and text: 8px (gap-2)
 * - Transition: colors (transition-colors)
 * - Font Size: 14px (text-sm)
 * 
 * USAGE:
 * <PrimaryButton icon={Plus} onClick={handleAdd}>Add Lead</PrimaryButton>
 * <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
 */

import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  hideTextOnMobile?: boolean;
}

export function PrimaryButton({ 
  children, 
  icon: Icon, 
  onClick, 
  type = 'button',
  className = '',
  hideTextOnMobile = false 
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-7 h-10 
        bg-primary-600 
        hover:bg-primary-700 
        active:bg-primary-800 
        text-white 
        text-sm 
        rounded-lg 
        transition-colors 
        flex items-center gap-2
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className={hideTextOnMobile ? 'hidden md:inline' : ''}>{children}</span>
    </button>
  );
}