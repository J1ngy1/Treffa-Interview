import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const BATCH_SIZE = 1000;

const calculateCharCounts = (uuid: string): { [char: string]: number } => {
    const charCounts: { [char: string]: number } = {};
    for (const char of uuid.replace(/-/g, "")) {
        charCounts[char] = (charCounts[char] || 0) + 1;
    }
    return charCounts;
};

const main = async () => {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db("test");
        const collection = db.collection<{ _id: string }>("uuid");
        await collection.deleteMany({});
        console.log("🌟 Step 1: Inserting 100,000 UUIDv4s...");
        for (let i = 0; i < 100; i++) {
            const batch = Array.from({ length: 1000 }, () => ({
                _id: uuidv4(),
            }));
            await collection.insertMany(batch);
        }
        console.log("✅ UUIDs successfully inserted!");

        console.log("🌟 Step 2: Calculating character counts...");
        const pipeline = [
            {
                $project: {
                    charCounts: {
                        $function: {
                            body: `
                                function(uuid) {
                                    const counts = {};
                                    for (const char of uuid.replace(/-/g, "")) {
                                        counts[char] = (counts[char] || 0) + 1;
                                    }
                                    return counts;
                                }
                            `,
                            args: ["$_id"],
                            lang: "js",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$charCounts",
                    count: { $sum: 1 },
                },
            },
        ];

        const charCounts = await collection.aggregate(pipeline).toArray();
        console.log("✅ Character counts successfully calculated!");

        console.log("🌟 Step 3: Calculating averages...");
        const totalUuids = charCounts.reduce((sum, group) => sum + group.count, 0);
        const uniquePatterns = charCounts.length;
        const average = totalUuids / uniquePatterns;

        console.log("\n======================== RESULTS ========================");
        console.log(`Total UUIDs Processed: ${totalUuids}`);
        console.log(`Unique Character Count Patterns: ${uniquePatterns}`);
        console.log(`Average UUIDs Sharing Same Pattern: ${average.toFixed(2)}`);
        console.log("========================================================\n");

        console.log("🔍 Example Character Count Patterns:");
        charCounts.slice(0, 5).forEach((pattern, index) => {
            console.log(`Pattern ${index + 1}:`, JSON.stringify(pattern._id, null, 2));
            console.log(`UUIDs Sharing This Pattern: ${pattern.count}`);
        });

        const mostCommonPattern = charCounts.reduce((max, group) =>
            group.count > max.count ? group : max
        );

        console.log("\n🎯 Most Common Pattern:");
        console.log(JSON.stringify(mostCommonPattern._id, null, 2));
        console.log(`UUIDs Sharing This Pattern: ${mostCommonPattern.count}`);
        console.log("========================================================");
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
    }
};

main();
