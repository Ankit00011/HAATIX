import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({images}) => {
  const [mainImg, setMainImg] = useState(images[0].url);
  return (
    <div className='flex w-full flex-col-reverse gap-4 sm:flex-row'>
      <div className='flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible'>
        {
        images.map((img, index)=>{
          return <img key={img.url || index} onClick={()=>setMainImg(img.url)} className={`h-20 w-20 shrink-0 cursor-pointer rounded-2xl border object-cover transition hover:scale-105 ${mainImg === img.url ? 'border-slate-950 ring-2 ring-slate-950/10 dark:border-white' : 'border-border'}`} src={img.url} alt="" />
        })
        }
      </div>
      <Zoom>
        <img className='aspect-square w-full rounded-[2rem] border bg-white object-cover shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:bg-card' src={mainImg} alt="" />
      </Zoom>
    </div>
  )
}

export default ProductImg
