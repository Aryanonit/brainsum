class ArithmeticGame {
    constructor() {
        this.score = 0;
        this.timeLeft = 60;
        this.isPlaying = false;
        this.difficulty = 'easy';
        this.timer = null;
        this.history = [];

        // DOM elements
        this.problemEl = document.getElementById('problem');
        this.answerEl = document.getElementById('answer');
        this.submitBtn = document.getElementById('submit-btn');
        this.scoreEl = document.getElementById('score');
        this.timerEl = document.getElementById('timer');
        this.historyEl = document.getElementById('history');
        this.startModal = document.getElementById('start-modal');
        this.startBtn = document.getElementById('start-btn');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');

        this.initializeEventListeners();
        this.showStartModal();
    }

    initializeEventListeners() {
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.answerEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
        this.startBtn.addEventListener('click', () => this.startGame());
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficultyBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.difficulty = btn.dataset.difficulty;
            });
        });
    }

    showStartModal() {
        this.startModal.style.display = 'flex';
    }

    hideStartModal() {
        this.startModal.style.display = 'none';
    }

    startGame() {
        this.hideStartModal();
        this.score = 0;
        this.timeLeft = 60;
        this.isPlaying = true;
        this.history = [];
        this.historyEl.innerHTML = '';
        this.updateScore();
        this.generateProblem();
        this.startTimer();
        this.answerEl.focus();
    }

    generateProblem() {
        let num1, num2, operator;
        const operators = ['+', '-', '*'];

        switch(this.difficulty) {
            case 'easy':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                operator = operators[Math.floor(Math.random() * 2)]; // Only + and -
                break;
            case 'medium':
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
                operator = operators[Math.floor(Math.random() * 3)];
                break;
            case 'hard':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                operator = operators[Math.floor(Math.random() * 3)];
                break;
        }

        let answer;
        switch(operator) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '*': answer = num1 * num2; break;
        }

        this.currentProblem = {
            question: `${num1} ${operator} ${num2}`,
            answer: answer
        };

        this.problemEl.textContent = `${this.currentProblem.question} = ?`;
        this.answerEl.value = '';
    }

    checkAnswer() {
        if (!this.isPlaying) return;

        const userAnswer = parseInt(this.answerEl.value);
        if (isNaN(userAnswer)) return;

        const isCorrect = userAnswer === this.currentProblem.answer;
        if (isCorrect) this.score += 1;

        this.addToHistory(this.currentProblem.question, userAnswer, this.currentProblem.answer, isCorrect);
        this.updateScore();
        this.generateProblem();
    }

    addToHistory(problem, userAnswer, correctAnswer, isCorrect) {
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${isCorrect ? 'correct' : 'wrong'}`;
        historyItem.innerHTML = `
            <span>${problem} = ${userAnswer}</span>
            ${!isCorrect ? `<span>(Correct: ${correctAnswer})</span>` : ''}
        `;
        this.historyEl.insertBefore(historyItem, this.historyEl.firstChild);
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft -= 1;
            this.timerEl.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.timer);
        this.isPlaying = false;
        this.problemEl.textContent = `Game Over! Final Score: ${this.score}`;
        setTimeout(() => this.showStartModal(), 2000);
    }

    updateScore() {
        this.scoreEl.textContent = this.score;
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    const game = new ArithmeticGame();
});