import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function StudentLayout() {
 return (
 <div className="">
 <Navbar />
 <Sidebar items={[]} title="Student" />
 <main className="">
 {/* Header */}
 <Outlet />
 </main>
 </div>
 )
}
