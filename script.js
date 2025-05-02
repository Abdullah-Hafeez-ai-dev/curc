const apiKey = "fca_live_L6dJ9FMzsumGL5XVM9YHjqksHCLhbjMqh6JkI63z";

const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const resultOutput = document.getElementById('result');
const convertButton = document.getElementById('convert');

// Populate dropdowns with available currencies
async function populateCurrencyOptions() {
  try {
    const response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}`);
    const data = await response.json();

    if (data && data.data) {
      const currencies = Object.keys(data.data);

      currencies.forEach(currency => {
        const option1 = document.createElement("option");
        option1.value = currency;
        option1.textContent = currency;
        fromCurrencySelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = currency;
        option2.textContent = currency;
        toCurrencySelect.appendChild(option2);
      });

      fromCurrencySelect.value = "USD";
      toCurrencySelect.value = "EUR";
    }
  } catch (error) {
    console.error("Error fetching currency list:", error);
    resultOutput.textContent = "Failed to load currency list.";
  }
}

// Get exchange rate and convert
convertButton.addEventListener('click', async () => {
  const amount = parseFloat(amountInput.value);
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  if (!amount || isNaN(amount)) {
    resultOutput.textContent = "Please enter a valid amount.";
    return;
  }

  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);

  if (exchangeRate) {
    const convertedAmount = (amount * exchangeRate).toFixed(2);
    resultOutput.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
  } else {
    resultOutput.textContent = "Error fetching exchange rates.";
  }
});

// Fetch exchange rate
async function getExchangeRate(baseCurrency, targetCurrency) {
  const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${baseCurrency}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.data && data.data[targetCurrency]) {
      return data.data[targetCurrency];
    } else {
      console.error("Currency not found in API response.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', populateCurrencyOptions);
