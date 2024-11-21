"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const color_namer_1 = __importDefault(require("color-namer"));
const scrapeProductDetails = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: true });
    const page = yield browser.newPage();
    try {
        // Navigate to the product page
        yield page.goto(url, { waitUntil: 'domcontentloaded' });
        // Wait for the product media items to load
        yield page.waitForSelector('.product__media-item');
        // Extract all valid full-size image URLs
        const imageUrls = yield page.$$eval('.product__media-item, .product__zoom', (elements) => elements
            .map((el) => {
            // Check for 'img' tag with 'src' attribute
            const img = el.querySelector('img');
            const imgSrc = img === null || img === void 0 ? void 0 : img.getAttribute('src');
            // Check for 'data-product-detail-zoom' attribute in '.product__zoom'
            const zoomSrc = el.getAttribute('data-product-detail-zoom');
            // Return either the higher-resolution zoomSrc or imgSrc
            return zoomSrc
                ? `https:${zoomSrc}`
                : imgSrc
                    ? `https:${imgSrc}`
                    : null;
        })
            .filter((url) => url !== null &&
            !url.includes('play-button') &&
            !url.includes('pause-button') &&
            !url.includes('lazy-placeholder')) // Filter irrelevant images
        );
        // Remove duplicate URLs
        const uniqueImageUrls = [...new Set(imageUrls)];
        // Extract product description
        const description = yield page.$$eval('.product-details__content-inner li', (items) => items.map((item) => { var _a; return (_a = item.textContent) === null || _a === void 0 ? void 0 : _a.trim(); }).join('\n'));
        // Extract color options
        const colorsWithHex = yield page.$$eval('.product__swatches a', (swatches) => swatches.map((swatch) => {
            const style = swatch.getAttribute('style');
            const match = style === null || style === void 0 ? void 0 : style.match(/background-color:\s*(#[a-fA-F0-9]+);?/);
            return match ? match[1] : null;
        }).filter((color) => color !== null));
        // Translate hex codes to human-readable color names
        const colors = colorsWithHex.map((hex) => ({
            hex,
            name: (0, color_namer_1.default)(hex).basic[0].name, // Using basic color names for simplicity
        }));
        // Extract size options
        const sizes = yield page.$$eval('.product__select-sizes-item button', (buttons) => buttons.map((button) => button.getAttribute('data-size-value')));
        // Extract price
        const price = yield page.$eval('.product__sale-price-row [data-product-price]', (priceEl) => { var _a; return (_a = priceEl.textContent) === null || _a === void 0 ? void 0 : _a.trim(); });
        // Log the extracted data
        const productDetails = {
            imageUrls: uniqueImageUrls,
            description,
            colors,
            sizes,
            price,
        };
        console.log('Product Details:', productDetails);
        return productDetails;
    }
    catch (error) {
        console.error('Error scraping product details:', error);
    }
    finally {
        yield browser.close();
    }
});
// URL of the product page
const productUrl = 'https://us.princesspolly.com/products/harmony-sweater-blue';
scrapeProductDetails(productUrl);
