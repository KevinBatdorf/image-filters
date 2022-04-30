export const batch = (filters: Record<string, string>, count: number) =>
    Object.entries(filters).reduce((acc, [filter, name]) => {
        if (acc.length === 0) {
            acc.push([[filter, name]])
        } else if (acc[acc.length - 1].length < count) {
            acc[acc.length - 1].push([filter, name])
        } else {
            acc.push([[filter, name]])
        }
        return acc
    }, [] as [string, string][][])
