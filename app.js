let solution = [];
let selectedCell = null;  // 選択されたセルを追跡
let timerInterval;
let timeRemaining = 60;  // 初期は60秒

function startTimer() {
    clearInterval(timerInterval);
    timeRemaining = 60;
    document.getElementById('time').textContent = timeRemaining;

    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('time').textContent = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            document.getElementById('message-container').textContent = '時間切れ！新しい問題を始めます。';
            setTimeout(() => {
                generateSudoku('easy');  // 時間切れ後、新しい簡単な問題を生成
            }, 2000);
        }
    }, 1000);
}

function generateSudoku(difficulty = 'easy') {
    document.getElementById('message-container').innerHTML = ''; // メッセージをクリア
    document.getElementById('sudoku-container').innerHTML = '';  // グリッドをクリア

    startTimer();  // タイマーをリセットして開始

    solution = generateSolution();  // 正解の数独を生成
    const emptyRate = difficulty === 'easy' ? 0.5 : difficulty === 'medium' ? 0.6 : 0.7; // 難易度に応じて空白率を変更

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.classList.add('sudoku-cell');
            cell.dataset.row = i;
            cell.dataset.col = j;

            // 難易度に応じた空白率を適用
            if (Math.random() > emptyRate) {
                cell.textContent = solution[i][j];
                cell.classList.add('fixed-cell'); // 固定のセル
            } else {
                cell.addEventListener('click', () => selectCell(cell)); // セルをクリックすると選択
            }

            document.getElementById('sudoku-container').appendChild(cell);
        }
    }
}

function generateSolution() {
    const sudoku = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
    return sudoku;
}

function selectCell(cell) {
    if (selectedCell) {
        selectedCell.classList.remove('selected-cell'); // 以前の選択を解除
    }
    selectedCell = cell;
    selectedCell.classList.add('selected-cell');  // 新しいセルを選択
}

function selectNumber(number) {
    if (selectedCell && !selectedCell.classList.contains('fixed-cell')) {
        selectedCell.textContent = number;  // 選択されたセルに数字をセット
    }
}

function checkSolution() {
    const cells = document.querySelectorAll('.sudoku-cell');
    let isCorrect = true;

    cells.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;

        if (!cell.classList.contains('fixed-cell') && parseInt(cell.textContent) !== solution[row][col]) {
            cell.style.backgroundColor = 'red'; // 間違っているセルを赤色に
            isCorrect = false;
        } else {
            cell.style.backgroundColor = ''; // 正しいセルは背景色を元に戻す
        }
    });

    if (isCorrect) {
        clearInterval(timerInterval); // タイマーを停止
        document.getElementById('message-container').innerHTML = 'おめでとう！難易度アップ！';
        setTimeout(() => {
            let nextDifficulty = 'medium';  // 次の難易度を中級に設定
            if (timeRemaining > 40) {
                nextDifficulty = 'hard';  // 時間が余っていれば難易度を「難しい」に設定
            }
            generateSudoku(nextDifficulty);  // 次の問題を生成
        }, 2000);
    } else {
        document.getElementById('message-container').innerHTML = '間違いがあります。';
    }
}

// 初回の数独を生成
generateSudoku('easy');  // 最初は簡単な問題からスタート
