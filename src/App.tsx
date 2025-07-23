import "./App.css";
import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { makeData, type Organization, type User } from "./data/makeData";
import { useState, useMemo } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface OrganizationModalProps {
  selectedOrg: Organization | null;
  onClose: () => void;
}

function VirtualizedUserTable({ users }: { users: User[] }) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm) return users;

    const searchLower = userSearchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower) ||
        user.status.toLowerCase().includes(searchLower)
    );
  }, [users, userSearchTerm]);

  const virtualizer = useVirtualizer({
    count: filteredUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

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
    <div className='border border-gray-200 rounded-lg overflow-hidden'>
      {/* User Search Bar */}
      <div className='p-4 border-b border-gray-200 bg-gray-50'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search users by name, email, role, or status...'
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
            className='w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grape-500 focus:border-grape-500 text-black !outline-none'
          />
          <svg
            className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
        {userSearchTerm && (
          <div className='mt-2 text-sm text-gray-600'>
            Found {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>

      {/* Table Header */}
      <div className='bg-gray-50 grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-200'>
        <div className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
          User
        </div>
        <div className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
          Role
        </div>
        <div className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
          Status
        </div>
        <div className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
          Last Login
        </div>
        <div className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
          Actions
        </div>
      </div>

      {/* Virtualized Table Body */}
      <div ref={parentRef} className='h-80 overflow-auto'>
        {filteredUsers.length === 0 ? (
          <div className='flex items-center justify-center h-full text-gray-500'>
            {userSearchTerm
              ? "No users found matching your search"
              : "No users"}
          </div>
        ) : (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              position: "relative",
            }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const user = filteredUsers[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className='grid grid-cols-5 gap-4 px-4 py-3 hover:bg-gray-50 border-b border-gray-100'>
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className='text-sm text-gray-500'>{user.email}</div>
                  </div>
                  <div>
                    <span className='text-sm capitalize text-gray-900'>
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        user.status
                      )}`}>
                      {user.status}
                    </span>
                  </div>
                  <div>
                    <span className='text-sm text-gray-900'>
                      {user.lastLogin.toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <div className='flex space-x-2'>
                      <button className='text-grape-600 hover:text-grape-700 text-sm font-medium'>
                        Edit
                      </button>
                      <button className='text-red-600 hover:text-red-700 text-sm font-medium'>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function OrganizationModal({ selectedOrg, onClose }: OrganizationModalProps) {
  if (!selectedOrg) return null;

  return (
    <Dialog open={!!selectedOrg} onClose={onClose}>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black/50 z-40' />

      {/* Modal Container */}
      <div className='fixed inset-0 flex items-center justify-center p-4 z-50'>
        <DialogPanel className='bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden'>
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
                  Users ({selectedOrg.users.length})
                </h3>
                <button className='bg-grape-600 hover:bg-grape-700 text-white px-3 py-1.5 rounded text-sm font-medium'>
                  Add User
                </button>
              </div>

              {/* Virtualized Users Table with Search */}
              <VirtualizedUserTable users={selectedOrg.users} />
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
  const [orgSearchTerm, setOrgSearchTerm] = useState("");
  const [data] = useState<Organization[]>(() => makeData(1000));
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const columns = React.useMemo<Array<ColumnDef<Organization>>>(
    () => [
      {
        accessorKey: "companyName",
        header: "Company",
        size: 320,
        cell: (info) => (
          <span className='text-gray-700'>{info.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "adminName",
        header: "Admin",
        size: 300,
        cell: (info) => (
          <span className='text-gray-700'>{info.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "userCount",
        header: "User Count",
        size: 120,
        cell: (info) => (
          <span className='text-gray-700'>{info.getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "invitationsRemaining",
        header: "Invitations Remaining",
        size: 180,
        cell: (info) => (
          <span className='text-gray-700'>{info.getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "plan",
        header: "Plan",
        size: 100,
        cell: (info) => (
          <span className='text-gray-700 capitalize'>
            {info.getValue<string>()}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: orgSearchTerm,
    },
    onGlobalFilterChange: setOrgSearchTerm,
    globalFilterFn: (row, _, value) => {
      const searchValue = value.toLowerCase();
      const org = row.original;

      return (
        org.companyName.toLowerCase().includes(searchValue) ||
        org.adminName.toLowerCase().includes(searchValue) ||
        org.plan.toLowerCase().includes(searchValue) ||
        org.userCount.toString().includes(searchValue) ||
        org.invitationsRemaining.toString().includes(searchValue)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const { rows } = table.getRowModel();
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 20,
  });

  return (
    <>
      <div className='px-6 py-6'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          {/* Organization Search Bar */}
          <div className='p-4 border-b border-gray-200 bg-gray-50'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search organizations by company, admin, plan...'
                value={orgSearchTerm}
                onChange={(e) => setOrgSearchTerm(e.target.value)}
                className='w-full pl-8 pr-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-grape-500 focus:border-grape-500 !outline-none'
              />
              <svg
                className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
            {orgSearchTerm && (
              <div className='mt-2 text-sm text-gray-600'>
                Found {rows.length} of {data.length} organizations
              </div>
            )}
          </div>

          {/* Table Header */}
          <div className='bg-gray-50 border-b border-gray-200'>
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className='flex'>
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
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
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Virtualized Table Body */}
          <div ref={parentRef} className='h-[600px] overflow-auto'>
            {rows.length === 0 ? (
              <div className='flex items-center justify-center h-full text-gray-500'>
                {orgSearchTerm
                  ? "No organizations found matching your search"
                  : "No organizations"}
              </div>
            ) : (
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  position: "relative",
                }}>
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <div
                      key={row.id}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className='flex hover:bg-gray-50 cursor-pointer border-b border-gray-100'
                      onClick={() => {
                        setSelectedOrg(row.original);
                      }}>
                      {row.getVisibleCells().map((cell) => (
                        <div
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className='px-6 py-4 flex items-center'>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-gray-900'>
              OPS Dashboard — Organizations List
            </h1>
          </div>
        </div>
      </div>

      <OrganizationTable />
    </div>
  );
}

export default App;
