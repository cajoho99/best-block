import { inferAsyncReturnType } from "@trpc/server"
import { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import { api } from "../../utils/api"


const ResultPage: NextPage = () => {
    const { data: allBlocks } = api.blocks.getAll.useQuery()


    if (!allBlocks) return <div>loading...</div>
    const generateDiff = (block: { _count: { votesFor: number, votesAgainst: number } }) => {
        const { votesFor, votesAgainst } = block._count;

        if (votesFor + votesAgainst === 0)
            return 0
        return votesFor / (votesFor + votesAgainst) * 100
    }
    return (
        <>
            
            <Link className="underline absolute top-2 left-2 text-white" href="/">Keep voting</Link>
            <div className="bg-slate-900 text-white flex flex-col items-center">
                <h1 className="text-4xl p-8">Results</h1>
                <div>
                    {
                        allBlocks.sort(
                            (a, b) => {
                                const difference =
                                    generateDiff(b) - generateDiff(a);

                                if (difference === 0) {
                                    return b._count.votesFor - a._count.votesAgainst;
                                }

                                return difference;
                            }
                        ).map((block, index) => {

                            return (
                                <div key={index} className="p-4 flex flex-row border-white border-b-2 items-center">
                                    <span>{index + 1}.</span>
                                    <Image width={64} height={64} className="w-16 h-16 pl-4 object-contain" alt="" src={block.imageURL} />
                                    <span className="pl-4 grow">{block.name}</span>
                                    <span className="justify-end">{generateDiff(block).toFixed(2)}%</span>
                                </div>
                            )
                        }
                        )
                    }
                </div>
            </div>
        </>
    )

}

export default ResultPage
