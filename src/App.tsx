import "./App.css";
import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { makeData, type Organization, type User } from "./data/makeData";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface OrganizationModalProps {
  selectedOrg: Organization | null;
  onClose: () => void;
}

function OrganizationModal({ selectedOrg, onClose }: OrganizationModalProps) {
  if (!selectedOrg) return null;

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "inactive":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Dialog open={!!selectedOrg} onClose={onClose}>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black/50 z-40' />

      {/* Modal Container */}
      <div className='fixed inset-0 flex items-center justify-center p-4 z-50'>
        <DialogPanel className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden'>
          {/* Header */}
          <div className='px-6 py-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <DialogTitle className='text-xl font-semibold text-gray-900'>
                Manage Organization
              </DialogTitle>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600 transition-colors'>
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
            {/* Organization Details */}
            <div className='mb-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Organization Details
              </h3>
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                      Company Name
                    </label>
                    <p className='text-gray-900 font-medium'>
                      {selectedOrg.companyName}
                    </p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                      Plan
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        selectedOrg.plan === "pro"
                          ? "bg-purple-100 text-purple-800"
                          : selectedOrg.plan === "enterprise"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {selectedOrg.plan}
                    </span>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                      Primary Admin
                    </label>
                    <p className='text-gray-900'>{selectedOrg.adminName}</p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                      User Count
                    </label>
                    <p className='text-gray-900'>
                      {selectedOrg.userCount} users
                    </p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                      Invitations Remaining
                    </label>
                    <p className='text-gray-900'>
                      {selectedOrg.invitationsRemaining}
                    </p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                      Organization ID
                    </label>
                    <p className='text-gray-600 text-sm'>#{selectedOrg.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Section */}
            <div>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Users ({selectedOrg.userCount})
                </h3>
                <button className='bg-grape-600 hover:bg-grape-700 text-white px-3 py-1.5 rounded text-sm font-medium'>
                  Add User
                </button>
              </div>

              {/* Users Table Container */}
              <div className='border border-gray-200 rounded-lg overflow-hidden'>
                <div className='max-h-80 overflow-y-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50 sticky top-0'>
                      <tr>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          User
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Role
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Status
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Last Login
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {selectedOrg.users.map((user) => (
                        <tr key={user.id} className='hover:bg-gray-50'>
                          <td className='px-4 py-3'>
                            <div>
                              <div className='text-sm font-medium text-gray-900'>
                                {user.firstName}
                              </div>
                              <div className='text-sm text-gray-500'>
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className='px-4 py-3'>
                            <span className='text-sm text-gray-900'>
                              {user.role}
                            </span>
                          </td>
                          <td className='px-4 py-3'>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                user.status
                              )}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className='px-4 py-3'>
                            <span className='text-sm text-gray-900'>
                              {user.lastLogin.toString()}
                            </span>
                          </td>
                          <td className='px-4 py-3'>
                            <div className='flex space-x-2'>
                              <button className='text-grape-600 hover:text-grape-700 text-sm font-medium'>
                                Edit
                              </button>
                              <button className='text-red-600 hover:text-red-700 text-sm font-medium'>
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='px-6 py-4 border-t border-gray-200 bg-gray-50'>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'>
                Cancel
              </button>
              <button className='px-4 py-2 text-sm font-medium text-white bg-grape-600 rounded-md hover:bg-grape-700'>
                Save Changes
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function OrganizationTable() {
  const columns = React.useMemo<Array<ColumnDef<Organization>>>(
    () => [
      {
        accessorKey: "companyName",
        header: "Company",
        size: 280,
        cell: (info) => (
          <span className='text-gray-700'>{info.getValue<string>()}</span>
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

  const [data] = useState<Organization[]>(() => makeData(10));

  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

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
                    <tr
                      className='hover:bg-gray-50 cursor-pointer'
                      onClick={() => {
                        console.log(row);
                        setSelectedOrg(row.original);
                      }}>
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
      <OrganizationModal
        selectedOrg={selectedOrg}
        onClose={() => setSelectedOrg(null)}
      />
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
