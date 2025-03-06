    import Axios from "./axiosInstance";

export const fetchCategories = async () => {
    try {
        const response = await Axios.get('/admin/get-categories');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to load categories';
    }
};

export const addCategory = async (categoryData: { name: string }) => {
    try {
        const response = await Axios.post('/admin/add-category', categoryData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to add category';
    }
};

export const editCategory = async (id: string, categoryData: { name: string }) => {
    try {
        const response = await Axios.put(`/admin/edit-category/${id}`, categoryData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to edit category';
    }
};

export const listCategory = async (id: string) => {
    try {
        const response = await Axios.put(`/admin/list-category/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to list category';
    }
};

export const unlistCategory = async (id: string) => {
    try {
        const response = await Axios.put(`/admin/unlist-category/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to unlist category';
    }
};