declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }

  export type Icon = FC<IconProps>;
  
  // Icons for your Sidebar and Dashboard
  export const LayoutDashboard: Icon;
  export const Briefcase: Icon;
  export const Users: Icon;
  export const MessageSquare: Icon;
  export const UserCircle: Icon;
  export const LogOut: Icon;
  export const Search: Icon;
  export const FileText: Icon;
  
  // Icons for UI States and Decorations
  export const Sparkles: Icon;
  export const Star: Icon;
  export const Loader2: Icon;
  export const ArrowLeft: Icon;
  export const Send: Icon;
  export const Award: Icon;
  export const User: Icon;
  export const Mail: Icon;
  export const CheckCircle2: Icon;
  export const Eye: Icon;
  export const X: Icon;
  export const ExternalLink: Icon;
  export const Lock: Icon;
  export const Phone: Icon;
  export const MapPin: Icon;
  export const GraduationCap: Icon;
  export const History: Icon;
  export const AlertCircle: Icon;
  export const Clock: Icon;
}