import React, { useEffect } from 'react'
import user from '../assets/user.png'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'
import { api, getAuthConfig } from '@/lib/api'

const Cart = () => {
  const {cart} = useSelector(store=>store.product)
  
  const subtotal = cart?.totalPrice
  const shipping = subtotal > 299 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loadCart = async ()=>{
    try {
      const res = await api.get('/cart', getAuthConfig())
      if(res.data.success){
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateQuantity = async (productId,type)=>{
    try {
      const res = await api.put('/cart/update',{
        productId,
        type
      }, getAuthConfig())
      if(res.data.success){
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveItem = async (productId)=>{
    try {
      const authConfig = getAuthConfig()
      const res = await api.delete('/cart/remove',{
        ...authConfig,
        headers: {
          ...authConfig.headers,
        },
        data: {productId}
      })
      if(res.data.success){
        dispatch(setCart(res.data.cart))
        toast.success("Item removed from cart")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    loadCart()
  },[dispatch])

  return (
    <div className='pt-20 bg-gray-50 min-h-screen'>
      {
        cart?.items?.length > 0 ? 
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-2xl font-bold text-gray-800 mb-7'>Shopping Cart</h1>
          <div className='max-w-7xl mx-auto flex gap-7'>
            <div className='flex flex-col gap-5 flex-1'>
              {
                cart?.items?.map((product,index)=>(
                   <Card key={index}>
                    <div className='flex justify-between items-center pr-7'>
                      <div className='flex items-center w-[350px]'>
                        <img src={product?.productId?.productImg?.[0]?.url || user} alt="" className='w-24 h-24 rounded-lg object-cover'/>
                        <div className='w-[280px]'>
                          <h1 className='font-semibold truncate'>{product?.productId?.productName}</h1>
                          <p>₹{product?.productId?.productPrice}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-5'>
                        <Button onClick={()=>handleUpdateQuantity(product.productId._id,"decrease")} variant='outline'>-</Button>
                        <span>{product.quantity}</span>
                        <Button onClick={()=>handleUpdateQuantity(product.productId._id,"increase")} variant='outline'>+</Button>
                      </div>
                      <p>₹{(product?.productId?.productPrice ) * (product.quantity)}</p>
                      <p onClick={()=>handleRemoveItem(product.productId._id)} className=' flex cursor-pointer text-red-500 items-center gap-1'><Trash2 className='w-4 h-4'/>Remove</p>
                    </div>
                     </Card>
                ))
              }
            </div>
            <div>
              <Card className='w-[400px]'>
                 <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                 </CardHeader>
                 <CardContent className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>₹{cart?.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Tax(18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between border-t pt-2'>
                    <span className='font-semibold'>Total</span>
                    <span className='font-semibold'>₹{total.toFixed(2)}</span>
                  </div>
                  <div className='space-y-3 pt-4'>
                    <div className='flex space-x-2'>
                      <Input placeholder='Enter coupon code'></Input>
                      <Button variant='outline'>Apply</Button>
                    </div>
                    <Button onClick={()=>navigate('/address')} className='bg-pink-600 text-white w-full'>Proceed to Checkout</Button>
                    <Button variant='outline' className="w-full bg-transparent">
                      <Link to='/products'>Continue Shopping</Link>
                    </Button>
                    </div>
                    <div className='text-sm text-muted-foreground pt-4'>
                      <p>* Free shipping on orders over ₹299</p>
                      <p>* Returns and exchanges available</p>
                      <p>* Secure checkout with multiple payment options</p>
                    </div>
                 </CardContent>
              </Card>
            </div>
            </div>
        </div> : <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>
          {/* icon */}
          <div className='bg-pink-100 p-6 rounded-full'>
            <ShoppingCart className='w-16 h-16 text-pink-600'/>
          </div>
          {/* title */}
          <h2 className='text-2xl font-bold text-gray-800 mt-6'>Your cart is empty</h2>
          <p className='text-gray-600 mt-2'>Looks like you haven't added anything to your cart yet.</p>
          <Button variant='outline' className="mt-6 bg-transparent">
            <Link to='/products'>Start Shopping</Link>
          </Button>
        </div>
      }
    </div>
  )
}

export default Cart
