export const validatePayment = (body: any) => {
    const { loanId, utrNumber, amount } = body;

    if (!loanId) {
        return {
            error: {
                message: "Loan ID is required",
            },
        };
    }

    if (!/^\d{17}$/.test(utrNumber?.trim() || "")) {
        return {
            error: {
                message: "UTR Number is required and must be a valid 17-digit number",
            },
        };
    }

    if (!amount || amount <= 0) {
        return {
            error: {
                message: "Amount must be greater than 0",
            },
        };
    }

    return {};
};