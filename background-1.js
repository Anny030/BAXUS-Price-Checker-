function stringSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;

    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;

    const editDistance = function(s1, s2) {
        const costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    };

    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "fetch_baxus") {
        const endpoint = `https://services.baxus.co/api/search/listings?from=0&size=100&listed=true`;

        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                const listings = data?.listings || [];

                const userBottleName = message.query.toLowerCase().trim();

                const matched = listings.find(item => {
                    const listingName = item?.name?.toLowerCase()?.trim() || "";
                    const similarity = stringSimilarity(listingName, userBottleName);
                
                    return similarity > 0.7;  // 70% similarity is good enough
                });
                

                sendResponse({ match: matched || null });
            })
            .catch(err => {
                console.error("BAXUS fetch error:", err);
                sendResponse({ error: err.toString() });
            });

        return true;
    }
});
