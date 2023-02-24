const NO_BLOCKS = 893

export const getRandomBlock: (exclude?: number) => number = (exclude) => {

    const index = Math.floor(Math.random() * NO_BLOCKS) + 1

    if(index !== exclude) return index;

    return getRandomBlock(exclude)
} 

export const getRandomPair = () => {
    const firstId = getRandomBlock();
    const secondId = getRandomBlock(firstId);

    return [firstId, secondId] as const
}
