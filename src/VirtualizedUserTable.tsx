import "./App.css";
import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useState, useMemo } from "react";
import type { User } from "./data/types";

export function VirtualizedUserTable({ users }: { users: User[] }) {
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
      <div className='bg-gray-50 grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-200 '>
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
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className='grid grid-cols-5 gap-4 px-4 py-3 hover:bg-gray-50 border-b border-gray-100'>
                  <div>
                    <div
                      title={`${user.firstName} ${user.lastName}`}
                      className='text-sm font-medium truncate text-gray-900'>
                      {user.firstName} {user.lastName}
                    </div>
                    <div
                      title={`${user.email}`}
                      className='text-sm truncate text-gray-500'>
                      {user.email}
                    </div>
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
