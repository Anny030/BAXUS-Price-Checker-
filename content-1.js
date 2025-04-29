let scrapedData = null;

// Function to scrape bottle name and price
function scrapeBottleData() {
    const nameElement = document.querySelector('h1');

    // Try multiple price selectors carefully
    const priceSelectors = [
        '[data-qa="ProductPrice"]',
        'span[data-test="product-price"]',
        '[class*="price"]',
        '[class*="Price"]',
        '.product-price', 
        '.price' 
    ];

    let priceText = "";

    for (let selector of priceSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent) {
            priceText = element.textContent.trim();
            break; // Found first valid price, exit
        }
    }

    // Now clean the priceText to only extract first $ amount
    let priceMatch = priceText.match(/\$[0-9,.]+/);

    const finalPrice = priceMatch ? priceMatch[0] : "Unknown Price";

    const name = nameElement ? nameElement.textContent.trim() : "Unknown Bottle";

    scrapedData = { name, price: finalPrice };
}

// Run scrape when page is loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scrapeBottleData);
} else {
    scrapeBottleData();
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "CHECK_PAGE_READY") {
        sendResponse({ pageReady: true });
    } else if (request.type === "GET_BOTTLE_DATA") {
        sendResponse(scrapedData);
    }
});
