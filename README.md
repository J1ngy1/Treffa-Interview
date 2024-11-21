# Task 1: MongoDB and UUIDv4

## Problem
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
- Initially, MongoDB threw errors about `_id` types. I resolved this by defining `_id` as `string` in the TypeScript schema.

## Results
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

These results make sense because UUIDv4s are highly random, and it’s rare for two UUIDs to share the same character frequency pattern. 

To verify the algorithm, I wrote a simple script to test it. I used the following sample UUIDs:
1. `550e8400-e29b-41d4-a716-446655440000`
2. `550e4800-e29b-41d4-a716-446655440000`
3. `123e4567-e89b-12d3-a456-426614174000`
4. `123e4567-e89b-12d3-a456-426614174001`
5. `00000000-0000-0000-0000-000000000000`

The algorithm produced the following output:

```
======================== RESULTS ========================
Total UUIDs Processed: 5
Unique Character Count Patterns: 4
Average UUIDs Sharing Same Pattern: 1.25
========================================================
```
This confirms that the algorithm works correctly.

# Task 2: Product Data Scraper

## Problem
Write a TypeScript program to extract the urls of the full-size product images, as well as the product description, color and size options, and price of the featured product from the following url: https://us.princesspolly.com/products/harmony-sweater-blue

## Design Approach
1. Use Puppeteer to scrape the product page.
2. Inspect the HTML structure to locate the tags containing product images, description, colors, sizes, and price.
3. Filter out unwanted elements such as placeholders and button images to ensure only relevant data is extracted.
5. Ensure the results are formatted into a clean and structured output.

## Implementation
- Navigates to the product page and waits for the relevant elements to load.
- Extracts image URLs.
- Scrapes the product description, colors, sizes, and price.
- Translates hex color codes to names using `color-namer`.
- One issue was handling duplicate image URLs and filtering placeholders like `lazy-placeholder`. I used a `Set` to remove duplicates and added checks to exclude URLs containing certain keywords. Another challenge was ensuring that high-resolution images were prioritized, which I resolved by adding a fallback.


## Results
```
Product Details: {
  imageUrls: [
    'https://us.princesspolly.com/cdn/shop/files/3-modelinfo-rino-us4_885c0623-c8fb-4267-951c-5fea14feb332.jpg?v=1708407919&width=767',
    'https://us.princesspolly.com/cdn/shop/files/3-modelinfo-rino-us4_885c0623-c8fb-4267-951c-5fea14feb332.jpg?v=1708407919&width=1800',
    'https://us.princesspolly.com/cdn/shop/files/2-modelinfo-nika-us2_f6f9ff4c-b7b8-4992-bec3-c8407fa1260f.jpg?v=1730933950&width=767',
    'https://us.princesspolly.com/cdn/shop/files/2-modelinfo-nika-us2_f6f9ff4c-b7b8-4992-bec3-c8407fa1260f.jpg?v=1730933950&width=1800',
    'https://us.princesspolly.com/cdn/shop/files/1-modelinfo-nika-us2_01fd6616-ca50-46a1-8c00-b76a4a81de59.jpg?v=1730933950&width=767',
    'https://us.princesspolly.com/cdn/shop/files/1-modelinfo-nika-us2_01fd6616-ca50-46a1-8c00-b76a4a81de59.jpg?v=1730933950&width=1800',
    'https://us.princesspolly.com/cdn/shop/products/2-modelinfo-elise-us2_f64cc601-6e69-43b4-ae9c-9465783ff10c.jpg?v=1708407926&width=767',
    'https://us.princesspolly.com/cdn/shop/products/2-modelinfo-elise-us2_f64cc601-6e69-43b4-ae9c-9465783ff10c.jpg?v=1708407926&width=1800',
    'https://us.princesspolly.com/cdn/shop/products/3-modelinfo-elise-us2_ed071090-1e58-42e7-9eb9-947bcdd662cc.jpg?v=1708407926&width=767',
    'https://us.princesspolly.com/cdn/shop/products/3-modelinfo-elise-us2_ed071090-1e58-42e7-9eb9-947bcdd662cc.jpg?v=1708407926&width=1800',
    'https://us.princesspolly.com/cdn/shop/products/4-modelinfo-elise-us2_7129dff8-cef6-4fcf-9616-81303dd063b3.jpg?v=1708407926&width=1800',
    'https://us.princesspolly.com/cdn/shop/products/5-modelinfo-elise-us2_f684296b-feb6-46b8-9c2e-719e99d00582.jpg?v=1708407926&width=1800',
    'https://us.princesspolly.com/cdn/shop/products/6-modelinfo-elise-us2_d8e709cc-6cb1-4963-a5f2-0b2a1c399c20.jpg?v=1708407926&width=1800',
    'https://us.princesspolly.com/cdn/shop/products/1-modelinfo-elise-us2_ba698562-a695-43f1-9a80-497e3bf15c34.jpg?v=1708407926&width=1800',
    'https://us.princesspolly.com/cdn/shop/files/1-modelinfo-rino-us4_9ff0e738-19e0-4a17-a567-e334a27c7fe9.jpg?v=1708407926&width=1800',
    'https://us.princesspolly.com/cdn/shop/files/2-modelinfo-rino-us4_37c96303-10c1-4ddf-a909-40d97cf33de9.jpg?v=1708407919&width=1800'
  ],
  description: 'Oversized sweater\n' +
    '60% cotton 40% acrylic\n' +
    'Elise is wearing a size XS/S\n' +
    'Thick knit material\n' +
    'Rounded neckline\n' +
    'Relaxed sleeves\n' +
    'Drop shoulder\n' +
    'Unlined\n' +
    'Dress size US 2\n' +
    'Height: 5.5 ft\n' +
    'Bust: 30 inch\n' +
    'Waist: 22 inch\n' +
    'Hips: 34 inch',
  colors: [
    { hex: '#ece9d6', name: 'beige' },
    { hex: '#207fc9', name: 'gray' },
    { hex: '#999999', name: 'gray' },
    { hex: '#aac892', name: 'tan' },
    { hex: '#000000', name: 'black' },
    { hex: '#85305a', name: 'purple' },
    { hex: '#ffffff', name: 'white' },
    { hex: '#573d2e', name: 'gray' },
    { hex: '#2c3144', name: 'black' },
    { hex: '#dd6c8a', name: 'pink' },
    { hex: '#c2d0de', name: 'white' },
    { hex: '#b40000', name: 'brown' },
    { hex: '#f5e3d0', name: 'beige' }
  ],
  sizes: [ 'XS/S', 'S/M', 'M/L', 'L/XL' ],
  price: '$57.00'
}
```