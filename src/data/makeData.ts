import { faker } from "@faker-js/faker";
import type { User, Organization } from "./types";

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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const makeData = async (
  count: number,
  delayTime = 100
): Promise<Organization[]> => {
  await delay(delayTime);
  return Array.from({ length: count }, (_, i) => newOrganization(i));
};
