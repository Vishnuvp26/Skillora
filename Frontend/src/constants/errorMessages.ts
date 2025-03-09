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
    }
};