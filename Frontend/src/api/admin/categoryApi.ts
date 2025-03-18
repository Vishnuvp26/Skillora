import Axios, { axiosInstance } from "../axios/axiosInstance";

export const fetchCategories = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/categories/get-categories');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to load categories';
    }
};

export const addCategory = async (categoryData: { name: string }) => {
    try {
        const response = await Axios.post('/api/admin/categories/add-category', categoryData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to add category';
    }
};

export const editCategory = async (id: string, categoryData: { name: string }) => {
    try {
        const response = await Axios.put(`/api/admin/categories/edit-category/${id}`, categoryData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to edit category';
    }
};

export const listCategory = async (id: string) => {
    try {
        const response = await Axios.put(`/api/admin/categories/list-category/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to list category';
    }
};

export const unlistCategory = async (id: string) => {
    try {
        const response = await Axios.put(`/api/admin/categories/unlist-category/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to unlist category';
    }
};