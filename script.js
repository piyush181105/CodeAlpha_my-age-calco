document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const getStartedBtn = document.getElementById('getStartedBtn');
    const ageCalculatorSection = document.getElementById('ageCalculatorSection');
    const dobInput = document.getElementById('dob');
    const calculateAgeBtn = document.getElementById('calculateAgeBtn');
    const resultSection = document.getElementById('resultSection');
    const resultParagraph = document.getElementById('result');
    const quoteParagraph = document.querySelector('.quote');
    const authorParagraph = document.querySelector('.author');
    const calculateAgainBtn = document.getElementById('calculateAgainBtn');
    const scrollToCalculatorBtn = document.getElementById('scrollToCalculatorBtn');
    const tryNowBtn = document.querySelector('.try-now-btn');

    // MODAL ELEMENTS
    // Corrected ID for the Learn More button
    const openLearnMoreModalBtn = document.getElementById('openLearnMoreModalBtn');
    const learnMoreModal = document.getElementById('learnMoreModal');
    const closeButton = document.querySelector('.close-button');
    const modalCtaBtn = document.getElementById('modalCtaBtn');

    let quotes = [];

    // Function to fetch quotes from quotes.json
    const loadQuotes = async () => {
        try {
            const response = await fetch('quotes.json'); // Path to your JSON file
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            quotes = await response.json();
            console.log("Quotes loaded:", quotes.length);
            if (quotes.length > 0) {
                setRandomQuote();
            }
        } catch (error) {
            console.error("Error loading quotes:", error);
            quoteParagraph.textContent = "\"Life is a journey, not a destination.\"";
            authorParagraph.textContent = "— Ralph Waldo Emerson";
            resultParagraph.style.color = 'red';
            console.warn("Using fallback quote due to loading error.");
        }
    };

    const setRandomQuote = () => {
        if (quotes.length === 0) {
            quoteParagraph.textContent = "\"No inspiring quotes loaded at the moment.\"";
            authorParagraph.textContent = "— The App";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteParagraph.textContent = `"${randomQuote.quote}"`;
        authorParagraph.textContent = `— ${randomQuote.author}`;
    };

    const scrollToCalculator = () => {
        ageCalculatorSection.classList.remove('hidden');
        ageCalculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        resetCalculator();
        setRandomQuote();
    };

    // Event listeners for buttons that open/scroll to calculator
    getStartedBtn.addEventListener('click', () => {
        scrollToCalculator();
    });

    scrollToCalculatorBtn.addEventListener('click', () => {
        scrollToCalculator();
    });

    tryNowBtn.addEventListener('click', () => {
        scrollToCalculator();
    });

    // MODAL FUNCTIONALITY
    // Open the modal when "Learn More" is clicked
    openLearnMoreModalBtn.addEventListener('click', () => {
        learnMoreModal.style.display = 'flex'; // Use flex to center content
        document.body.style.overflow = 'hidden'; // Prevent scrolling of the body when modal is open
    });

    // Close the modal when 'x' button is clicked
    closeButton.addEventListener('click', () => {
        learnMoreModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore body scrolling
    });

    // Close the modal when clicking outside of the modal content
    learnMoreModal.addEventListener('click', (event) => {
        if (event.target === learnMoreModal) { // Check if the click was directly on the overlay
            learnMoreModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Close the modal and scroll to calculator when "Calculate My Age Now" button inside modal is clicked
    modalCtaBtn.addEventListener('click', () => {
        learnMoreModal.style.display = 'none'; // Hide the modal
        document.body.style.overflow = ''; // Restore body scrolling
        scrollToCalculator(); // Then scroll to the calculator section
    });


    // Function to calculate age
    calculateAgeBtn.addEventListener('click', () => {
        const dobString = dobInput.value;

        if (!dobString) {
            resultParagraph.textContent = "Please enter your date of birth.";
            resultParagraph.style.color = 'red';
            resultSection.classList.remove('hidden');
            return;
        }

        const dob = new Date(dobString);
        const today = new Date();

        // Check for invalid date or future date
        if (isNaN(dob.getTime())) { // Check if date is valid
            resultParagraph.textContent = "Please enter a valid date.";
            resultParagraph.style.color = 'red';
            resultSection.classList.remove('hidden');
            return;
        }
        if (dob > today) {
            resultParagraph.textContent = "Date of birth cannot be in the future.";
            resultParagraph.style.color = 'red';
            resultSection.classList.remove('hidden');
            return;
        }

        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();

        // Adjust months and years if necessary
        if (days < 0) {
            months--;
            // Get the number of days in the *previous* month of the birth date
            const daysInLastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            days += daysInLastMonth;
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        resultParagraph.textContent = `${years} years, ${months} months, ${days} days`;
        resultParagraph.style.color = '#000000'; // Black for the calculated age
        resultSection.classList.remove('hidden'); // Show the result section
        setRandomQuote(); // Change quote every time age is calculated
    });

    // Function to reset the calculator form
    const resetCalculator = () => {
        dobInput.value = ''; // Clear the input
        resultParagraph.textContent = ''; // Clear the result text
        resultSection.classList.add('hidden'); // Hide the result section
        resultParagraph.style.color = ''; // Reset color
    };

    // Event listener for the "Calculate Again" button
    calculateAgainBtn.addEventListener('click', () => {
        resetCalculator();
        dobInput.focus(); // Keep focus on the input for convenience
        setRandomQuote(); // Change quote again when "Calculate Again" is clicked
    });

    // IMPORTANT: Call loadQuotes() when the DOM is ready to populate the quotes array
    loadQuotes();
});