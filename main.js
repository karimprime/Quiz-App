// User registration and login data storage
const users = {};
let currentUser = null;
const totalScores = { chemistry: 0, physics: 0 };
const levelScores = { chemistry: { easy: 0, medium: 0, hard: 0 }, physics: { easy: 0, medium: 0, hard: 0 } };

// Handle registration and login on DOM load
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const newUsername = document.getElementById("new-username").value.trim();
            const newPassword = document.getElementById("new-password").value.trim();
            handleRegistration(newUsername, newPassword);
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            handleLogin(username, password);
        });
    }

    if (document.getElementById("quiz-page")) {
        setupQuizPage();
    }
});

// Function to handle user registration
function handleRegistration(username, password) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || {};
    if (storedUsers[username]) {
        document.getElementById("register-error-message").textContent = "Username already exists!";
    } else {
        storedUsers[username] = password;
        localStorage.setItem('users', JSON.stringify(storedUsers));
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html";
    }
}

// Function to handle user login
function handleLogin(username, password) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || {};
    if (storedUsers[username] === password) {
        currentUser = username;
        window.location.href = "quiz.html";
    } else {
        document.getElementById("error-message").textContent = "Invalid username or password!";
    }
}

// Quiz setup
function setupQuizPage() {
    const topicButtons = document.querySelectorAll(".topic-btn");
    const difficultyButtons = document.querySelectorAll(".difficulty-btn");
    const questionPage = document.getElementById("question-page");
    const questionDisplay = document.getElementById("question");
    const answersDisplay = document.getElementById("answers");
    const draftContainer = document.querySelector(".draft-container");
    const draftOptions = document.querySelector(".draft-options");

    if (!topicButtons.length || !difficultyButtons.length || !questionPage || !questionDisplay || !answersDisplay) {
        console.error("One or more required elements are missing in the DOM.");
        return;
    }

    let selectedTopic;
    let selectedLevel;
    let questionsArray = [];
    let timer;
    let currentQuestionIndex = 0;
    let score = 0;
    let draftQuestions = [];

    // Sample questions for each topic and difficulty level
     const questions = {
        chemistry: {
            easy: [
                { question: "What is the chemical formula for water?", answers: ["H2O", "O2", "H2"], correct: 0 },
                { question: "What is the pH level of pure water?", answers: ["7", "14", "0"], correct: 0 },
                { question: "What gas do plants absorb?", answers: ["Oxygen", "Carbon Dioxide", "Nitrogen"], correct: 1 },
                { question: "What is the chemical symbol for gold?", answers: ["Au", "Ag", "Pb"], correct: 0 },
                { question: "What is the most abundant gas in the Earth's atmosphere?", answers: ["Oxygen", "Carbon Dioxide", "Nitrogen"], correct: 2 },
                { question: "What is the chemical formula for table salt?", answers: ["NaCl", "KCl", "CaCl2"], correct: 0 },
                { question: "Which element is a noble gas?", answers: ["Helium", "Hydrogen", "Carbon"], correct: 0 },
                { question: "What is the boiling point of water in Celsius?", answers: ["0", "100", "212"], correct: 1 },
                { question: "What is the primary component of natural gas?", answers: ["Ethane", "Propane", "Methane"], correct: 2 },
                { question: "What is the main ingredient in vinegar?", answers: ["Acetic Acid", "Citric Acid", "Lactic Acid"], correct: 0 },
                { question: "What is the most reactive group of elements?", answers: ["Noble gases", "Alkali metals", "Halogens"], correct: 1 },
                { question: "Which particle has a negative charge?", answers: ["Proton", "Neutron", "Electron"], correct: 2 },
                { question: "What is the atomic number of hydrogen?", answers: ["1", "2", "3"], correct: 0 },
                { question: "Which acid is found in the stomach?", answers: ["Sulfuric Acid", "Hydrochloric Acid", "Nitric Acid"], correct: 1 },
                { question: "What do you call a substance that speeds up a chemical reaction?", answers: ["Catalyst", "Reagent", "Inhibitor"], correct: 0 },
                { question: "What is the main element in organic compounds?", answers: ["Carbon", "Oxygen", "Nitrogen"], correct: 0 },
                { question: "What is the main gas released by burning fossil fuels?", answers: ["Oxygen", "Carbon Dioxide", "Nitrogen"], correct: 1 },
                { question: "What is the chemical formula for glucose?", answers: ["C6H12O6", "C12H22O11", "C6H6"], correct: 0 },
                { question: "What is the hardest natural substance on Earth?", answers: ["Gold", "Diamond", "Iron"], correct: 1 },
                { question: "Which part of the atom contains protons and neutrons?", answers: ["Electron Cloud", "Nucleus", "Orbital"], correct: 1 },
                { question: "What is a common use for sulfuric acid?", answers: ["Battery Acid", "Food Preservative", "Fertilizer"], correct: 0 }
            ],
            medium: [
                { question: "What is the atomic number of oxygen?", answers: ["8", "16", "2"], correct: 0 },
                { question: "Which element is represented by the symbol 'Fe'?", answers: ["Iron", "Gold", "Lead"], correct: 0 },
                { question: "What is the molar mass of carbon dioxide (CO2)?", answers: ["44 g/mol", "28 g/mol", "32 g/mol"], correct: 0 },
                { question: "Which law states that mass cannot be created or destroyed?", answers: ["Law of Conservation of Mass", "Ideal Gas Law", "Avogadro's Law"], correct: 0 },
                { question: "What is the primary oxidation state of phosphorus in phosphoric acid?", answers: ["+3", "+5", "+1"], correct: 1 },
                { question: "Which gas is used in balloon filling?", answers: ["Hydrogen", "Helium", "Nitrogen"], correct: 1 },
                { question: "What is the main component of air?", answers: ["Oxygen", "Nitrogen", "Carbon Dioxide"], correct: 1 },
                { question: "What is the process of a liquid turning into gas?", answers: ["Condensation", "Evaporation", "Sublimation"], correct: 1 },
                { question: "What is the chemical symbol for sodium?", answers: ["Na", "S", "K"], correct: 0 },

                { question: "What is the main use of hydrochloric acid?", answers: ["Cleaning agent", "Food additive", "Battery acid"], correct: 0 },
                { question: "What is the primary type of reaction in cellular respiration?", answers: ["Exothermic", "Endothermic", "Redox"], correct: 2 },
                { question: "What is the term for the amount of solute that can be dissolved in a solvent at a given temperature?", answers: ["Solubility", "Concentration", "Molarity"], correct: 0 },
                { question: "What is the process of converting a solid directly to gas called?", answers: ["Sublimation", "Deposition", "Condensation"], correct: 0 },
                { question: "What is the term for a solution that can resist changes in pH?", answers: ["Buffer", "Acid", "Base"], correct: 0 },
                { question: "What is the primary function of enzymes in biological reactions?", answers: ["Catalysts", "Inhibitors", "Reactants"], correct: 0 }
            ]
        },
        physics: {
            easy: [
                { question: "What is the formula for force?", answers: ["F=ma", "F=mv", "F=ma^2"], correct: 0 },
                { question: "What is the speed of light?", answers: ["300,000 km/s", "150,000 km/s", "1,000 km/s"], correct: 0 },
                { question: "What is the unit of force?", answers: ["Newton", "Joule", "Watt"], correct: 0 },
                { question: "What is the law of universal gravitation?", answers: ["F = G(m1*m2)/r^2", "F = ma", "E = mc^2"], correct: 0 },
                { question: "What is the formula for kinetic energy?", answers: ["KE = 1/2mv^2", "KE = mv^2", "KE = mgh"], correct: 0 },
                { question: "What is the unit of power?", answers: ["Watt", "Joule", "Newton"], correct: 0 },
                { question: "What is the acceleration due to gravity?", answers: ["9.8 m/s^2", "8.3 m/s^2", "10 m/s^2"], correct: 0 },
                { question: "What is the principle of conservation of energy?", answers: ["Energy cannot be created or destroyed", "Energy can be created", "Energy is equal to mass"], correct: 0 },
                { question: "What is the unit of work?", answers: ["Joule", "Newton", "Watt"], correct: 0 },
                { question: "What is the measure of an object's resistance to changes in its motion?", answers: ["Mass", "Weight", "Force"], correct: 0 },
                { question: "What type of energy is associated with motion?", answers: ["Kinetic Energy", "Potential Energy", "Mechanical Energy"], correct: 0 },
                { question: "What is the term for the bending of light as it passes through different mediums?", answers: ["Refraction", "Reflection", "Diffraction"], correct: 0 },
                { question: "What is the term for the energy stored in an object due to its position?", answers: ["Potential Energy", "Kinetic Energy", "Mechanical Energy"], correct: 0 },
                { question: "What is the process of energy transfer through direct contact called?", answers: ["Conduction", "Convection", "Radiation"], correct: 0 },
                { question: "What is the formula for density?", answers: ["Density = Mass/Volume", "Density = Volume/Mass", "Density = Mass x Volume"], correct: 0 },
                { question: "What is the basic unit of charge?", answers: ["Coulomb", "Ampere", "Volt"], correct: 0 },
                { question: "What is the unit of frequency?", answers: ["Hertz", "Joule", "Watt"], correct: 0 },
                { question: "What is the law of inertia?", answers: ["An object in motion stays in motion", "For every action, there is an equal reaction", "Energy cannot be created or destroyed"], correct: 0 },
                { question: "What is the term for the force exerted by a surface that supports the weight of an object?", answers: ["Normal Force", "Friction", "Tension"], correct: 0 },
                { question: "What is the unit of temperature in the SI system?", answers: ["Celsius", "Fahrenheit", "Kelvin"], correct: 2 },
                { question: "What is the primary force that causes objects to fall toward the Earth?", answers: ["Gravity", "Friction", "Tension"], correct: 0 }
            ],
            medium: [

                { question: "What is Newton's second law?", answers: ["F=ma", "E=mc^2", "p=mv"], correct: 0 },
                { question: "What is the unit of work?", answers: ["Joule", "Newton", "Watt"], correct: 0 },
                { question: "What is the formula for potential energy?", answers: ["PE = mgh", "PE = 1/2mv^2", "PE = Fd"], correct: 0 },
                { question: "What is the principle of conservation of momentum?", answers: ["Momentum cannot be created or destroyed", "Momentum can be created", "Momentum is the same as energy"], correct: 0 },
                { question: "What is the formula for gravitational potential energy?", answers: ["PE = mgh", "PE = 1/2mv^2", "PE = Fd"], correct: 0 },
                { question: "What is the term for the distance traveled per unit of time?", answers: ["Speed", "Velocity", "Acceleration"], correct: 0 },
                { question: "What is the unit of pressure?", answers: ["Pascal", "Bar", "Newton"], correct: 0 },
                { question: "What is the term for the amount of matter in an object?", answers: ["Mass", "Weight", "Volume"], correct: 0 },
                { question: "What is the force that opposes motion between two surfaces in contact?", answers: ["Friction", "Gravity", "Tension"], correct: 0 },
                { question: "What is the formula for momentum?", answers: ["p = mv", "p = ma", "p = Fd"], correct: 0 },
                { question: "What is the SI unit for electric current?", answers: ["Ampere", "Coulomb", "Volt"], correct: 0 },
                { question: "What is the principle of buoyancy?", answers: ["An object will float if it displaces its weight of fluid", "An object will sink if it is denser than fluid", "Both of the above"], correct: 0 },
                { question: "What is the law of reflection?", answers: ["Angle of incidence equals angle of reflection", "Light travels in straight lines", "Both of the above"], correct: 0 },
                { question: "What is the formula for the period of a pendulum?", answers: ["T = 2π√(L/g)", "T = 2πf", "T = g/L"], correct: 0 },
                { question: "What is the term for the rate of change of velocity?", answers: ["Acceleration", "Velocity", "Speed"], correct: 0 },
                { question: "What is the formula for wave speed?", answers: ["v = fλ", "v = A/T", "v = m/a"], correct: 0 },
                { question: "What is the term for the bending of waves around obstacles?", answers: ["Diffraction", "Interference", "Refraction"], correct: 0 },
                { question: "What is the unit of energy?", answers: ["Joule", "Calorie", "Watt"], correct: 0 },
                { question: "What is the unit of torque?", answers: ["Newton-meter", "Joule", "Watt"], correct: 0 },
                { question: "What is the term for the total energy of an object due to its motion and position?", answers: ["Mechanical Energy", "Kinetic Energy", "Potential Energy"], correct: 0 }
            ],
            hard: [
                { question: "What is the principle of conservation of energy?", answers: ["Energy cannot be created or destroyed", "Energy can be created", "Energy is equal to mass"], correct: 0 },
                { question: "What is the unit of electrical resistance?", answers: ["Ohm", "Volt", "Ampere"], correct: 0 },
                { question: "What is the Doppler effect?", answers: ["Change in frequency due to motion", "Change in amplitude due to distance", "Change in energy due to mass"], correct: 0 },
                { question: "What is the term for the energy of a body due to its motion?", answers: ["Kinetic Energy", "Potential Energy", "Mechanical Energy"], correct: 0 },
                { question: "What is the formula for gravitational force?", answers: ["F = G(m1*m2)/r^2", "F = ma", "F = mgh"], correct: 0 },
                { question: "What is the term for the study of the relationship between heat and other forms of energy?", answers: ["Thermodynamics", "Kinetics", "Dynamics"], correct: 0 },
                { question: "What is the name of the effect that explains how light bends when it passes through a lens?", answers: ["Refraction", "Reflection", "Diffraction"], correct: 0 },

                { question: "What is the term for the ratio of the output force to the input force in a machine?", answers: ["Mechanical Advantage", "Efficiency", "Work"], correct: 0 },
                { question: "What is the law of conservation of charge?", answers: ["Charge cannot be created or destroyed", "Charge can be created", "Charge is the same as mass"], correct: 0 },
                { question: "What is the term for the motion of objects in circular paths?", answers: ["Circular Motion", "Rotational Motion", "Linear Motion"], correct: 0 },
                { question: "What is the study of forces and their effects on motion?", answers: ["Dynamics", "Kinematics", "Statics"], correct: 0 },
                { question: "What is the principle of superposition in wave theory?", answers: ["The total displacement is the sum of individual displacements", "Waves cannot interfere with each other", "Waves only travel in one direction"], correct: 0 },
                { question: "What is the unit of angular momentum?", answers: ["kg*m^2/s", "kg*m/s", "kg*m/s^2"], correct: 0 },
                { question: "What is the term for the motion of an object in a straight line?", answers: ["Linear Motion", "Rotational Motion", "Curvilinear Motion"], correct: 0 },
                { question: "What is the law of thermodynamics that states energy cannot be created or destroyed?", answers: ["First Law", "Second Law", "Third Law"], correct: 0 },
                { question: "What is the principle behind the operation of a hydraulic lift?", answers: ["Pascal's Principle", "Archimedes' Principle", "Bernoulli's Principle"], correct: 0 },
                { question: "What is the term for the maximum displacement of a wave from its rest position?", answers: ["Amplitude", "Wavelength", "Frequency"], correct: 0 },
                { question: "What is the formula for calculating pressure?", answers: ["Pressure = Force/Area", "Pressure = Area/Force", "Pressure = Force*Area"], correct: 0 },
                { question: "What is the term for the transfer of heat without direct contact?", answers: ["Radiation", "Conduction", "Convection"], correct: 0 }
            ],
        }
    };

    // Topic selection
    topicButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedTopic = button.dataset.topic;
            document.getElementById("topics").classList.add("hidden");
            document.getElementById("logout-btn").classList.add("hidden");
            document.getElementById("difficulty-levels").classList.remove("hidden");
        });
    });

    // Difficulty selection
    difficultyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedLevel = button.dataset.level;
            startQuiz();
            document.getElementById("difficulty-levels").classList.add("hidden");
        });
    });

    function startQuiz() {
        resetQuizState();
        questionsArray = questions[selectedTopic][selectedLevel];
        currentQuestionIndex = 0;
        score = 0;
        questionPage.classList.remove("hidden");
        displayQuestion();
        startTimer();
    }

    function resetQuizState() {
        document.getElementById("end-options").classList.add("hidden");
        questionPage.classList.remove("hidden");
        currentQuestionIndex = 0;
        score = 0;
    }

    function startTimer() {
        let timeLeft = 60;
        document.getElementById("timer").innerHTML = `<span class="material-symbols-outlined">timer</span>${timeLeft}s`;

        timer = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timer);
                endQuiz();
            } else {
                timeLeft--;
                document.getElementById("timer").innerHTML = `<span class="material-symbols-outlined">timer</span>${timeLeft}s`;
            }
        }, 1000);
    }

    function displayQuestion() {
        const currentQuestion = questionsArray[currentQuestionIndex];
        questionDisplay.textContent = currentQuestion.question;
        answersDisplay.innerHTML = ""; // Clear previous answers

        // Create buttons for each answer
        currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.onclick = () => checkAnswer(index); // Ensure checkAnswer function is defined
            answersDisplay.appendChild(button);
        });

        // Show or hide the skip button based on the position
        if (currentQuestionIndex >= questionsArray.length - 1) {
            document.getElementById("skip-btn").style.display = "none"; // Hide if on last question
        } else {
            document.getElementById("skip-btn").style.display = "block";
        }
    }

    function checkAnswer(selectedIndex) {
        const currentQuestion = questionsArray[currentQuestionIndex];
        if (selectedIndex === currentQuestion.correct) {
            score++; // Increment score for the correct answer
        }

        currentQuestionIndex++; // Move to the next question

        if (currentQuestionIndex < questionsArray.length) {
            displayQuestion(); // Display the next question
        } else {
            // No more regular questions, check if drafts need to be shown
            if (draftQuestions.length > 0) {
                switchToDraftMode(); // Switch to draft mode
            } else {
                endQuiz(); // End the quiz if no drafts are left
            }
        }
    }

    function switchToDraftMode() {
        // Hide regular question container and show draft container
        questionPage.classList.add("hidden");
        draftContainer.style.display = "block";
        draftOptions.innerHTML = "";
        showDraftQuestions();
        
        // Ensure the timer remains visible during draft questions phase
        const timerElement = document.getElementById("timer");
        timerElement.style.display = "block"; // Show timer when switching to draft mode
    }

    // Display draft questions only
    function showDraftQuestions() {
        draftOptions.innerHTML = "";
        
        if (draftQuestions.length === 0) {
            draftOptions.textContent = "No skipped questions available.";
            return;
        }
    
        // Display each draft question
        draftQuestions.forEach((draft, index) => {
            const draftItem = document.createElement("li");
            draftItem.textContent = draft.question;
    
            draft.answers.forEach((answer, ansIndex) => {
                const answerButton = document.createElement("button");
                answerButton.textContent = answer;
                answerButton.onclick = () => {
                    checkDraftAnswer(ansIndex, draft.correct, index);
                };
                draftItem.appendChild(answerButton);
            });
    
            draftOptions.appendChild(draftItem);
        });
    
        // Ensure the timer is visible when showing draft questions
        const timerElement = document.getElementById("timer");
        timerElement.style.display = "block"; // Ensure timer is visible
    }
    function checkDraftAnswer(selectedIndex, correctIndex, draftIndex) {
        if (selectedIndex === correctIndex) {
            score++; // Increment score if the answer is correct
        }

        // Remove the answered question from drafts
        draftQuestions.splice(draftIndex, 1);

        // Check if there are more drafts left
        if (draftQuestions.length > 0) {
            showDraftQuestions(); // Continue showing drafts
        } else if (draftQuestions.length === 0 && currentQuestionIndex >= questionsArray.length) {
            endQuiz(); // End quiz if no more drafts and all regular questions are done
        }
    }


    document.getElementById("skip-btn").addEventListener("click", () => {
        draftQuestions.push(questionsArray[currentQuestionIndex]);
        currentQuestionIndex++;
        if (currentQuestionIndex < questionsArray.length) {
            displayQuestion(); // Display the next question if there are still questions
        } else {
            switchToDraftMode(); // Switch to draft mode instead of ending the quiz
        }
    });

    document.querySelector(".show-draft-btn").addEventListener("click", () => {
        const draftContainer = document.querySelector(".draft-container");
        const draftOptions = document.querySelector(".draft-options");

        // Show timer when switching to draft questions
        const timerElement = document.getElementById("timer");
        timerElement.style.display = "block"; // Show timer

        showDraftQuestions(); // Show the draft questions
        document.getElementById("skip-btn").style.display = "none"; // Hide skip button
        draftContainer.style.display = "block"; // Display the draft container

        if (draftQuestions.length === 0) {
            draftOptions.textContent = "No skipped questions available.";
            draftContainer.style.display = "block";
            return;
        }

        draftQuestions.forEach((draft, index) => {
            const draftItem = document.createElement("li");
            draftItem.textContent = draft.question;

            draft.answers.forEach((answer, ansIndex) => {
                const answerButton = document.createElement("button");
                answerButton.textContent = answer;
                answerButton.onclick = () => {
                    checkDraftAnswer(ansIndex, draft.correct, index);
                };
                draftItem.appendChild(answerButton);
            });

            draftOptions.appendChild(draftItem);
        });

        draftContainer.style.display = "block";
        document.getElementById("skip-btn").style.display = "none";
    });

    function endQuiz() {
        if (draftQuestions.length > 0) return; // Prevent quiz from ending if drafts are not answered
        clearInterval(timer);
        questionPage.classList.add("hidden");
        document.getElementById("logout-btn").classList.remove("hidden");
        document.getElementById("end-options").classList.remove("hidden");
        document.querySelector(".show-draft-btn").style.display = "none";
        draftContainer.style.display = "none";
        evaluateScore();
        updateScores();
    }

    function updateScores() {
        if (selectedTopic === "chemistry") {
            totalScores.chemistry += score;
            levelScores.chemistry[selectedLevel] += score;
            document.getElementById("chemistry-score").textContent = totalScores.chemistry;
            document.getElementById(`chemistry-${selectedLevel}`).textContent = levelScores.chemistry[selectedLevel];
        } else if (selectedTopic === "physics") {
            totalScores.physics += score;
            levelScores.physics[selectedLevel] += score;
            document.getElementById("physics-score").textContent = totalScores.physics;
            document.getElementById(`physics-${selectedLevel}`).textContent = levelScores.physics[selectedLevel];
        }

        document.getElementById("final-score").textContent = score;
    }

    function evaluateScore() {
        let evaluationMessage = "";
        if (score === 0) {
            evaluationMessage = "Fair";
        } else if (score === 1) {
            evaluationMessage = "Good";
        } else {
            evaluationMessage = "Excellent";
        }
        document.getElementById("evaluation-text").textContent = evaluationMessage;
    }

    document.getElementById("back-to-topics").addEventListener("click", () => {
        document.getElementById("end-options").classList.add("hidden");
        document.getElementById("topics").classList.remove("hidden");
        document.getElementById("difficulty-levels").classList.add("hidden");
        resetScores();
        resetDrafts();
    });

    function resetScores() {
        document.getElementById("final-score").textContent = "0";
        document.getElementById("chemistry-score").textContent = "0";
        document.getElementById("physics-score").textContent = "0";
        document.getElementById("chemistry-easy").textContent = "0";
        document.getElementById("chemistry-medium").textContent = "0";
        document.getElementById("chemistry-hard").textContent = "0";
        document.getElementById("physics-easy").textContent = "0";
        document.getElementById("physics-medium").textContent = "0";
        document.getElementById("physics-hard").textContent = "0";
    }

    function resetDrafts() {
        draftQuestions = [];
        document.querySelector(".draft-options").innerHTML = "";
        document.querySelector(".draft-container").style.display = "none";
    }
}
