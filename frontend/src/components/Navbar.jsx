import { Menu, ShoppingCart, Store, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'
// import Logo from '../assets/Logo.png';

const Navbar = () => {
  const {user} = useSelector(store=>store.user)
  const {cart} = useSelector(store=>store.product)
  const [menuOpen, setMenuOpen] = useState(false)
  const admin = user?.role === 'admin' ? true : false
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async()=>{
    dispatch(setUser(null))
    localStorage.removeItem("accessToken")
    toast.success("Logged out successfully")
    navigate('/login')
    setMenuOpen(false)
  }
  const navLinks = (
    <>
      <Link onClick={() => setMenuOpen(false)} to={'/'} className='nav-link'>Home</Link>
      <Link onClick={() => setMenuOpen(false)} to={'/products'} className='nav-link'>Products</Link>
      {user && <Link onClick={() => setMenuOpen(false)} to={`/profile/${user._id}`} className='nav-link'>Hi, {user.firstName}</Link>}
      {admin && <Link onClick={() => setMenuOpen(false)} to={`/dashboard/sales`} className='nav-link'>Dashboard</Link>}
    </>
  )
  return (
    <header className='fixed inset-x-0 top-0 z-30 border-b border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-background/85'>
      <div className='container-page flex h-16 items-center justify-between'>
        <Link to='/' onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
          <span className='grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20'>
            <Store className="h-5 w-5" />
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">HAATIX</span>
        </Link>
        <nav className='hidden items-center gap-8 lg:flex'>
          <div className='flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300'>
            {navLinks}
          </div>
          <Link to={'/cart'} className='relative grid h-10 w-10 place-items-center rounded-full border bg-white text-slate-900 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-card dark:text-white'>
            <ShoppingCart className='h-5 w-5'/>
            <span className='absolute -right-1 -top-1 min-w-5 rounded-full bg-pink-600 px-1.5 py-0.5 text-center text-[11px] font-bold text-white'>{cart?.items?.length || 0}</span>
          </Link>
          {user ? (
            <Button onClick={logoutHandler} variant='outline' className='cursor-pointer rounded-full px-5'>Logout</Button>
          ) : (
            <Button onClick={()=>navigate('/login')} className='cursor-pointer rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800'>Login</Button>
          )}
        </nav>
        <div className='flex items-center gap-3 lg:hidden'>
          <Link to={'/cart'} className='relative grid h-10 w-10 place-items-center rounded-full border bg-white dark:bg-card'>
            <ShoppingCart className='h-5 w-5'/>
            <span className='absolute -right-1 -top-1 min-w-5 rounded-full bg-pink-600 px-1.5 py-0.5 text-center text-[11px] font-bold text-white'>{cart?.items?.length || 0}</span>
          </Link>
          <Button variant='outline' size='icon' onClick={() => setMenuOpen(!menuOpen)} aria-label='Toggle navigation'>
            {menuOpen ? <X className='h-5 w-5'/> : <Menu className='h-5 w-5'/>}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <div className='border-t bg-white/95 px-4 py-4 shadow-xl backdrop-blur-xl dark:bg-background/95 lg:hidden'>
          <div className='mx-auto flex max-w-7xl flex-col gap-2 text-base font-semibold text-slate-700 dark:text-slate-200'>
            {navLinks}
            {user ? (
              <Button onClick={logoutHandler} variant='outline' className='mt-2 w-full'>Logout</Button>
            ) : (
              <Button onClick={()=>{navigate('/login'); setMenuOpen(false)}} className='mt-2 w-full bg-slate-950 text-white'>Login</Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
