import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(400).send({
                success:false,
                message:"Name is required"
            })
        }
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category already exists"
            })
        }
        const category = await new categoryModel({name, slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:"new category created",
            category,
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success:false,
            error,
            message:"Internal server error"
        })
    }
}


export const updateCategory = async (req, res) => {
    try {
        const category = await categoryModel.findByIdAndUpdate(id,{name , slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:"Category updated",
            category,
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while updating category"
        }) 
    }
};

export const getCategories = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"Categories fetched",
            category,
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while fetching categories"
        })
    }
};


export const singleCategory = async (req, res) => {
    try {
        
        const category = await categoryModel.findOne({slug:req.params});
        res.status(200).send({
            success:true,
            message:"Get single category successfully ",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while getting Single Category"
        })
    }
}

export const deleteCategory = async(req,res) => {
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Category deleted"
            
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while deleting category"
        })
    }
};