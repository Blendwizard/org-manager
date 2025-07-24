import "./App.css";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { VirtualizedUserTable } from "./VirtualizedUserTable";
import type { Organization } from "./data/types";

interface OrganizationModalProps {
  selectedOrg: Organization | null;
  onClose: () => void;
}

export function OrganizationModal({
  selectedOrg,
  onClose,
}: OrganizationModalProps) {
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
                    <label className='block text-sm font-medium text-grape-500 mb-1'>
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
