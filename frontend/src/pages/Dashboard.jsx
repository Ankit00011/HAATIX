import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#fff1f2_45%,#ffffff_100%)]'>
      <Sidebar/>
      <div className='min-h-screen flex-1 md:pl-[300px]'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Dashboard
