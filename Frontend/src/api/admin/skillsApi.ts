import Axios from "../axios/axiosInstance";

export const fetchSkills = async () => {
    try {
        const response = await Axios.get('/api/admin/skills/get-skills');
        return response.data
    } catch (error: any) {
        throw error.response?.data || 'Failed to load skills'
    }
};

export const addSkills = async (skillsData: { name: string }) => {
    try {
        const response = await Axios.post('api/admin/skills/add-skills', skillsData)
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to add category'
    }
};

export const editSkills = async (id: string, skillsData: { name: string }) => {
    try {
        const response = await Axios.put(`/api/admin/skills/edit-skills/${id}`, skillsData);
        return response.data
    } catch (error: any) {
        throw error.response?.data || 'Failed to edit skills'
    }
};

export const listSkills = async (id: string) => {
    try {
        const response = await Axios.put(`/api/admin/skills/list-skills/${id}`);
        return response.data
    } catch (error: any) {
        throw error.response?.data || 'Failed to list skills'
    }
};

export const unlistSkills = async (id: string) => {
    try {
        const response = await Axios.put(`/api/admin/skills/unlist-skills/${id}`)
        return response.data
    } catch (error: any) {
        throw error.response?.data || 'Failed to unlist skills'
    }
};