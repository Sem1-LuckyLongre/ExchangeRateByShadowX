const dropdowns = document.querySelectorAll(".input-group select");
const ConvertBtn = document.querySelector("button");
const fromCurr = document.querySelector("#from");
const toCurr = document.querySelector("#to");
const Loader = document.querySelector('#loader');
const MainDiv = document.querySelector('#mainDiv');
const ShowMgs = document.querySelector("#converted-amount");
const Failed = document.querySelector(".failed");

MainDiv.style.display = "none";

const ApiKey = "380763457b644cad8179208ac58b915b";  // Your Currency Freaks API key
const currenciesURL = `https://api.currencyfreaks.com/v2.0/currencies?apikey=${ApiKey}`;

fetch(currenciesURL)
    .then(response => response.json())
    .then(data => {
        Loader.style.display = "none";
        MainDiv.style.display = "block";
        const currencies = data.currencies;                
        // Populate dropdowns with fetched currencies
        for (let Code in currencies) {
            dropdowns.forEach(select => {
                let newOpt = document.createElement("option");
                newOpt.innerText = `${Code} - ${currencies[Code].name}`;  // Shows code and country name
                newOpt.value = Code;
                // Default selection for 'from' and 'to'
                if (select.id === "from" && Code === "USD") {
                    newOpt.selected = "selected";
                } else if (select.id === "to" && Code === "INR") {
                    newOpt.selected = "selected";
                }
                select.append(newOpt);
            });
        }
    })
    .catch(error => {
        console.error("Error fetching currencies:", error);
        Failed.innerHTML = `<p> Please Check Your Internet Connection! </p> <p> Or </p> <p> ${error} </p>`   
    });

// Event listener to update flag images
dropdowns.forEach(select => {
    select.addEventListener("change", (e) => {
        UpdateFlag(e.target);
    });
});

// Function to update flag based on selected currency
function UpdateFlag(element) {
    let Code = element.value;
    let CountryCode = Code.slice(0, 2).toLowerCase();  // Using first two characters as the country code for flag
    let img = element.parentElement.querySelector("img");
    img.src = `https://flagcdn.com/w20/${CountryCode}.png`;
}

// Event listener for conversion calculation
ConvertBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Fetch conversion rate
    UpdateValue();
});

const UpdateValue = () => {
    let Amount = document.querySelector("input");
    let AmountVal = Amount.value;
    if (AmountVal === "" || AmountVal < 1) {
        AmountVal = 100;
        Amount.value = 100;
    }

    const BASE_URL = "https://api.currencyfreaks.com/v2.0/convert";
    const URL = `${BASE_URL}?apikey=${ApiKey}&from=${fromCurr.value}&to=${toCurr.value}&amount=${AmountVal}`;
    console.log(URL);
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            let ConvertedVal = data.result;            
            ShowMgs.innerText = `Converted Amount: ${ConvertedVal} ${toCurr.value}`;            
        })
        .catch(error => {
            console.error("Error fetching conversion rate:", error);            
            Failed.innerHTML = `<p> Please Check Your Internet Connection! </p> <p> Or </p> <p> ${error} </p>`                        
        });
}
