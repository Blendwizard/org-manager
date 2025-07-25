# Organization Management

A quick reimagination of the organization management UI. Supports thousands of organizations with thousands of users each with virtualized tables, multi-field search, and sorting.

## Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

## Tech Stack

- **React 19**
- **TypeScript**
- **Faker**
- **TailwindCSS**
- **headlessUI**
- **TanStack-Table**
- **TanStack-Virtual**
- **Vite**

## Approach

I began by researching user/role access management UI/UX patterns as well as examples on [Dribbble](https://dribbble.com/) to try to get some ideas on reorganizing the data to handle scaling concerns and searchability. I also looked at how companies like AWS were handling role management to get a better idea of their implementations at scale.

My primary concern was to handle the situations where an organization might contain a large amount of users by placing user metadata behind its own component, and where we could load it separately on a per-organization basis if necessary. I also wanted to make sure that we could present all of the organization data clearly with the ability to search quickly. I opted to keep the organization table fairly simple, and instead have a row-click functionality that would open a modal containing the organization details, including user information.

Requirements I set for myself:

1. Handle 1000+ organizations each with 1000+ users per organization with sufficient granularity
2. Support fast lookup of organizations and users
3. Separate out organization and user data to avoid over-fetching
4. Present data in a clean, easy-to-follow manner so internal users can minimize any learning curve with the new UI

With this in mind, I quickly initialized a Vite + React application and added a few dependencies I knew I could leverage. The TanStack library (creator of React Query) also has a Table component that support search and sorting out of the box. This library also has a nice solution for handling virtualizing rows that I could use for handling a large amount of rows.

Having never used Headless UI before and with only some Tailwind experience, I consulted my LLM of choice on learning the basics before conjuring some boiler plate code to scaffold out a table. While reading the React Table documentation, I stumbled upon Faker.js for mocking data which ended up working perfectly for creating some mock organizations and users in large quantities quickly.

I primarily focused on functionality over form to get the table working with correct columns before moving on to the modal component where the user table would be found. I knew that search could also be implemented later and opted to focus on getting main UI components built first.

After completing most of the tables and modal, I increased the amount of mock data and began optimizing the table by including virutalized rows so that we only render data within view. I then added search capabilites, a simple table loading state, and began refining the styles to more closely align with the old UI.

Once I was done with all functionality and happy with the styling, I refactored my code into separate files to better organize things.

## Challenges

- Overflowing or misaligned row content can be a pain to deal with when using virtualized lists and in my case I just ended up truncating overflowing content and adding a small tooltip
- Tailwind definitely had a slight learning curve but Intellisense + LLM support makes it fairly easy to find what you need
- Deciding where to put the user data and how to present it posed a challenge; what if the internal user wants to search across all users at one time?

## Questions

- What feature of the UI is most commonly used and needs to accessible/easy to find?
- What are the pain points of the UI that might slow down an internal user trying to accomplish their task?
- What issues have been encountered when scaling to more organiztions/users?
- Is there a use case for being able to search across all users regardless of organization?
- Is the current UX intuitive enough for users to find the information they need?
