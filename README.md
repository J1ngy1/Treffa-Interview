# Task 1: MongoDB and UUIDv4 Analysis

## Problem Overview
- Install MongoDB, and create a database called ‘test’ and a collection called ‘uuid’.
- Write a TypeScript function to add 100,000 UUIDv4s to the collection as Document primary keys.
- Write a TypeScript function to calculate the count of each of the characters in each UUID, then count the number of the 100,000 UUIDs that share the same per-character counts. Output the average number of UUIDs of the 100,000 that share the same per-character counts.

## Design Approach
1. Set up MongoDB and connect to the database `test`.
2. Write a function to generate 100,000 UUIDv4s and insert them into the `uuid` collection. The UUIDs were stored as the `_id` of each document.
3. Write another function to process the UUIDs and compute character frequency for each one. I used MongoDB’s aggregation pipeline.
4. Calculate the number of UUIDs with the same frequency pattern and compute the average.

## Implementation
- I used a batch approach to insert the UUIDs in chunks of 1,000 for better performance.
- The character frequency calculation used MongoDB’s `$function` to execute JavaScript directly within the database.

## Problems and Solutions
- Initially, MongoDB threw errors about `_id` types. I resolved this by defining `_id` as `string` in the TypeScript schema.

## Results
The script successfully inserted and processed 100,000 UUIDv4s. The results showed:
- **Total UUIDs Processed**: 100,000
- **Unique Character Count Patterns**: 100,000
- **Average UUIDs Sharing the Same Pattern**: 1.00

These results make sense because UUIDv4s are highly random, and it’s rare for two UUIDs to share the same character frequency pattern. 

Here’s an example output:
```
✅ Connected to MongoDB
🌟 Step 1: Inserting 100,000 UUIDv4s...
✅ UUIDs successfully inserted!
🌟 Step 2: Calculating character counts...
✅ Character counts successfully calculated!
🌟 Step 3: Calculating averages...

======================== RESULTS ========================
Total UUIDs Processed: 100000
Unique Character Count Patterns: 100000
Average UUIDs Sharing Same Pattern: 1.00
========================================================

🔍 Example Character Count Patterns:
Pattern 1: {
  "2": 2,
  "3": 5,
  "4": 3,
  "5": 1,
  "6": 2,
  "8": 3,
  "c": 3,
  "d": 5,
  "b": 4,
  "e": 1,
  "a": 1,
  "f": 2
}
UUIDs Sharing This Pattern: 1
Pattern 2: {
  "0": 2,
  "1": 3,
  "2": 1,
  "3": 3,
  "4": 6,
  "6": 4,
  "7": 1,
  "8": 4,
  "9": 1,
  "e": 1,
  "f": 2,
  "c": 2,
  "a": 2
}
UUIDs Sharing This Pattern: 1
Pattern 3: {
  "0": 2,
  "1": 3,
  "2": 3,
  "3": 1,
  "4": 3,
  "5": 1,
  "6": 2,
  "7": 3,
  "8": 2,
  "9": 2,
  "b": 3,
  "e": 3,
  "a": 3,
  "c": 1
}
UUIDs Sharing This Pattern: 1
Pattern 4: {
  "0": 3,
  "1": 3,
  "2": 2,
  "3": 1,
  "4": 2,
  "5": 2,
  "6": 2,
  "7": 2,
  "8": 2,
  "9": 1,
  "a": 3,
  "b": 2,
  "d": 4,
  "e": 3
}
UUIDs Sharing This Pattern: 1
Pattern 5: {
  "0": 2,
  "1": 2,
  "2": 2,
  "3": 4,
  "4": 2,
  "6": 2,
  "7": 1,
  "8": 4,
  "b": 1,
  "c": 2,
  "a": 2,
  "d": 5,
  "f": 1,
  "e": 2
}
UUIDs Sharing This Pattern: 1

🎯 Most Common Pattern:
{
  "2": 2,
  "3": 5,
  "4": 3,
  "5": 1,
  "6": 2,
  "8": 3,
  "c": 3,
  "d": 5,
  "b": 4,
  "e": 1,
  "a": 1,
  "f": 2
}
UUIDs Sharing This Pattern: 1
========================================================
```