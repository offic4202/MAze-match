export type UserRole = 'member' | 'manager' | 'studio_owner' | 'admin' | 'super_admin';

export type IdType = 'nin' | 'bvn' | 'passport' | 'drivers_license';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  profileId?: string;
  isVerified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  phone: string;
  idType: IdType;
  idNumber: string;
  lga: string;
  location: string;
  state: string;
  occupation: string;
  education: string;
  bio: string;
  photos: string[];
  interests: string[];
  lookingFor: 'marriage' | 'dating' | 'networking';
  isVerified: boolean;
  verifiedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
}

export type EventType = 'charity' | 'dating' | 'social';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  state: string;
  capacity: number;
  attendees: string[];
  createdBy: string;
  createdAt: Date;
}

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: ConnectionStatus;
  createdAt: Date;
}

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
] as const;

export const INTERESTS = [
  'Travel', 'Music', 'Art', 'Fitness', 'Cooking', 'Reading', 'Photography',
  'Fashion', 'Sports', 'Movies', 'Technology', 'Business', 'Spirituality',
  'Volunteering', 'Nature', 'Dance', 'Writing', 'Pets', 'Wine & Dining'
] as const;

export const ID_TYPES = [
  { value: 'nin', label: 'National ID (NIN)' },
  { value: 'bvn', label: 'Bank Verification (BVN)' },
  { value: 'passport', label: 'International Passport' },
  { value: 'drivers_license', label: "Driver's License" }
] as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  member: 'Member',
  manager: 'Event Manager',
  studio_owner: 'Studio Owner',
  admin: 'Admin',
  super_admin: 'Super Admin'
};