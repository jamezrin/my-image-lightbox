/** @jsx jsx */
/* @jsxFrag React.Fragment */
import { Global, css, jsx } from '@emotion/core';
import React from 'react';

export default function ImageLightbox() {
  const [visible, setVisible] = React.useState(false);
  const [currentImageElement, setCurrentImageElement] = React.useState(null);

  const lightboxWrapperRef = React.useRef();
  const lightboxRef = React.useRef();

  const openLightbox = (target) => {
    setCurrentImageElement(target);
    setVisible(true);
  };

  const closeLightbox = () => {
    setVisible(false);
    setCurrentImageElement(null);
  };

  const imageElementClickHandler = React.useCallback((e) => openLightbox(e.target), []);

  const lightboxWrapperClickHandler = React.useCallback((e) => {
    // this event is triggered for children too
    // this ensures the lightbox is closed when the parent is clicked, not the children
    if (e.target === lightboxWrapperRef.current) closeLightbox();
  }, []);

  React.useEffect(() => {
    const lightboxWrapperElement = lightboxWrapperRef.current;

    const lightboxImageElements = document.getElementsByClassName('lightbox-image');

    for (const imageElement of lightboxImageElements) {
      imageElement.addEventListener('click', imageElementClickHandler);
    }

    // close the lightbox when the user clicks outside the lightbox
    lightboxWrapperElement.addEventListener('click', lightboxWrapperClickHandler);

    // remove event handlers on unmount
    return () => {
      lightboxWrapperElement.removeEventHandler(lightboxWrapperClickHandler);

      for (const imageElement of lightboxImageElements) {
        imageElement.removeEventHandler(imageElementClickHandler);
      }
    };
  }, [imageElementClickHandler, lightboxWrapperClickHandler]);

  return (
    <>
      <Global
        styles={css`
          .lightbox-image {
            cursor: pointer;
          }
        `}
      />

      <div
        css={css`
          display: ${visible ? 'block' : 'none'};
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          &:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            opacity: 0.7;
            background: #000;
          }
        `}
        ref={lightboxWrapperRef}
      >
        <div
          css={css`
            display: block;
            position: absolute;
            top: 2rem;
            right: 2rem;
            bottom: 2rem;
            left: 2rem;
            background: #000;
          `}
          ref={lightboxRef}
        >
          <button
            onClick={() => closeLightbox()}
            css={css`
              position: absolute;
              top: 0;
              right: 0;
              color: #fff;
              width: 4rem;
              height: 4rem;
              font-size: 4rem;
              background: #000;
              border: 0;
              cursor: pointer;
            `}
          >
            &times;
          </button>
          <div
            css={css`
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            {currentImageElement && (
              <img
                src={currentImageElement.src}
                alt={currentImageElement.alt}
                css={css`
                  max-width: 100%;
                  max-height: 100%;
                  pointer-events: none;
                  user-select: none;
                `}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
