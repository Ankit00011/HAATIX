import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({images}) => {
  const [mainImg, setMainImg] = useState(images[0].url);
  return (
    <div className='flex gap-5 w-max'>
      <div className='flex flex-col gap-5'>
        {
        images.map((img)=>{
          return <img onClick={()=>setMainImg(img.url)} className='w-20 h-20 border shadow-lg cursor-pointer ' src={img.url} alt="" />
        })
        }
      </div>
      <Zoom>
        <img className='w-[500px] h-[500px] object-cover border shadow-lg' src={mainImg} alt="" />
      </Zoom>
    </div>
  )
}

export default ProductImg
