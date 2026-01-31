import React from 'react';

function Gallery({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="gallery">
      {images.map((img, index) => (
        <img key={index} src={img} alt={`Product ${index + 1}`} />
      ))}
    </div>
  );
}

export default Gallery;
