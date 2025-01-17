import { Route, Routes, Navigate } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";


import StudentTable from "./pages/ProductsPage"
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";

function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />
			<Routes>
			
				<Route path='/' element={<StudentTable />} />
				<Route path='/present' element={<UsersPage />} />
				<Route path='/absent' element={<SalesPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			
			</Routes>
		</div>
	);
}

export default App;
