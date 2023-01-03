import axios from 'axios';
import cheerio from 'cheerio';

import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export class BlockScraper {
    async scrapeBlocks(url: string) {
        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);

        const blockData = $('.wikia-gallery-item');

        const outputData = []

        for (let i = 0; i < blockData.length; i++) {
            const name = $(blockData[i]).find(".lightbox-caption").text();
            if(name == "" || name === undefined) continue;
            const imageName = $(blockData[i]).find("img").attr("data-src")
            if(imageName == "" || imageName === undefined) continue;
           
            outputData.push({
                name,
                imageURL: imageName
            })
        }

        return outputData
    }
}

async function main() {
    const scraper = new BlockScraper();
    const data = await scraper.scrapeBlocks("https://minecraft-archive.fandom.com/wiki/Blocks/Gallery");
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
