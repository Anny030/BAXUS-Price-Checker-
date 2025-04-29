# Baxathon-extension-
# BAXUS Price Comparison Chrome Extension

## Overview
A Chrome extension that helps wine and whisky enthusiasts find the best prices for bottles by scraping retail websites and comparing them with listings on the BAXUS marketplace.

## Features
- **Bottle Identification**: Scrapes bottle information (name, price, vintage).
- **Price Comparison**: Compares scraped prices with BAXUS marketplace.
- **User Interface**: Non-intrusive popup displaying savings and direct BAXUS links.
- **Privacy**: No personal data is collected, only public product information.

## Installation

1. Clone or download this repository.
2. Go to `chrome://extensions/` in Chrome.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the project folder.

## Supported Websites
- TotalWine.com
- Wine.com
- ReserveBar.com

(Additional sites may be supported with updates.)

## API Integration
Uses the BAXUS marketplace API to search for bottles and compare prices.
- Endpoint: `GET https://services.baxus.co/api/search/listings?from=0&size=20&listed=true&q={query}`

## Demo Video
[Insert Demo Video Link]

## Contributing
Fork the repository, make changes, and submit a pull request.

## License
MIT License - see [LICENSE](LICENSE) for details.
