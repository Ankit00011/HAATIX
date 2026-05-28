import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const SingleProduct = () => {
    const params = useParams()
    const productId = params.id
    const {products} = useSelector(store=>store.product)
    const product = products.find((item)=>item._id === productId)
    if (!product) {
      return (
        <main className='min-h-screen bg-slate-50 pt-24 dark:bg-background'>
          <div className='container-page grid min-h-[60vh] place-items-center text-center'>
            <div className='soft-panel max-w-lg p-8'>
              <h1 className='text-2xl font-black text-slate-950 dark:text-white'>Product unavailable</h1>
              <p className='mt-2 text-muted-foreground'>This product could not be loaded from the current catalog.</p>
              <Button className='mt-6 rounded-full bg-slate-950 text-white hover:bg-slate-800' asChild>
                <Link to='/products'>Back to products</Link>
              </Button>
            </div>
          </div>
        </main>
      )
    }
      return (
    <main className='min-h-screen bg-slate-50 pb-14 pt-24 dark:bg-background'>
    <div className='container-page'>
      <Breadcrums product={product}/>
      <div className='mt-8 grid items-start gap-10 lg:grid-cols-2'>
        <ProductImg images={product.productImg}/>
        <ProductDesc product={product}/>
      </div>
    </div>
    </main>
  )
}

export default SingleProduct
