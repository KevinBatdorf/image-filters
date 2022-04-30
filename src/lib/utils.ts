export const batch = (filters: Record<string, string>, count: number) => {
    return Object.entries(filters).reduce((acc, [filter, name]) => {
        if (acc.length === 0) {
            acc.push([[filter, name]])
        } else if (acc[acc.length - 1].length < count) {
            acc[acc.length - 1].push([filter, name])
        } else {
            acc.push([[filter, name]])
        }
        return acc
    }, [] as [string, string][][])
}

export const toHumanBytes = (n: number) => {
    // https://stackoverflow.com/a/42408230/1437789
    const k = n > 0 ? Math.floor(Math.log2(n) / 10) : 0
    const rank = (k > 0 ? 'KMGT'[k - 1] : '') + 'b'
    const count = Math.floor(n / Math.pow(1024, k))
    return count + rank
}
