const db = require('../db'); // Adjust this to your actual DB connection or ORM
const TagControllers = {
    // Create a new tag
    async createTag(req, res) {
        const { name } = req.body;
        try {
            const [tag] = await db('tags').insert({ name }).returning('*');
            res.status(201).json(tag);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create tag', details: err });
        }
    },

    // Get all tags
    async getAllTags(req, res) {
        try {
            const tags = await db('tags').select('*');
            res.status(200).json(tags);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch tags', details: err });
        }
    },

    // Get a single tag by ID
    async getTagById(req, res) {
        const { id } = req.params;
        try {
            const tag = await db('tags').where({ id }).first();
            if (!tag) return res.status(404).json({ error: 'Tag not found' });
            res.status(200).json(tag);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch tag', details: err });
        }
    },

    // Update a tag
    async updateTag(req, res) {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const updated = await db('tags').where({ id }).update({ name }).returning('*');
            if (!updated.length) return res.status(404).json({ error: 'Tag not found' });
            res.status(200).json(updated[0]);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update tag', details: err });
        }
    },

    // Delete a tag
    async deleteTag(req, res) {
        const { id } = req.params;
        try {
            const deleted = await db('tags').where({ id }).del();
            if (!deleted) return res.status(404).json({ error: 'Tag not found' });
            res.status(200).json({ message: 'Tag deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete tag', details: err });
        }
    },

    // Assign a tag to a product
    async assignTagToProduct(req, res) {
        const { product_id, tag_id } = req.body;
        try {
            await db('product_tags').insert({ product_id, tag_id });
            res.status(201).json({ message: 'Tag assigned to product' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to assign tag', details: err });
        }
    },

    // Remove a tag from a product
    async removeTagFromProduct(req, res) {
        const { product_id, tag_id } = req.body;
        try {
            await db('product_tags').where({ product_id, tag_id }).del();
            res.status(200).json({ message: 'Tag removed from product' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to remove tag', details: err });
        }
    },

    // Get all tags for a product
    async getTagsForProduct(req, res) {
        const { productId } = req.params;
        try {
            const tags = await db('product_tags')
                .join('tags', 'product_tags.tag_id', 'tags.id')
                .where('product_tags.product_id', productId)
                .select('tags.id', 'tags.name');
            res.status(200).json(tags);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch tags for product', details: err });
        }
    },

    // Get all products with a specific tag
    async getProductsByTag(req, res) {
        const { tagId } = req.params;
        try {
            const products = await db('product_tags')
                .join('products', 'product_tags.product_id', 'products.product_id')
                .where('product_tags.tag_id', tagId)
                .select('products.product_id', 'products.name');
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch products for tag', details: err });
        }
    },

    // Assign a tag to multiple products
    async assignTagToMultipleProducts(req, res) {
        const { tag_id, product_ids } = req.body;
        try {
            const inserts = product_ids.map(product_id => ({ product_id, tag_id }));
            await db('product_tags').insert(inserts);
            res.status(201).json({ message: 'Tag assigned to multiple products' });
        } catch (err) {
            res.status(500).json({ error: 'Bulk assignment failed', details: err });
        }
    },

    // Assign a tag to all products in a category
    async assignTagByCategory(req, res) {
        const { tag_id, category_id } = req.body;
        try {
            const products = await db('products').where({ category_id }).select('product_id');
            const inserts = products.map(p => ({ product_id: p.product_id, tag_id }));
            await db('product_tags').insert(inserts);
            res.status(201).json({ message: 'Tag assigned to category products' });
        } catch (err) {
            res.status(500).json({ error: 'Category assignment failed', details: err });
        }
    },

    // Assign a tag to all products from a brand
    async assignTagByBrand(req, res) {
        const { tag_id, brand_id } = req.body;
        try {
            const products = await db('products').where({ brand_id }).select('product_id');
            const inserts = products.map(p => ({ product_id: p.product_id, tag_id }));
            await db('product_tags').insert(inserts);
            res.status(201).json({ message: 'Tag assigned to brand products' });
        } catch (err) {
            res.status(500).json({ error: 'Brand assignment failed', details: err });
        }
    }
};

module.exports = TagControllers;