chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'CHECK_PAGE_READY' }, function (response) {
        if (response && response.pageReady) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_BOTTLE_DATA' }, function (data) {
                if (data) {
                    console.log("Bottle Name:", data.name);
                    console.log("Bottle Price:", data.price);

                    // Update popup UI
                    document.getElementById('bottleName').textContent = data.name;
                    document.getElementById('bottlePrice').textContent = data.price;
                    // Show loading while waiting for BAXUS search
                    document.getElementById('result').innerHTML = `<em>Searching BAXUS...</em>`;

                    //
                    // *** NEW PART STARTS HERE ***
                    //
                    chrome.runtime.sendMessage({ type: "fetch_baxus", query: data.name }, function (response) {
                        if (response?.match) {
                            const baxusPrice = parseFloat(response.match.price) || 0;
                            const scrapedPrice = parseFloat(data.price.replace(/[^0-9.]/g, "")) || 0;
                            
                            let savings = (scrapedPrice && baxusPrice) ? (scrapedPrice - baxusPrice).toFixed(2) : null;
                
                            // Build HTML
                            let resultHTML = `
                                <br><strong>Available on BAXUS for:</strong> $${baxusPrice}
                            `;
                
                            if (savings && savings > 0) {
                                resultHTML += `<br><strong>You save:</strong> $${savings}!`;
                            } else if (savings && savings < 0) {
                                resultHTML += `<br><strong>Note:</strong> BAXUS is more expensive by $${Math.abs(savings)}.`;
                            }
                
                            // Optional: Link to BAXUS
                            if (response.match.id) {
                                resultHTML += `<br><a href="https://baxus.co/asset/${response.match.id}" target="_blank" style="color: blue;">View on BAXUS</a>`;
                            }
                
                            document.getElementById('result').innerHTML += resultHTML;
                
                        } else {
                            document.getElementById('result').innerHTML += `
                                <br><strong>Not found on BAXUS.</strong>
                            `;
                        }
                    });
                    //
                    // *** NEW PART ENDS HERE ***
                    //

                } else {
                    document.getElementById('bottleName').textContent = "No data found.";
                    document.getElementById('bottlePrice').textContent = "";
                }
            });
        } else {
            document.getElementById('bottleName').textContent = "Page still loading...";
            document.getElementById('bottlePrice').textContent = "";
        }
    });
});
  // Call background script to query BAXUS
chrome.runtime.sendMessage({ type: "fetch_baxus", query: data.name }, function (response) {
    if (response?.match) {
        const baxusPrice = parseFloat(response.match.price) || 0;
        const scrapedPrice = parseFloat(data.price.replace(/[^0-9.]/g, "")) || 0;
        
        let savings = (scrapedPrice && baxusPrice) ? (scrapedPrice - baxusPrice).toFixed(2) : null;

        // Build HTML
        let resultHTML = `
            <br><strong>Available on BAXUS for:</strong> $${baxusPrice}
        `;

        if (savings && savings > 0) {
            resultHTML += `<br><strong>You save:</strong> $${savings}!`;
        } else if (savings && savings < 0) {
            resultHTML += `<br><strong>Note:</strong> BAXUS is more expensive by $${Math.abs(savings)}.`;
        }

        // Optional: add link if BAXUS provides a URL field (adjust if available)
        if (response.match.id) { // Assuming the BAXUS item has an 'id' you can link to
            resultHTML += `<br><a href="https://baxus.co/asset/${response.match.id}" target="_blank" style="color: blue;">View on BAXUS</a>`;
        }

        document.getElementById('result').innerHTML += resultHTML;

    } else {
        document.getElementById('result').innerHTML += `
            <br><strong>Not found on BAXUS.</strong>
        `;
    }
});
