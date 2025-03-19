export const VALIDATION_MESSAGES = {
    NAME: {
        REQUIRED: "Name is required",
        MIN_LENGTH: "Name must be at least 3 characters",
        INVALID: "Name must contain only letters and spaces"
    },
    EMAIL: {
        REQUIRED: "Email is required",
        INVALID: "Invalid email format"
    },
    PASSWORD: {
        REQUIRED: "Password is required",
        MIN_LENGTH: "Password must be at least 6 characters",
        UPPERCASE: "Password must contain at least one uppercase letter",
        LOWERCASE: "Password must contain at least one lowercase letter",
        NUMBER: "Password must contain at least one number",
        SPECIAL_CHAR: "Password must contain at least one special character"
    },
    CONFIRM_PASSWORD: {
        REQUIRED: "Confirm Password is required",
        MISMATCH: "Passwords do not match"
    },
    ROLE: {
        REQUIRED: "Role is required",
        INVALID: "Invalid role"
    },
    CATEGORY: {
        NAME_REQUIRED: "Category name required",
        INVALID_NAME: "Category name must contain only letters"
    },
    SKILLS: {
        NAME_REQUIRED: "SKill name required",
        INVALID_SKILL: "Skill must contain only letters"
    },
    CITY: {
        REQUIRED: "City is required",
        INVALID: "City can only contain letters"
    },
    STATE: {
        REQUIRED: "State is required",
        INVALID: "State can only contain letters"
    },
    TITLE_REQUIRED: "Title is required",
    CATEGORY_REQUIRED: "Job category is required!",
    SKILL_REQUIRED: "At least one skill is required!",
};