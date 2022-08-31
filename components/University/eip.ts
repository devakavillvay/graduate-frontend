export const domain: any = {
    name: "The University of Villvay",
    version: "1.0",
    chainId: 4,
    verifyingContract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
};

export const types: any = {
    Certificate: [
        { name: "studentAddress", type: "address" },
        { name: "name", type: "string" },
        { name: "qualification", type: "string" },
        { name: "major", type: "string" },
    ],
};
