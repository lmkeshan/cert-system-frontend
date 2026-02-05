import { Outlet } from 'react-router-dom'
import StudentHeader from '../components/StudentHeader'

export default function StudentLayout() {
 return (
 <div className="">
 <StudentHeader />
 <main className="">
 {/* Header */}
 <Outlet />
 </main>
 </div>
 )
}
