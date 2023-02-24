import { z } from "zod";
import { getRandomPair } from "../../../utils/getRandomBlock";

import { createTRPCRouter, publicProcedure } from "../trpc";


export const blocksRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.block.findMany();
    }),
    getBlockPair: publicProcedure.query(async () => {
        const [a, b] = getRandomPair();

        const pairOfBlocks = await prisma.block.findMany({ where: { id: { in: [a, b] } } });

        if (pairOfBlocks.length !== 2) throw new Error("Did not find two blocks")

        return {
            firstBlock: pairOfBlocks[0],
            secondBlock: pairOfBlocks[1]
        }
    }),
    castVote: publicProcedure
        .input(z.object({ votedForId: z.number(), votedAgainstId: z.number() }))
        .mutation(async ({ ctx, input }) => {
        const voteInDb = await ctx.prisma.vote.create({data: {
           votedForId: input.votedForId,
           votedAgainstId: input.votedAgainstId
        }})

        return {success: true, vote: voteInDb}
    })


})
