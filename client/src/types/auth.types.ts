

// user type with
export interface User {
    id: number;
    username: string;
    role: "user" | "admin";
}

export interface AuthError {
    message: string;
    statusCode: number;
}