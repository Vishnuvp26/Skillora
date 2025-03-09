import { FormData } from "@/types/Types";
import { VALIDATION_MESSAGES } from "@/constants/errorMessages";

export const validateRegistration = (formData: FormData) => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
        errors.name = VALIDATION_MESSAGES.NAME.REQUIRED
    } else if (formData.name.length < 3) {
        errors.name = VALIDATION_MESSAGES.NAME.MIN_LENGTH
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
        errors.name = VALIDATION_MESSAGES.NAME.INVALID
    }

    if (!formData.email.trim()) {
        errors.email = VALIDATION_MESSAGES.EMAIL.REQUIRED
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
        errors.email = VALIDATION_MESSAGES.EMAIL.INVALID
    }

    if (!formData.password) {
        errors.password = VALIDATION_MESSAGES.PASSWORD.REQUIRED
    } else if (formData.password.length < 6) {
        errors.password = VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH
    } else if (!/[A-Z]/.test(formData.password)) {
        errors.password = VALIDATION_MESSAGES.PASSWORD.UPPERCASE
    } else if (!/[a-z]/.test(formData.password)) {
        errors.password = VALIDATION_MESSAGES.PASSWORD.LOWERCASE
    } else if (!/\d/.test(formData.password)) {
        errors.password = VALIDATION_MESSAGES.PASSWORD.NUMBER
    } else if (!/[@$!%*?&]/.test(formData.password)) {
        errors.password = VALIDATION_MESSAGES.PASSWORD.SPECIAL_CHAR
    }

    if (!formData.confirmPassword) {
        errors.confirmPassword = VALIDATION_MESSAGES.CONFIRM_PASSWORD.REQUIRED
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = VALIDATION_MESSAGES.CONFIRM_PASSWORD.MISMATCH
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
};