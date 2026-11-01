import React from "react";

export default function PhotoGallery({ photos = [] }) {
  if (!Array.isArray(photos) || photos.length === 0) return null;
  return (
    <section className="photo-gallery-section" id="gallery">
      <div className="photo-gallery-inner">
        <p className="section-subtitle">A FEW MOMENTS TO CHERISH</p>
        <h2 className="section-title">Our Memories</h2>
        <div className="photo-gallery-grid">
          {photos.map((url, index) => (
            <a href={url} target="_blank" rel="noreferrer" key={`${url}-${index}`} className="photo-gallery-item">
              <img src={url} alt={`Wedding memory ${index + 1}`} loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
