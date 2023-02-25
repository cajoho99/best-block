import { Block } from "@prisma/client";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import { api } from "../utils/api";

const Block = ({ block, vote }: { block: Block, vote: () => void }) => {
    return (
        <div
            onClick={vote}
            className="animate-fade-in text-center p-4 flex flex-col items-center bg-slate-800 shadow-slate-900 rounded shadow-sm cursor-pointer">

            <Image alt="" width={256} height={256} className="h-32 w-32 md:h-64 md:w-64 object-contain" src={block.imageURL} />
            <div className="h-4" />
            <div className="w-64 h-16 text-white text-xl md:text-2xl text-center">{block.name}</div>
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
        <div className="w-screen absolute inset-0 md:h-screen text-white bg-slate-900 flex flex-col items-center justify-center">
            <h1 className="text-4xl p-2 pt-4 md:p-8 text-center">Which is the best block out of:</h1>
            {blockPair && (<div className="flex flex-col md:flex-row items-center grow">
                <Block block={blockPair.firstBlock!} vote={() => { castVote(blockPair.firstBlock!.id) }} />
                <span className="m-8 text-white">and</span>
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
            <Link className="underline p-4" href="/results">Results</Link>
            <div className="text-sm">Made by <a className="underline" href="github.com/cajoho99">cajoho99</a> - Inspired by <a className="underline" href="roundest.t3.gg">roundest-mon</a></div>
        </div>
    );
};

export default Home;
