import React from 'react';

function ShareButton({ product }) {
  const shareProduct = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.fullDescription,
          url: shareUrl,
        })
        .catch(console.error);
    } else {
      // Fallback for unsupported browsers
      alert(`Share this link: ${shareUrl}`);
    }
  };

  return (
    <button className="share-button" onClick={shareProduct}>
      Share Product
    </button>
  );
}

export default ShareButton;
