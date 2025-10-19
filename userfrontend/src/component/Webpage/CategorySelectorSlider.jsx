import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../CSS/CategorySelectorSlider.css";

const CategorySelectorSlider = ({ selectedSlug, onSelect, categories }) => {
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 480, settings: { slidesToShow: 3 } },
    ],
  };

  return (
    <div className="category-selector-wrapper">
      <Slider {...settings}>
        {categories.map((cat) => (
          <button
            key={cat.category_id}
            className={`category-button ${selectedSlug === cat.slug ? "active" : ""}`}
            onClick={() => onSelect(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </Slider>
    </div>
  );
};

export default CategorySelectorSlider;