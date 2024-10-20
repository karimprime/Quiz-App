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
            ],
            medium: [
                { question: "What is the atomic number of oxygen?", answers: ["8", "16", "2"], correct: 0 },
                { question: "Which element is represented by the symbol 'Fe'?", answers: ["Iron", "Gold", "Lead"], correct: 0 },
            ],
            hard: [
                { question: "What is the molar mass of carbon dioxide (CO2)?", answers: ["44 g/mol", "28 g/mol", "32 g/mol"], correct: 0 },
                { question: "Which law states that mass cannot be created or destroyed?", answers: ["Law of Conservation of Mass ", "Ideal Gas Law", "Avogadro's Law"], correct: 0 },
            ],
        },
        physics: {
            easy: [
                { question: "What is the formula for force?", answers: ["F=ma", "F=mv", "F=ma^2"], correct: 0 },
                { question: "What is the speed of light?", answers: ["300,000 km/s", "150,000 km/s", "1,000 km/s"], correct: 0 },
            ],
            medium: [
                { question: "What is Newton's second law?", answers: ["F=ma", "E=mc^2", "p=mv"], correct: 0 },
                { question: "What is the unit of work?", answers: ["Joule", "Newton", "Watt"], correct: 0 },
            ],
            hard: [
                { question: "What is the principle of conservation of energy?", answers: ["Energy cannot be created or destroyed", "Energy can be created", "Energy is equal to mass"], correct: 0 },
                { question: "What is the unit of electrical resistance?", answers: ["Ohm", "Volt", "Ampere"], correct: 0 },
            ],
        },
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