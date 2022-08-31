import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const Home: NextPage = () => {
    const [hydrated, setHydrated] = useState(false);
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    const { disconnect } = useDisconnect();
    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        return null;
    }

    return (
        <>
            {isConnected === true ? (
                <>
                    <h1 className="text-center mt-10 mb-10 text-gray-800 font-extrabold text-6xl">
                        Villvay University Certificates
                    </h1>
                    <div className="flex flex-col items-center">
                        <button
                            className="text-center bg-gray-700 text-indigo-200 font-bold p-4 text-xl rounded my-auto"
                            onClick={() => disconnect()}
                        >
                            Disconnect from{" "}
                            {`${address?.slice(0, 4)}.....${address?.slice(
                                -4
                            )}`}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h1 className="text-center mt-10 mb-10 text-gray-800 font-extrabold text-6xl">
                        Villvay University Certificates
                    </h1>
                    <div className="flex flex-col items-center">
                        <button
                            className="text-center bg-gray-700 text-indigo-200 font-bold p-4 text-xl rounded my-auto"
                            onClick={() => connect()}
                        >
                            Connect Your Wallet
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default Home;
