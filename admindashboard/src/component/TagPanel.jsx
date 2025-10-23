import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../CSS/TagPanel.css"

function TagPanel() {
    const [products, setProducts] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [brand, setBrand] = useState("all");
    const [sort, setSort] = useState("asc");
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const masterCheckboxRef = useRef(null);

    // Fetch tags, categories, brands
    useEffect(() => {
        axios.get("http://localhost:5000/api/tags").then(res => setTags(res.data));
        axios.get("http://localhost:5000/api/category").then(res => setCategories(res.data));
        axios.get("http://localhost:5000/api/brand").then(res => setBrands(res.data));
    }, []);

    // Fetch filtered products
    useEffect(() => {
        const params = { search, category, brand, sort };
        axios.get("http://localhost:5000/api/tags/products", { params })
            .then(res => {
                setProducts(res.data);
                setSelectedProducts([]);
            });
    }, [search, category, brand, sort]);

    // Update master checkbox state
    useEffect(() => {
        if (masterCheckboxRef.current) {
            const total = products.length;
            const selected = selectedProducts.length;

            masterCheckboxRef.current.indeterminate = selected > 0 && selected < total;
            masterCheckboxRef.current.checked = selected === total;
        }
    }, [selectedProducts, products]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCategory("all");
        setBrand("all");
    };

    const toggleProduct = (id) => {
        const updated = selectedProducts.includes(id)
            ? selectedProducts.filter(pid => pid !== id)
            : [...selectedProducts, id];
        setSelectedProducts(updated);
    };

    const toggleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            const allIds = products.map(p => p.product_id);
            setSelectedProducts(allIds);
        }
    };

    const handleAssignTag = () => {
        axios.post("http://localhost:5000/api/tags/assign-multiple", {
            tag_id: selectedTag,
            product_ids: selectedProducts
        }).then(() => alert("Tag assigned successfully"));
    };

    const handleRemoveTag = () => {
        axios.delete("http://localhost:5000/api/tags/remove-multiple", {
            data: {
                tag_id: selectedTag,
                product_ids: selectedProducts
            }
        }).then(() => alert("Tag removed successfully"));
    };

    const getCategoryName = (id) => {
        const match = categories.find(c => c.id === id || c.category_id === id);
        return match?.name || "Unknown";
    };

    const getBrandName = (id) => {
        const match = brands.find(b => b.id === id || b.brand_id === id);
        return match?.name || "Unknown";
    };

    return (
        <div>
            <h2>Tag Management Panel</h2>

            <div>
                <input
                    type="text"
                    placeholder="Search product name..."
                    value={search}
                    onChange={handleSearch}
                />

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                        <option key={c.id || c.category_id} value={c.id || c.category_id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                    <option value="all">All Brands</option>
                    {brands.map(b => (
                        <option key={b.id || b.brand_id} value={b.id || b.brand_id}>
                            {b.name}
                        </option>
                    ))}
                </select>

                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="asc">Name ASC</option>
                    <option value="desc">Name DESC</option>
                </select>
            </div>

            <div>
                <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                    <option value="">-- Select Tag --</option>
                    {tags.map(tag => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                </select>

                <button onClick={handleAssignTag} disabled={!selectedTag || selectedProducts.length === 0}>
                    Assign Tag
                </button>
                <button onClick={handleRemoveTag} disabled={!selectedTag || selectedProducts.length === 0}>
                    Remove Tag
                </button>
            </div>

            <p>Products loaded: {products.length}</p>

            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                ref={masterCheckboxRef}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Brand</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.product_id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.includes(p.product_id)}
                                    onChange={() => toggleProduct(p.product_id)}
                                />
                            </td>
                            <td>{p.name}</td>
                            <td>{getCategoryName(p.category_id)}</td>
                            <td>{getBrandName(p.brand_id)}</td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan="4">No products found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TagPanel;
