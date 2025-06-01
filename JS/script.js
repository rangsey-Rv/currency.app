const dropLists = document.querySelectorAll(".drop-list select"),
    fromCurrency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button"),
    exchangeRateTxt = document.querySelector(".exchange-rate");

// Populate currency dropdowns
for (let i = 0; i < dropLists.length; i++) {
    for (let currency_code in country_list) {
        let selected = "";
        if (i === 0 && currency_code === "USD") selected = "selected";
        else if (i === 1 && currency_code === "KHR") selected = "selected"; // default to KHR instead of NPR
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropLists[i].insertAdjacentHTML("beforeend", optionTag);
    }

    dropLists[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

// Load flag image for selected currency
function loadFlag(element) {
    for (let code in country_list) {
        if (code === element.value) {
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagsapi.com/${country_list[code]}/flat/64.png`;
        }
    }
}

// Load default flags and rate on page load
window.addEventListener("load", () => {
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// Handle form button click
getButton.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

// Swap currencies when exchange icon clicked
const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// Fetch and display exchange rate
function getExchangeRate() {
    const amount = document.querySelector(".amount input");
    let amountVal = amount.value;

    if (amountVal === "" || isNaN(amountVal) || amountVal === "0") {
        amount.value = "1";
        amountVal = 1;
    }

    const fromCode = fromCurrency.value;
    const toCode = toCurrency.value;

    const url = `https://v6.exchangerate-api.com/v6/747ef3694d17a79a02698f7e/latest/${fromCode}`;

    fetch(url)
        .then(response => response.json())
        .then(result => {
            const rate = result.conversion_rates[toCode];
            const totalExchange = (amountVal * rate).toFixed(2);
            exchangeRateTxt.innerText = `${amountVal} ${fromCode} = ${totalExchange} ${toCode}`;
        })
        .catch(() => {
            exchangeRateTxt.innerText = "Something went wrong.";
        });
}
