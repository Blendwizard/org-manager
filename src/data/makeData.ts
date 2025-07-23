import { faker } from "@faker-js/faker";

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

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newUser = (index: number): User => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = `${lastName}${firstName}@email.com`;
  return {
    id: index + 1,
    firstName,
    lastName,
    createdAt: faker.date.recent({ days: 365 }),
    lastLogin: faker.date.recent({ days: 365 }),
    email,
    role: faker.helpers.shuffle(["admin", "standard"])[0],
    status: faker.helpers.shuffle(["active", "inactive", "pending"])[0],
  };
};

const newOrganization = (index: number): Organization => {
  const userCount = faker.number.int(1000);
  return {
    id: index + 1,
    companyName: faker.company.name(),
    adminName: faker.person.fullName(),
    userCount,
    invitationsRemaining: faker.number.int(200),
    plan: faker.helpers.shuffle(["pro", "basic", "enterprise"])[0],
    users: range(userCount).map((u) => ({ ...newUser(u) })),
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Organization[] => {
    const len = lens[depth]!;
    return range(len).map((d): Organization => {
      return {
        ...newOrganization(d),
      };
    });
  };

  return makeDataLevel();
}
