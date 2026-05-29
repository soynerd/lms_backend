import {
    MAX_AGE,
    MIN_AGE,
    MIN_SALARY,
    PAN_REGEX,
} from "./constants.js";

export const runBRE = (
    personalDetails: any
) => {
    const {
        pan,
        monthlySalary,
        employmentMode,
        dob,
    } = personalDetails;

    const age =
        new Date().getFullYear() -
        new Date(dob).getFullYear();

    if (
        age < MIN_AGE ||
        age > MAX_AGE
    ) {
        throw new Error(
            "Age must be between 23 and 50"
        );
    }

    if (monthlySalary < MIN_SALARY) {
        throw new Error(
            "Salary must be at least ₹25,000"
        );
    }

    if (
        !PAN_REGEX.test(
            pan.toUpperCase()
        )
    ) {
        throw new Error("Invalid PAN");
    }

    if (
        employmentMode ===
        "UNEMPLOYED"
    ) {
        throw new Error(
            "Unemployed applicants are not eligible"
        );
    }
};