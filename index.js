// Function to fetch exchange rates from a free API (https://api.exchangerate-api.com)
async function fetchExchangeRates(baseCurrency) {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return null;
    }
}

// Function to convert amount
function convertCurrency(amount, fromCurrency, toCurrency, rates) {
    if (fromCurrency === toCurrency) {
        return amount;
    }

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    const convertedAmount = (amount / fromRate) * toRate;
    return convertedAmount.toFixed(2);
}

// Function to handle conversion and update UI
async function handleConversion() {
    const amount = parseFloat(document.getElementById('amountInput').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    const rates = await fetchExchangeRates(fromCurrency);

    if (!rates) {
        alert('Failed to fetch exchange rates. Please try again later.');
        return;
    }

    const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency, rates);
    document.getElementById('convertedAmount').value = convertedAmount;

    // Add transaction to history
    addToTransactionHistory(amount, fromCurrency, convertedAmount, toCurrency);
}

// Function to add transaction to history
function addToTransactionHistory(amount, fromCurrency, convertedAmount, toCurrency) {
    const transactionList = document.getElementById('transactionList');

    const listItem = document.createElement('li');
    listItem.classList.add('py-2', 'flex', 'justify-between', 'items-center');

    const transactionInfo = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    const textNode = document.createTextNode(transactionInfo);

    listItem.appendChild(textNode);
    transactionList.appendChild(listItem);
}

// Event listener for convert button
document.getElementById('convertBtn').addEventListener('click', handleConversion);
