document.addEventListener('DOMContentLoaded', () => {
    const pacmoon = document.getElementById('pacmoon');
    const gameArea = document.getElementById('gameArea');
    const scoreBoard = document.getElementById('score');
    const highScoreBoard = document.getElementById('highScore');
    const coinSound = document.getElementById('coinSound');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const timerElement = document.getElementById('timer');
    const replayButton = document.getElementById('replayButton');
    const soundButton = document.getElementById('soundButton');
    const startButton = document.getElementById('startButton');
    coinSound.volume = 0.5; // Adjust coin sound volume
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    highScoreBoard.innerText = highScore;
    let keys = {};
    let speed = 5;
    let superCoinFrequency = 0.1;
    let coinSpawnInterval = 800; // Increased coin spawn rate
    let gameInterval;
    let timerInterval;
    let gameDuration = 45;
    let isSoundOn = true;

    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        replayButton.style.display = 'block';
        soundButton.style.display = 'block';
        backgroundMusic.play();
        startGame();
    });

    replayButton.addEventListener('click', () => {
        location.reload();
    });

    soundButton.addEventListener('click', () => {
        if (isSoundOn) {
            backgroundMusic.pause();
            soundButton.innerText = "Sound On";
        } else {
            backgroundMusic.play();
            soundButton.innerText = "Sound Off";
        }
        isSoundOn = !isSoundOn;
    });

    function movePacmoon() {
        const left = parseInt(window.getComputedStyle(pacmoon).getPropertyValue('left'));
        if (keys['ArrowLeft'] && left > 0) {
            pacmoon.style.left = left - speed + 'px';
        }
        if (keys['ArrowRight'] && left < 350) {
            pacmoon.style.left = left + speed + 'px';
        }
    }

    function startGame() {
        gameInterval = setInterval(createCoin, coinSpawnInterval);
        setInterval(movePacmoon, 20);
        setInterval(increaseDifficulty, 10000); // Increase difficulty every 10 seconds
        startTimer();
    }

    function startTimer() {
        timerElement.innerText = gameDuration;
        timerInterval = setInterval(() => {
            gameDuration--;
            timerElement.innerText = gameDuration;
            if (gameDuration <= 0) {
                clearInterval(timerInterval);
                clearInterval(gameInterval);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        backgroundMusic.pause();
        replayButton.style.display = 'block';
    }

    function createCoin() {
        const coinType = Math.random() < superCoinFrequency ? 'supercoin' : 'coin';
        const coin = document.createElement('div');
        coin.classList.add(coinType);
        coin.style.left = Math.floor(Math.random() * 350) + 'px';
        gameArea.appendChild(coin);
        moveCoin(coin, coinType);
    }

    function moveCoin(coin, coinType) {
        let coinInterval = setInterval(() => {
            const top = parseInt(window.getComputedStyle(coin).getPropertyValue('top'));
            const coinSpeed = coinType === 'supercoin' ? 10 : 5;
            if (top >= 550) {
                clearInterval(coinInterval);
                gameArea.removeChild(coin);
            } else {
                coin.style.top = top + coinSpeed + 'px';
            }

            const coinLeft = parseInt(window.getComputedStyle(coin).getPropertyValue('left'));
            const pacmoonLeft = parseInt(window.getComputedStyle(pacmoon).getPropertyValue('left'));
            const coinTop = parseInt(window.getComputedStyle(coin).getPropertyValue('top'));
            const pacmoonTop = parseInt(window.getComputedStyle(pacmoon).getPropertyValue('top'));

            if (coinTop + 30 >= pacmoonTop && coinLeft >= pacmoonLeft && coinLeft <= pacmoonLeft + 50) {
                clearInterval(coinInterval);
                gameArea.removeChild(coin);
                if (coinType === 'supercoin') {
                    coinSound.currentTime = 0; // Reset the sound to play again
                    coinSound.play();
                    score += 5; // Supercoin gives 5 points
                } else {
                    score++;
                }
                scoreBoard.innerText = score;
                if (score > highScore) {
                    highScore = score;
                    highScoreBoard.innerText = highScore;
                    localStorage.setItem('highScore', highScore);
                }
            }
        }, 20);
    }

    function increaseDifficulty() {
        speed += 1;
        superCoinFrequency += 0.05;
        coinSpawnInterval = Math.max(coinSpawnInterval - 50, 200); // Ensure spawn interval does not go below 200ms
    }
});
