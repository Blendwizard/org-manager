import "./App.css";
import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

export type Organization = {
  id: number;
  companyName: string;
  adminName: string;
  userCount: number;
  invitationsRemaining: number;
  plan: "pro" | "basic" | "enterprise";
};

function OrganizationTable() {
  const columns = React.useMemo<Array<ColumnDef<Organization>>>(
    () => [
      {
        accessorKey: "companyName",
        header: "Company",
        size: 280,
        cell: (info) => (
          <div className='flex flex-col'>{info.getValue<string>()}</div>
        ),
      },
      {
        id: "manageSubscription",
        header: "",
        size: 180,
        cell: () => (
          <button className='bg-grape-600 text-white px-4 py-2 rounded font-medium text-sm'>
            MANAGE SUBSCRIPTION
          </button>
        ),
      },
      {
        accessorKey: "adminName",
        header: "Admin",
        size: 250,
        cell: (info) => (
          <span className='text-gray-700'>{info.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "userCount",
        header: "User Count",
        size: 100,
        cell: (info) => (
          <span className='text-gray-700'>{info.getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "invitationsRemaining",
        header: "Invitations Remaining",
        size: 140,
        cell: (info) => (
          <span className='text-gray-700'>{info.getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "plan",
        header: "Plan",
        size: 80,
        cell: (info) => (
          <span className='text-gray-700 capitalize'>
            {info.getValue<string>()}
          </span>
        ),
      },
    ],
    []
  );

  const [data] = React.useState<Organization[]>(() => [
    {
      id: 1,
      companyName: "Company Name",
      adminName: "Last Name, First Name <email@integrate.co>",
      userCount: 1,
      invitationsRemaining: 100,
      plan: "pro",
    },
    {
      id: 2,
      companyName: "Company Name",
      adminName: "Last Name, First Name <email@integrate.co>",
      userCount: 1,
      invitationsRemaining: 100,
      plan: "basic",
    },
    {
      id: 3,
      companyName: "Company Name",
      adminName: "Last Name, First Name <email@integrate.co>",
      userCount: 1,
      invitationsRemaining: 100,
      plan: "basic",
    },
    {
      id: 4,
      companyName: "Company Name",
      adminName: "Last Name, First Name <email@integrate.co>",
      userCount: 1,
      invitationsRemaining: 100,
      plan: "basic",
    },
    {
      id: 5,
      companyName: "Company Name",
      adminName: "Last Name, First Name <email@integrate.co>",
      userCount: 1,
      invitationsRemaining: 100,
      plan: "basic",
    },
    {
      id: 6,
      companyName: "Company Name",
      adminName: "Last Name, First Name <email@integrate.co>",
      userCount: 1,
      invitationsRemaining: 100,
      plan: "basic",
    },
    {
      id: 7,
      companyName: "Company Name",
      adminName: "Last Name, First Name <email@integrate.co>",
      userCount: 1,
      invitationsRemaining: 100,
      plan: "basic",
    },
    {
      id: 8,
      companyName: "Company Name",
      adminName: "Last Name, First Name <email@integrate.co>",
      userCount: 1,
      invitationsRemaining: 100,
      plan: "basic",
    },
    {
      id: 9,
      companyName: "Company Name",
      adminName: "Last Name, First Name <email@integrate.co>",
      userCount: 1,
      invitationsRemaining: 100,
      plan: "basic",
    },
    {
      id: 10,
      companyName: "Company Name",
      adminName: "Last Name, First Name <email@integrate.co>",
      userCount: 1,
      invitationsRemaining: 100,
      plan: "basic",
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className='px-6 py-6'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ width: header.getSize() }}
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        {header.isPlaceholder ? null : (
                          <div
                            className={`
                              ${
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none hover:text-gray-700"
                                  : ""
                              }
                            `}
                            onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " ↑",
                              desc: " ↓",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {table.getRowModel().rows.map((row) => {
                return (
                  <React.Fragment key={row.id}>
                    <tr className='hover:bg-gray-50'>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            key={cell.id}
                            className='px-6 py-4 whitespace-nowrap'>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <OrganizationTable />
    </>
  );
}

export default App;
