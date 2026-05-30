export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  story: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  category: string;
  status: 'ACTIVE' | 'DRAFT' | 'COMPLETED' | 'PAUSED' | 'SUSPENDED';
  coverImage: string | null; // computed from images[0] — not a DB field
  images: string[];
  beneficiaryName: string;
  beneficiaryInfo: string | null;
  deadline: string | null;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator?: Pick<UserProfile, 'id' | 'name' | 'avatar'>;
  creatorName?: string;
  creatorAvatar?: string;
}