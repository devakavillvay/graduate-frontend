import { SyntheticEvent, useState } from "react";
import { useContract, useSigner, useSignTypedData } from "wagmi";
import contractAbi from "@/contracts/VillvayCerts.json";
import { domain, types } from "./eip";

type Certificate = {
    studentAddress: string;
    name: string;
    qualification: string;
    major: string;
};

const University = () => {
    const { data: signer } = useSigner();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const contract = useContract({
        addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
        contractInterface: contractAbi.abi,
        signerOrProvider: signer,
    });
    const [formData, setFormData] = useState<Certificate>({
        studentAddress: "",
        name: "",
        qualification: "",
        major: "",
    });
    const { data: signature, signTypedData } = useSignTypedData();

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        signTypedData({
            domain,
            types,
            value: formData,
        });
        await grantCertificate();
    };
    const grantCertificate = async () => {
        console.log("in grant");
        console.log(formData);
        const tx = await contract.grantCertificate(
            formData.studentAddress,
            formData,
            { gasLimit: 500000 }
        );
        setIsLoading(true);
        await tx.wait();
        setIsLoading(false);
        alert(`certificate granted`);
        setFormData({
            studentAddress: "",
            name: "",
            qualification: "",
            major: "",
        });
    };

    const handleChange = (e: any) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    console.log(formData);

    return (
        <>
            <h2 className="text-gray-800 text-center mt-10 font-extrabold text-3xl">
                Welcome Administrator
            </h2>
            <h2 className="text-gray-800 text-center mt-10 mb-5 text-3xl">
                Grant A Certificate
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid place-items-center">
                    <input
                        required
                        placeholder="Student Address"
                        name="studentAddress"
                        value={formData.studentAddress}
                        onChange={handleChange}
                        className="text-center font-semibold text-lg mt-5 w-2/3 h-10 rounded bg-gray-700 text-indigo-200"
                    />
                    <input
                        required
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="text-center font-semibold text-lg mt-5 w-2/3 h-10 rounded bg-gray-700 text-indigo-200"
                    />
                    <input
                        required
                        placeholder="Qualification"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        className="text-center font-semibold text-lg mt-5 w-2/3 h-10 rounded bg-gray-700 text-indigo-200"
                    />
                    <input
                        required
                        placeholder="Major"
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        className="text-center font-semibold text-lg mt-5 w-2/3 h-10 rounded bg-gray-700 text-indigo-200"
                    />
                    <button
                        type="submit"
                        className="mt-5 bg-gray-700 text-indigo-200 rounded px-10 py-1 text-lg font-semibold"
                    >
                        Grant
                    </button>
                    <p className="mt-10 text-center break-words w-2/3 font-semibold">
                        Signature : {signature}
                    </p>
                </div>
            </form>
        </>
    );
};

export default University;
