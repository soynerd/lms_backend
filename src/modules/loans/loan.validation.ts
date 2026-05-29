export const validateLoanApplication = (
    body: any
) => {
    const { amount, tenureDays } = body;

    if (amount < 50000 || amount > 500000) {
        return {
            error: {
                message:
                    "Loan amount must be between 50000 and 500000",
            },
        };
    }

    if (tenureDays < 30 || tenureDays > 365) {
        return {
            error: {
                message:
                    "Tenure must be between 30 and 365 days",
            },
        };
    }

    return {};
};