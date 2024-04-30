'use client'

import Image from 'next/image'
import { useState } from 'react'

export function ImagesGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0])
  return (
    <div className="flex flex-col-reverse justify-end gap-2 lg:flex-row ">
      <div className="flex justify-start gap-2 lg:flex-col ">
        {images.map((image, index) => (
          <button key={index} onClick={() => setSelectedImage(image)}>
            <Image src={image} alt="product" className="object-cover" width={100} height={100} />
          </button>
        ))}
      </div>
      <Image src={selectedImage} alt="product" width={400} height={400} className=" object-cover" priority />
    </div>
  )
}
