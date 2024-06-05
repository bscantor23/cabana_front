import React from "react";

import Image from "../assets/img/house-banner.jpg";

import Search from "../components/Search";

const Banner = () => {
  return (
    <section className="h-full max-h-[640px] mb-8 xl:mb-24 mt-12">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:ml-8 xl:ml-[135px] flex flex-col items-center lg:items-start text-center lg:text-left justify-center flex-1 px-4 lg:px-0">
          <h1 className="text-4xl lg:text-[58px] font-semibold leading-none mb-6">
            <span className="text-pink-700">Cabana</span> ¡Vive la Experiencia!
          </h1>
          <p className="max-w-[480px] mb-8">
            Ofrecemos una amplia variedad de alojamientos, casas o cabañas en
            todos los centros poblados en Colombia, adaptados a todas tus
            necesidades y preferencias.
          </p>
        </div>
        <div className="hidden flex-1 lg:flex justify-end items-end">
          <img
            className="w-full max-h-[50vh] min-h-[50vh] object-cover rounded-tl-[200px]"
            src={Image}
            alt="House Banner"
          />
        </div>
      </div>
      <Search />
    </section>
  );
};

export default Banner;
