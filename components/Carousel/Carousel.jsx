import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";

// Import Swiper styles

export function Carousel({ children }) {
  return (
    <>
      <Swiper pagination={{ dynamicBullets: true }} modules={[Pagination]}>
        {children.map((elem, i) => (
          <SwiperSlide key={i}>{elem}</SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
