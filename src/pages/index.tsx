import { Block } from "@prisma/client";
import { type NextPage } from "next";

import { api } from "../utils/api";

const Block = ({ block }: { block: Block }) => {
    return (
        <div className="text-center p-10 flex flex-col items-center bg-slate-800 shadow-slate-900 rounded shadow-sm">
            <img className="h-64 w-64 object-contain" src={block.imageURL} />
            <div className="h-4"/>
            <div className="w-64 h-16 text-white text-2xl text-center">{block.name}</div>
        </div>);
}

const Home: NextPage = () => {
    const blocks = api.blocks.getBlockPair.useQuery(undefined,
        { refetchOnWindowFocus: false });


    if (!blocks.data) {

        if (blocks.error) {
            console.log(blocks.error)
            return <div>error...</div>
        }
        return <div>loading...</div>
    }

    return (
        <div className="w-screen h-screen bg-slate-900 flex flex-col items-center justify-center">
            <h1 className="text-white text-4xl p-8">Which is the best block of:</h1>
            <div className="flex flex-row items-center grow">
                <Block block={blocks.data.firstBlock!} />
                <span className="m-8 text-white">vs</span>
                <Block block={blocks.data.secondBlock!} />
            </div>
        </div>
    );
};

export default Home;
