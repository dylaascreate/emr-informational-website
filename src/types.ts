export interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: 'superadmin' | 'marketing' | 'sales';
  avatar?: string;
  token?: string;
}

export interface PackageItem {
  id?: number;
  service_slug: string;
  name: string;
  description: string;
  image: string;
}

export interface ServiceItem {
  id?: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  content?: string;
  image?: string;
  packages?: PackageItem[];
}

export interface TeamMember {
  id?: number;
  member_id?: string;
  role: string;
  name: string;
  image: string;
  bio: string;
  level: number;
}

export interface CertificationItem {
  id?: number;
  code: string;
  title: string;
  body: string;
  icon: string;
  category: string;
}

export interface TestimonialItem {
  id?: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  image: string;
  rating: number;
  vessel_type: string;
}

export interface PartnerItem {
  id?: number;
  name: string;
  logo: string;
}

export interface BranchItem {
  id?: number;
  name: string;
  location: string;
  contact_number: string;
  email: string;
  created_at?: string;
}

export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at?: string;
}

export interface QuotationRequest {
  id?: number;
  name: string;
  email: string;
  company: string;
  vessel_type: string;
  service_required: string;
  details: string;
  status: string;
  created_at?: string;
}