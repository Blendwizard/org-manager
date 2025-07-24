export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  lastLogin: Date;
  role: "admin" | "standard";
  status: "active" | "inactive" | "pending";
};

export type Organization = {
  id: number;
  companyName: string;
  adminName: string;
  userCount: number;
  invitationsRemaining: number;
  plan: "pro" | "basic" | "enterprise";
  users: User[];
};
