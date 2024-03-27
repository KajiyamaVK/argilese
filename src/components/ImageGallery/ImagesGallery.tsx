'use client'

import Image from 'next/image'
import { useState } from 'react'

export function ImagesGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0])
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-2 justify-end ">
      <div className="flex lg:flex-col gap-2 justify-start ">
        {images.map((image, index) => (
          <button key={index} onClick={() => setSelectedImage(image)}>
            <Image src={image} alt="product" className="object-cover" width={100} height={100} />
          </button>
        ))}
      </div>
      <Image src={selectedImage} alt="product" width={400} height={400} className=" object-cover" />
    </div>
  )
}
