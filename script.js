const dropdowns = document.querySelectorAll(".input-group select");
const ConvertBtn = document.querySelector("button");
const fromCurr = document.querySelector("#from");
const toCurr = document.querySelector("#to");
const Loader = document.querySelector('#loader');
const MainDiv = document.querySelector('#mainDiv');
const ShowMgs = document.querySelector("#converted-amount");
const Failed = document.querySelector(".failed");

MainDiv.style.display = "none"

const ApiKey = "5defe6a776-47d2167aca-smdpkf";  // Your Fast Forex API key
const currenciesURL = `https://api.fastforex.io/currencies?api_key=${ApiKey}`;
fetch(currenciesURL)
    .then(response => response.json())
    .then(data => {
        Loader.style.display = "none";
        MainDiv.style.display = "block"
        const currencies = data.currencies;                
        // Populate dropdowns with fetched currencies
        for (let Code in currencies) {
            dropdowns.forEach(select => {
                let newOpt = document.createElement("option");
                newOpt.innerText = `${Code} - ${currencies[Code]}`;  // Shows code and country name
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
    UpdateValue()
});
const UpdateValue = ()=>{
    let Amount = document.querySelector("input");
    let AmountVal = Amount.value;
    if (AmountVal === "" || AmountVal < 1) {
        AmountVal = 100;
        Amount.value = 100;
    }

    const BASE_URL = "https://api.fastforex.io/fetch-one?from=";
    const URL = `${BASE_URL}${fromCurr.value}&to=${toCurr.value}&api_key=${ApiKey}`;
    console.log(URL);
    fetch(URL)
        .then(response => response.json())
        .then(Rate => {
            let ConvertedVal = AmountVal * Rate.result[toCurr.value];            
            ShowMgs.innerText = ConvertedVal            
        })
        .catch(error => {
            console.error("Error fetching conversion rate:", error);            
            Failed.innerHTML = `<p> Please Check Your Internet Connection! </p> <p> Or </p> <p> ${error} </p>`                        
        });
}
document.addEventListener('load',()=>{
    UpdateValue()
})
