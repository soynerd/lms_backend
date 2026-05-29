export interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export const validateRegister = (body: RegisterBody) => {
    if (!body.name?.trim()) {
        return { error: { message: "Name is required" } };
    }

    if (!body.email?.trim()) {
        return { error: { message: "Email is required" } };
    }

    if (!body.password || body.password.length < 6) {
        return { error: { message: "Password must be at least 6 characters" } };
    }

    return {};
};

export const validateLogin = (body: LoginBody) => {
    if (!body.email?.trim()) {
        return { error: { message: "Email is required" } };
    }

    if (!body.password) {
        return { error: { message: "Password is required" } };
    }

    return {};
};