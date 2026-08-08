export type Page = 'home' | 'about' | 'departments' | 'doctors' | 'booking' | 'my-bookings' | 'contact' | 'admin';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  image: string;
  availableDays: string[];
  availableSlots: string[];
  bio: string;
  languages: string[];
  consultationFee: number;
  roomNo: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  education: string[];
  isHeadOfDepartment?: boolean;
}

export interface Department {
  id: string;
  name: string;
  category: 'Critical Care' | 'Surgical' | 'Medicine' | 'Diagnostics' | 'Women & Child';
  icon: string;
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  heroImage: string;
  location: string;
  phone: string;
  headDoctorId: string;
  headDoctorName: string;
  keyServices: string[];
  conditionsTreated: string[];
  techEquipments: string[];
  doctorCount: number;
  avgWaitTimeMinutes: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  createdAt?: string;
}

export interface Appointment {
  id: string;
  userId?: string;
  bookingReference: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  isFirstVisit: boolean;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  date: string;
  timeSlot: string;
  reason: string;
  consultationFee: number;
  roomNo: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'In Consultation' | 'No Show';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  age: number;
  procedure: string;
  departmentName: string;
  doctorName: string;
  content: string;
  rating: number;
  date: string;
  patientImage?: string;
}

export interface Facility {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  highlights: string[];
}

export interface HealthTip {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  authorName: string;
  authorRole: string;
  summary: string;
  image: string;
}
