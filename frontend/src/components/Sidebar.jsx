import { LayoutDashboard, ListOrderedIcon, PackagePlus, PackageSearch, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='hidden fixed md:flex border-r border-orange-100 bg-white/85 backdrop-blur-xl left-0 w-[300px] p-8 flex-col gap-6 h-screen shadow-[20px_0_60px_rgba(251,113,133,0.08)]'>
      <div className='px-3 pt-20'>
        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-rose-400'>Admin space</p>
        <h2 className='mt-3 text-3xl font-bold text-slate-900'>Haatix Control</h2>
        <p className='mt-2 text-sm text-slate-500'>Manage catalog, customers, orders, and live business performance.</p>
      </div>
      <div className='space-y-2 px-3'>
        <NavLink to="/dashboard/sales" className={({isActive})=> `text-[15px] ${isActive ? "bg-slate-950 text-white shadow-lg shadow-rose-200/60" :"text-slate-700 hover:bg-rose-50"} flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`}>
        <LayoutDashboard className='size-5'/><span>Dashboard</span></NavLink>

        <NavLink to="/dashboard/add-product" className={({isActive})=> `text-[15px] ${isActive ? "bg-slate-950 text-white shadow-lg shadow-rose-200/60" :"text-slate-700 hover:bg-rose-50"} flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`}>
        <PackagePlus className='size-5'/><span>Add Product</span></NavLink>

        <NavLink to="/dashboard/products" className={({isActive})=> `text-[15px] ${isActive ? "bg-slate-950 text-white shadow-lg shadow-rose-200/60" :"text-slate-700 hover:bg-rose-50"} flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`}>
        <PackageSearch className='size-5'/><span>Products</span></NavLink>

        <NavLink to="/dashboard/users" className={({isActive})=> `text-[15px] ${isActive ? "bg-slate-950 text-white shadow-lg shadow-rose-200/60" :"text-slate-700 hover:bg-rose-50"} flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`}>
        <Users className='size-5'/><span>Users</span></NavLink>

        <NavLink to="/dashboard/orders" className={({isActive})=> `text-[15px] ${isActive ? "bg-slate-950 text-white shadow-lg shadow-rose-200/60" :"text-slate-700 hover:bg-rose-50"} flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`}>
        <ListOrderedIcon className='size-5'/><span>Orders</span></NavLink>
      </div>
      <div className='mt-auto rounded-3xl border border-rose-100 bg-[linear-gradient(135deg,#fff1f2_0%,#ffedd5_100%)] p-5 text-sm text-slate-700'>
        <p className='font-semibold text-slate-900'>Today&apos;s focus</p>
        <p className='mt-2 leading-6'>Keep an eye on payment failures and fast-moving products so the storefront stays healthy.</p>
      </div>
    </div>
  )
}

export default Sidebar
