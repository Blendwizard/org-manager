import "./App.css";
import { OrganizationTable } from "./OrganizationTable";

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
