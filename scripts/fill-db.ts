import { promises as fs } from "fs";

const downloadImage = async (url: string, path: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(path, buffer);
}
import { PrismaClient } from '@prisma/client'

const fileExists = async (path:string ) => !!(await fs.stat(path).catch(e => false));

const prisma = new PrismaClient()

export class BlockScraper {
    async scrapeBlocks(url: string) {
        const response = await fetch(url);
        const blocks = await response.json();
        const outputData = []

        for (const block of blocks) {

            if (!await fileExists('./public/blocks/' + block.namespacedId + '.png')) {
                await downloadImage(block.image, './public/blocks/' + block.namespacedId + '.png')                
                console.log(block.name + "was downloaded" )
            }
            outputData.push({
                name: block.name,
                imageURL: '/blocks/' + block.namespacedId + '.png'
            })

        }
        return outputData
    }
}

async function main() {
    const scraper = new BlockScraper();
    const data = await scraper.scrapeBlocks("https://minecraft-api.vercel.app/api/blocks");
    console.log(data)
    const creation = await prisma.block.createMany({
        data: data 
    })  
    console.log("Creation?", creation);
}

main().then(async () => {

    await prisma.$disconnect()

  })

  .catch(async (e) => {

    console.error(e)

    await prisma.$disconnect()

    process.exit(1)

  });
