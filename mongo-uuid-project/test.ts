const calculateCharCounts = (uuids: string[]) => {
    const charCounts = uuids.map((uuid) => {
        const counts: Record<string, number> = {};
        for (const char of uuid.replace(/-/g, "")) {
            counts[char] = (counts[char] || 0) + 1;
        }
        return JSON.stringify(counts); 
    });

    const patternCounts: Record<string, number> = {};
    charCounts.forEach((pattern) => {
        patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
    });

    const totalUuids = uuids.length;
    const uniquePatterns = Object.keys(patternCounts).length;
    const average = totalUuids / uniquePatterns;

    return { totalUuids, uniquePatterns, average };
};

const testUUIDs = [
    "550e8400-e29b-41d4-a716-446655440000",
    "550e4800-e29b-41d4-a716-446655440000",
    "123e4567-e89b-12d3-a456-426614174000",
    "123e4567-e89b-12d3-a456-426614174001",
    "00000000-0000-0000-0000-000000000000",
];

const result = calculateCharCounts(testUUIDs);

console.log("======================== RESULTS ========================");
console.log(`Total UUIDs Processed: ${result.totalUuids}`);
console.log(`Unique Character Count Patterns: ${result.uniquePatterns}`);
console.log(`Average UUIDs Sharing Same Pattern: ${result.average.toFixed(2)}`);
console.log("========================================================");
