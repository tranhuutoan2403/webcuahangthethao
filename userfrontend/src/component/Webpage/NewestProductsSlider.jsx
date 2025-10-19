import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../CSS/NewestProductsSlider.css";
import { Link } from "react-router-dom";

const NewestProductsSlider = ({ slug }) => {
    const [products, setProducts] = useState([]);
    const sliderRef = useRef(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/category/${slug}/newest`)
            .then(res => res.json())
            .then(data => setProducts(data));
    }, [slug]);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 480, settings: { slidesToShow: 2 } },
        ],
    };

    return (
        <div className="newest-products-container">
            <button
                className="newest-products-nav left"
                onClick={() => sliderRef.current?.slickPrev()}
            >
                ←
            </button>
            <button
                className="newest-products-nav right"
                onClick={() => sliderRef.current?.slickNext()}
            >
                →
            </button>

            <div className="newest-products-slider">
                <Slider ref={sliderRef} {...settings}>
                    {products.map(product => (
                    <div key={product.product_id} className="newest-products-slide">
                        <Link to={`/product/${product.slug}`} className="newest-products-link">
                        <div className="newest-products-card">
                            <img
                            src={`http://localhost:5000/images/${product.image}`}
                            alt={product.name}
                            className="newest-products-image"
                            />
                            <h4>{product.name}</h4>
                            <p>{Number(product.price).toLocaleString('vi-VN')}₫</p>
                        </div>
                        </Link>
                    </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default NewestProductsSlider