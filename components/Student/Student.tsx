import { SyntheticEvent, useState } from "react";
import { useAccount, useContract, useSigner, useSignTypedData } from "wagmi";
import contractAbi from "@/contracts/VillvayCerts.json";
import Spinner from "../Spinner";
import Response from "../Response";

type Certificate = {
    studentAddress: string;
    name: string;
    qualification: string;
    major: string;
    ipfsHash: string;
};

const Student = () => {
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [signature, setSignature] = useState<string>("");
    const [resultText, setResultText] = useState<string>("");
    const [resultOpen, setResultOpen] = useState<boolean>(false);
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
        ipfsHash: "",
    });

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        console.log("in grant");
        console.log(formData);
        setIsLoading(true);
        const tx = await contract.verifyCert(formData, signature, {
            gasLimit: 500000,
        });
        setIsLoading(false);
        if (tx === true) {
            setResultOpen(true);
            setResultText("Verified!");
        } else {
            setResultOpen(true);
            setResultText("Could Not Verify Your Certificate!");
        }
    };

    const handleChange = (e: any) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const getCertificate = async () => {
        const tx = await contract.getCertificateByStudent(
            formData.studentAddress
        );
        if (
            tx.studentAddress === "0x0000000000000000000000000000000000000000"
        ) {
            setResultOpen(true);
            setResultText("This Student Does Not Have A Certificate");
        }
        setFormData({
            ipfsHash: tx.ipfsHash,
            major: tx.major,
            name: tx.name,
            qualification: tx.qualification,
            studentAddress: tx.studentAddress,
        });
    };

    return (
        <>
            <h2 className="text-gray-800 text-center mt-10 font-extrabold text-3xl">
                Welcome Student
            </h2>
            <h2 className="text-gray-800 text-center mt-10 mb-5 text-3xl">
                Verify Certificate Details
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid place-items-center">
                    <div className="flex w-2/3 items-center justify-between">
                        <input
                            required
                            placeholder="Student Address"
                            name="studentAddress"
                            value={formData.studentAddress}
                            onChange={handleChange}
                            className="text-center font-semibold text-lg mt-5 w-8/12 h-10 rounded bg-gray-700 text-indigo-200"
                        />
                        <button
                            onClick={getCertificate}
                            type="button"
                            className="w-3/12 mt-5 bg-gray-700 text-indigo-200 rounded px-5 py-1 text-lg font-semibold"
                        >
                            Retrieve Certificate
                        </button>
                    </div>
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
                    <input
                        required
                        placeholder="IPFS Hash"
                        name="ipfsHash"
                        value={formData.ipfsHash}
                        onChange={handleChange}
                        className="text-center font-semibold text-lg mt-5 w-2/3 h-10 rounded bg-gray-700 text-indigo-200"
                    />
                    <input
                        required
                        placeholder="Signature"
                        name="signature"
                        value={signature}
                        onChange={(e: any) => setSignature(e.target.value)}
                        className="text-center font-semibold text-lg mt-5 w-2/3 h-10 rounded bg-gray-700 text-indigo-200"
                    />
                    <button
                        type="submit"
                        className="mt-5 bg-gray-700 text-indigo-200 rounded px-10 py-1 text-lg font-semibold"
                    >
                        Verify
                    </button>
                </div>
            </form>
            <Spinner isOpen={isLoading} setIsOpen={setIsLoading} />
            <Response
                isOpen={resultOpen}
                setIsOpen={setResultOpen}
                text={resultText}
            />
        </>
    );
};

export default Student;
