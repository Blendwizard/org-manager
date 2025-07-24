import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { makeData } from "./data/makeData";
import { OrganizationModal } from "./OrganizationModal";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Organization } from "./data/types";

export function OrganizationTable() {
  const [orgSearchTerm, setOrgSearchTerm] = useState("");
  const [data, setData] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await makeData(1000, 1000);
        setData(result);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const columns = React.useMemo<Array<ColumnDef<Organization>>>(
    () => [
      {
        accessorKey: "companyName",
        header: "Company",
        size: 320,
        cell: (info) => (
          <span
            title={`${info.getValue<string>()}`}
            className='text-grape-600 items-start truncate'>
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "adminName",
        header: "Admin",
        size: 300,
        cell: (info) => (
          <span
            title={`${info.getValue<string>()}`}
            className='text-gray-700 truncate'>
            {info.getValue<string>()}
          </span>
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
        size: 160,

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

  if (loading) {
    return (
      <div className='px-6 py-6'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          {/* Search Bar - Disabled State */}
          <div className='p-4 border-b border-gray-200 bg-gray-50'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search organizations by company, admin, plan...'
                disabled
                className='w-full pl-8 pr-4 py-2 border border-gray-300 text-gray-400 rounded-lg bg-gray-100 cursor-not-allowed'
              />
              <svg
                className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-300'
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
          </div>

          {/* Table Header - Skeleton */}
          <div className='bg-gray-50 border-b border-gray-200'>
            <div className='flex'>
              {[320, 300, 120, 180, 100].map((width, index) => (
                <div
                  key={index}
                  style={{ width }}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                  <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                </div>
              ))}
            </div>
          </div>

          {/* Loading Overlay */}
          <div className='h-[600px] relative bg-gray-50/50'>
            {/* Loading Spinner and Text */}
            <div className='absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm'>
              <div className='text-center'>
                {/* Loading Text */}
                <div className='text-lg font-medium text-gray-700 mb-2'>
                  Loading Organizations
                </div>
                <div className='text-sm text-gray-500'>
                  Fetching data, please wait...
                </div>

                {/* Progress Dots */}
                <div className='flex justify-center space-x-1 mt-4'>
                  <div className='w-2 h-2 bg-grape-600 rounded-full animate-bounce'></div>
                  <div
                    className='w-2 h-2 bg-grape-600 rounded-full animate-bounce'
                    style={{ animationDelay: "0.1s" }}></div>
                  <div
                    className='w-2 h-2 bg-grape-600 rounded-full animate-bounce'
                    style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
