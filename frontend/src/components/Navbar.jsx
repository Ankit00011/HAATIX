import { ShoppingCart, Store } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'
// import Logo from '../assets/Logo.png';

const Navbar = () => {
  const {user} = useSelector(store=>store.user)
  const {cart} = useSelector(store=>store.product)
  const admin = user?.role === 'admin' ? true : false
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async()=>{
    dispatch(setUser(null))
    localStorage.removeItem("accessToken")
    toast.success("Logged out successfully")
    navigate('/login')
  }
  return (
    <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200'>
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3'>
        {/* logo section */}
        <div className="flex items-center gap-2">
          <Store className="w-8 h-8 text-pink-600" />
          <span className="text-2xl font-bold bg-gradient-to-tl from-blue-600 to-purple-600 bg-clip-text text-transparent">HAATIX</span>
          {/* <img src={Logo} alt="Logo" className='w-[50px] h-auto'/> */}
        </div>
        {/* nav section */}
        <nav className='flex gap-10 justify-between items-center'>
          <ul className='flex gap-7 items-center text-xl font-semibold'>
            <Link to={'/'}><li>Home</li></Link>
            <Link to={'/products'}><li>Products</li></Link>
            {
              user && <Link to={`/profile/${user._id}`}><li>Hello, {user.firstName}</li></Link>
            }
            {
              admin && <Link to={`/dashboard/sales`}><li>Dashboard</li></Link>
            }
          </ul>
          <Link to={'/cart'} className='relative'>
          <ShoppingCart/>
          <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2'>{cart?.items?.length || 0}</span></Link>
          {
            user ? <Button onClick={logoutHandler} className='bg-pink-600 text-white cursor-pointer'>Logout</Button>:<Button onClick={()=>navigate('/login')}
            className='bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer'>Login</Button>
          }
        </nav>
      </div>
    </header>
  )
}

export default Navbar
