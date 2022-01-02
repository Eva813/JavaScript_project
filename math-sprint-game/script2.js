//表格
const startForm =document.getElementById('start-form');
const radioContainer= document.querySelectorAll('.radio-container');
const selectionFooter =document.querySelector('.selection-footer');
const radioInputs = document.querySelectorAll('input');
//倒數
const countdownPage = document.getElementById('countdown-page');
const splashPage = document.getElementById('splash-page');
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');

const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');
const bestScores = document.querySelectorAll('.best-score-value');

//步驟拆解:
//1.讓點選的按鈕，可以有背景色彩效果
//2.提交選擇好的選項(要取得input的值，運用checked)
//3.選好項目之後，要進入倒數頁面
//4.到數完之後，要可以跳轉到遊戲畫面並開始選擇

let questionAmount= 0; //此數值將在不同的函式中被使用
let equationsArray = [];
let playerGuessArray=[]; //儲存玩家點擊按鈕的資料
let bestScoreArray = [];

//遊戲的預設
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat=[];


//呈現遊戲畫面
function showGamePage(){
  gamePage.hidden = false;
  playAgainBtn.hidden = false;
  countdownPage.hidden = true;
  
}

//Time
let timer;  //呈現我們要開始與結束的區間
let timePlayed = 0; //
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';


//scroll
let valueY =0;

// 更新分數高的畫面
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore; //取得DOM 元素
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

//檢查得分最高
function getSavedBestScores(){
  //存在localStorage
  if(localStorage.getItem('bestScore')){
    bestScoreArray = JSON.parse(localStorage.bestScore);
    // console.log('1',localStorage.bestScore)
    // console.log('2',localStorage.getItem('bestScore'))
  }else{
    bestScoreArray=[
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ]
    localStorage.setItem('bestScore', JSON.stringify(bestScoreArray))
  }
  // Update Splash Page
  bestScoresToDOM();

}

//更新分數 array 
// function updateBestScore(){
//   bestScoreArray.forEach((score,index)=>{
//     if(questionAmount == score.questions){
//       //返回最好的分數
//       const savedBestScore = Number(bestScoreArray[index].bestScore);
      
//       if (savedBestScore === 0 || savedBestScore > finalTime) {
//         bestScoreArray[index].bestScore = finalTimeDisplay;
//       }
//       console.log(savedBestScore)
//     }

//   });
  
//   bestScoresToDOM();
//     // Save to Local Storage
//   localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
// }

// Update Best Score Array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select correct Best Score to update
    if (questionAmount == score.questions) {
      // Return Best Score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Update Splash Page
  bestScoresToDOM();
  // Save to Local Storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}



//遊戲
function playAgain(){
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden =false;
  equationsArray = [];
  playerGuessArray=[];
  valueY =0;
  playAgainBtn.hidden = true;
}

//showScore Page
function showScorePage (){
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  scorePage.hidden =false;
  gamePage.hidden = true;
}

//呈現時間與分數的頁面
function scoresToDOM(){
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent= `Base Time: ${baseTime}`;
  penaltyTimeEl.textContent =`Penalty: + ${penaltyTime}`;
  finalTimeEl.textContent =`${finalTimeDisplay}s`;

  updateBestScore();
  //滾動到最上方
  itemContainer.scroll({top: 0, behavior:'instant'});
  showScorePage ()

}

//(3)要設定停止的時間，進行結果的呈現\進入scorePage
function checkTime(){
  //console.log('timePlayed',timePlayed)
  if(playerGuessArray.length == questionAmount){
    console.log('player guess', playerGuessArray)
    console.log('answer',equationsArray[1].evaluated)
    clearInterval(timer)
    //用正確答案去核對玩家的答案
    equationsArray.forEach((item,i)=>{
      // console.log(item,i)
      // console.log(item.evaluated === playerGuessArray[i])
      if(item.evaluated !== playerGuessArray[i]){
        //加五秒
        penaltyTime +=0.5;
      }

    });
    finalTime = timePlayed + penaltyTime;
    console.log('time:', timePlayed, 'penalty:', penaltyTime, 'final:', finalTime);
    scoresToDOM();
  }
}




//(2)每0.1秒計算
function addTime (){
  timePlayed += 0.1; //每次執行此函式，我們都會增加timePlayed的值0.1
  checkTime()
}

//(1)當遊戲頁面被點擊時，開始計時
function startTimer(){
  //重置
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  //setInterval 每個區間重複 執行某函式(開始加時間)
  timer = setInterval(addTime, 100);
  //當進入此函式開始計算秒數後，要記得移除監聽事件
  gamePage.removeEventListener('click',startTimer)
  
}


//滾動\儲存
function select(guessedTrue){
  
  //每次滾動Y，以80px
  valueY += 80;
  itemContainer.scroll(0,valueY);
  //將玩家的答案存到array中
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false')

}


//取得要執行random 的最大值 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//製作99乘法
function createEquations(){
  //隨機選擇正確的數量
  const correctEquations = getRandomInt(questionAmount);
  console.log('correct',correctEquations)
  //取得錯誤程式數量
  const wrongEquations = questionAmount-correctEquations;
  console.log('wrong',wrongEquations)
  //製作隨機的99乘法  (正確的99乘法)
  for(let i=0; i<correctEquations;i++){
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = {value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  for(let i = 0 ; i<wrongEquations;i++ ){
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] =`${firstNumber} x ${secondNumber+1} = ${equationValue}`;
    wrongFormat[1]= `${firstNumber+1} x ${secondNumber} = ${equationValue}`;
    wrongFormat[2]= `${firstNumber} x ${secondNumber} = ${equationValue+1}`;
    const formatChoice = getRandomInt(2);
    const equation = wrongFormat[formatChoice];
    equationObject = {value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
    
  }
  shuffle(equationsArray)
  // console.log('e-array', equationsArray)
  // equationsToDOM();
}

function equationsToDOM(){
  //append those element 到容器
  equationsArray.forEach((equation)=>{
    const equationItem = document.createElement('div');
    equationItem.classList.add('item');
    //文字
    const equationTitle = document.createElement('h1');
    equationTitle.textContent = equation.value;
    equationItem.appendChild(equationTitle);
    itemContainer.appendChild(equationItem);
  });
  
}

//在scroll 的list上方加入div
function populateGamePage() {
    // Reset DOM, Set Blank Space Above
    itemContainer.textContent = '';

  //上方加入空間
  const topSpace = document.createElement('div');
  topSpace.classList.add('height-240');
  //選到的項目
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  itemContainer.append(topSpace,selectedItem);
    // Create Equations, Build Elements in DOM
    createEquations();
    equationsToDOM();
  //下方空白
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
  
}



function chooseQuestion (){
  //console.log(radioContainer)
  radioContainer.forEach((item,i)=>{
    //Remove 要記得每次執行完要reset
    item.classList.remove('selected-label')
    //console.log(item.children[1].checked);
    if(item.children[1].checked){
      item.classList.add('selected-label')
    }
  })
} 

//取得點擊的input 的值
function getSelected (){
  let selectedValue;
  radioInputs.forEach((radioInput)=>{
    //console.log(radioInput.checked)
    if(radioInput.checked){
      selectedValue = radioInput.value;
      //return selectedValue; //使用breakpoint 檢查，因為回傳的結果放在loop裡面
    }
  });
  return selectedValue;
  
}

//自己寫的:
// function countDown (){
//   let timeLeft = 3;
//   setInterval(function(){
//     if(timeLeft <= 0){
//       clearInterval(countDown);
//       countdown.textContent = 'GO!'
//     }else{
//       countdown.textContent = timeLeft;
//       timeLeft--
//     }
//   },1000)
// }

function countDown (){
  let countDownNumber = 3;
  countdown.textContent = countDownNumber;
  const timeCountdown = setInterval(() => {
    //先去減秒數
    countDownNumber--;
    if(countDownNumber === 0){
      countdown.textContent = 'GO!'
    }else if (countDownNumber === -1){
      showGamePage();
      clearInterval(timeCountdown);
    }else{
      countdown.textContent = countDownNumber;
    }
  },1000);
  // countdown.textContent = '3';
  // setTimeout(() => {
  //   countdown.textContent = '2';
  // }, 1000);
  // setTimeout(() => {
  //   countdown.textContent = '1';
  // }, 2000);
  // setTimeout(() => {
  //   countdown.textContent = 'GO!';
  // }, 3000);
}





function toCountdownPage(){
  //要確定有選項才能進入
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countDown();
  // createEquations();
  
  

}


function submitFormQuestion(e){
  e.preventDefault();
  //要嘗試取得點選到的 value of input
  console.log(e);
  questionAmount = getSelected();
  //console.log('value',questionAmount)
  //在取得選項之後，要跳轉進入countDownPage(注意要先檢查是否有選值)
  if(questionAmount){
    toCountdownPage();
  }
  ;

}

startForm.addEventListener('click',chooseQuestion);
startForm.addEventListener('submit',submitFormQuestion);
gamePage.addEventListener('click',startTimer);
getSavedBestScores();