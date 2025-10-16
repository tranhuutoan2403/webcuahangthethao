import React, { useState } from 'react';
import '../CSS/productfilter.css';

const ProductFilter = ({ onSortChange, sortOption }) => {
    const [activeFilter, setActiveFilter] = useState(sortOption || '');

    const filters = [
        { label: 'Nổi bật', value: 'banchay' },
        { label: 'Bán chạy', value: 'banchay' },
        { label: 'Giảm giá', value: 'giamgia' },
        { label: 'Mới', value: 'moi' },
        { label: 'Giá cao - thấp', value: 'gia-cao-thap' },
        { label: 'Giá thấp - cao', value: 'gia-thap-cao' }
    ];

    const handleClick = (value) => {
        setActiveFilter(value);
        onSortChange(value);
    };

    return (
        <div className="product-filter">
            <div className="filter-label">Sắp xếp theo:</div>
            <div className="filter-buttons">
                {filters.map(f => (
                    <button
                        key={f.value + f.label}
                        className={`filter-btn ${activeFilter === f.value ? 'active' : ''}`}
                        onClick={() => handleClick(f.value)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductFilter;
