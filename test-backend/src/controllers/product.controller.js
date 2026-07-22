const productModel = require("../models/product.model")

const getProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await productModel.findById(id)
        if (!product) return res.status(404).json({
            success: false,
            message: "product not found"
        })
        return res.status(200).json({
            success: true,
            message: "fatch product detail successfully",
            data: product
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            mesaage: "Internal server error"
        })
    }

}

const createProduct = async (req, res) => {
    try {
        const { name, title, description, price, stock, quality, category } = req.body
        if (!name || !title || !description || !price || !quality || !category) return res.status(400).json({
            success: false,
            message: "all feild are required"
        })
        const createProduct = await productModel.create({
            name, title, description, price, stock, quality, category
        })
        return res.status(201).json({
            success: true,
            message: "product is created",
            data: createProduct
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            mesaage: "Internal server error"
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const {
            name,
            title,
            description,
            price,
            stock,
            quality,
            category
        } = req.body;
        const updateData = {}
        if (name) updateData.name = name
        if (title) updateData.title = title
        if (description) updateData.description = description
        if (price) updateData.price = price
        if (stock) updateData.stock = stock
        if (quality) updateData.quality = quality
        if (category) updateData.category = category

        const updateProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true })

        return res.status(200).json({
            success: true,
            message: "product is updated",
            data: updateProduct
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            mesaage: "Internal server error"
        })
    }
}
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await productModel.findByIdAndDelete(id)
        if (!product) return res.status(404).json({
            success: false,
            message: "product is not found"
        })
        return res.status(200).json({
            success: true,
            message: "product is deleted",
            data: product
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            mesaage: "Internal server error"
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const products = await productModel.find()
        return res.status(200).json({
            success: true,
            message: "fatch all product detail successfully",
            data: products
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            mesaage: "Internal server error"
        })
    }
}

const searchProduct = async (req, res) => {
    try {
        const { product } = req.query
        const search = await productModel.find({
            $or: [
                {
                    name: {
                        $regex: product,
                        $options: "i"
                    }
                },
                {
                    title: {
                        $regex: product,
                        $options: "i"
                    }
                }

            ]
        })
        if (!search) return res.status(404).json({
            success: false,
            message: "product not found"
        })
        return res.status(200).json({
            success: true,
            message: "fatched product detail",
            data:search
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            mesaage: "Internal server error"
        })
    }
}
module.exports = { getProduct, createProduct, updateProduct, deleteProduct, getAllProduct, searchProduct }