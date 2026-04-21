export type UserRole = 'member' | 'manager' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  profileId?: string;
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  state: string;
  occupation: string;
  education: string;
  bio: string;
  photos: string[];
  interests: string[];
  lookingFor: 'marriage' | 'dating' | 'networking';
  verified: boolean;
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