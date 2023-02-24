import { Block } from "@prisma/client";
import { type NextPage } from "next";

import { api } from "../utils/api";

const Block = ({ block, vote }: { block: Block, vote: () => void }) => {
    return (
        <div
            onClick={vote}
            className="animate-fade-in text-center p-10 flex flex-col items-center bg-slate-800 shadow-slate-900 rounded shadow-sm cursor-pointer">

            <img className="h-64 w-64 object-contain" src={block.imageURL} />
            <div className="h-4" />
            <div className="w-64 h-16 text-white text-2xl text-center">{block.name}</div>
        </div>);
}

const Home: NextPage = () => {
    const { data: blockPair, refetch } = api.blocks.getBlockPair.useQuery(undefined,
        { refetchOnWindowFocus: false });

    const voteMutation = api.blocks.castVote.useMutation();


    const castVote = (voteFor: number) => {
        if (!blockPair || !blockPair.firstBlock || !blockPair.secondBlock)
            return;


        if (voteFor === blockPair.firstBlock.id) {
            voteMutation.mutate({
                votedForId: blockPair.firstBlock.id,
                votedAgainstId: blockPair.secondBlock.id
            })
        }
        else {

            voteMutation.mutate({
                votedAgainstId: blockPair.firstBlock.id,
                votedForId: blockPair.secondBlock.id
            })
        }

        refetch()
    }

    return (
        <div className="w-screen h-screen bg-slate-900 flex flex-col items-center justify-center">
            <h1 className="text-white text-4xl p-8">Which is the best block of:</h1>
            {blockPair && (<div className="flex flex-row items-center grow">
                <Block block={blockPair.firstBlock!} vote={() => { castVote(blockPair.firstBlock!.id) }} />
                <span className="m-8 text-white">vs</span>
                <Block block={blockPair.secondBlock!} vote={() => { castVote(blockPair.firstBlock!.id) }} />
            </div>)}
            {!blockPair && (
                <div className="flex items-center justify-center grow">
                    <div
                        className="text-white inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status">
                        <span
                            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        >Loading...</span
                        >
                    </div>
                </div>)}
        </div>
    );
};

export default Home;
