
const cardsContainer = document.getElementById('cards-container');
const currentEl = document.getElementById('current');

const showBtn = document.getElementById('show');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const addContainer = document.getElementById('add-container');
const addCardBtn = document.getElementById('add-card');

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const clearBtn = document.getElementById('clear');
const hideBtn = document.getElementById('hide');
const innerCardFront = document.getElementById('newDiv');
const checkBoxes = document.querySelectorAll('.checkbox')





//要有一個數字追蹤要呈現的卡片 currentActiveCard
let currentActiveCard = 0;

//1.儲存呈現DOM elements 的cards,2.儲存卡片內的資料
const cardEl =[];
let cardsData =[];
// const cardsData =[
//   {
//     question: 'What must a variable begin with?',
//     answer: 'A letter, $ or _'
//   },
//   {
//     question: 'What is a variable?',
//     answer: 'Container for a piece of data'
//   },
//   {
//     question: 'Example of Case Sensitive Variable',
//     answer: 'thisIsAVariable'
//   }
// ];



function showCardToDom (){
  console.log(cardsData);
  cardsContainer.textContent ='';
  cardsData.forEach((card,i)=>{
    //console.log(card)
    const cardItem = document.createElement('div');
    cardItem.classList.add('card');
    if (i === 0) {
      cardItem.classList.add('active');
    }
    
    const innerCard = document.createElement('div');
    innerCard.classList.add('inner-card');

    const innerCardFront = document.createElement('div');
    innerCardFront.classList.add('inner-card-front');
    innerCardFront.setAttribute("id", "newDiv");
    const forontP = document.createElement('p');
    forontP.textContent = card.question;
    const checkBox = document.createElement('input');
    checkBox.setAttribute('type','radio');
    checkBox.classList.add('checkbox');
    checkBox.setAttribute('onClick',`deleteCard(${i})`);

    

    const innerCardBack = document.createElement('div');
    innerCardBack.classList.add('inner-card-back');
    const BackP = document.createElement('p');
    BackP.textContent = card.answer;

    innerCardFront.append(forontP,checkBox);
    innerCardBack.appendChild(BackP);
    innerCard.append(innerCardFront,innerCardBack);
    cardItem.appendChild(innerCard);
    cardsContainer.appendChild(cardItem);

    const afterStyle = Array.from(window.getComputedStyle(document.getElementById('newDiv'), ":after"));
    //console.log(afterStyle)
    cardItem.addEventListener('click',()=>{
      cardItem.classList.toggle('show-answer')
    })
    cardEl.push(cardItem);
    //console.log(cardEl)
  })
  
}

function showCurrentPage (){
  currentEl.textContent =`${currentActiveCard+1} / ${cardsData.length}`
}

//分頁按鈕，注意卡片的左右轉換還需理解
function handleNext(){
  prevBtn.removeAttribute('disabled')
  //點擊後使該DOM元素隱藏(left)
  
  cardEl[currentActiveCard].className='card left';
  currentActiveCard = currentActiveCard + 1;
  
  //判斷萬一加到陣列的最後面
  //console.log(currentActiveCard > cardEl.length)
  if(currentActiveCard >= cardEl.length -1){
    currentActiveCard = cardEl.length - 1;
    nextBtn.setAttribute('disabled','disabled')
  }
  cardEl[currentActiveCard].className = 'card active';
  showCurrentPage();

}

function handlePrev(){
  nextBtn.removeAttribute('disabled');
  cardEl[currentActiveCard].className='card';
  
  currentActiveCard = currentActiveCard - 1;
  if(currentActiveCard <= 0){
    currentActiveCard = 0;
    prevBtn.setAttribute('disabled','disabled')
  }
  cardEl[currentActiveCard].className = 'card active';
  showCurrentPage();
}


function showAddCard(){
  addContainer.hidden= false;
  addContainer.style["display"] = 'flex';
  showBtn.hidden =true;

}

function getCardsData (){

  if(localStorage.getItem('cardsArray')){
    cardsData = JSON.parse(localStorage.getItem('cardsArray'));
  }else{
    cardsData =[{
      question: "don't have any thing",
      answer: 'thisIsAVariable'
    }]
    localStorage.setItem('cardsArray',JSON.stringify(cardsData));
  }
  
  showCardToDom ();
  showCurrentPage();
}

function handleSubmitCard(e){
  e.preventDefault();

  let questionVlaue = questionEl.value;
  let answerValue = answerEl.value;
  console.log(questionVlaue,answerValue);

  const card = {
    question: questionVlaue,
    answer: answerValue
  }
  cardsData.push(card);
  //console.log(cardsData);

  localStorage.setItem('cardsArray',JSON.stringify(cardsData));
  getCardsData ();
  //reset
  questionEl.value ='';
  answerEl.value='';
} 


function deleteCard(checkBoxIndex){
  console.log(checkBoxIndex);
  //讓原陣列array 去對照i
  cardsData.forEach((card,index)=>{
    console.log(index === checkBoxIndex);
    if(index===checkBoxIndex){
      cardsData.splice(index,1)
    }
  })

  localStorage.setItem('cardsArray',JSON.stringify(cardsData));
  window.location.reload(); //他會刷新從1開始
  getCardsData ();
}

showCurrentPage ();
getCardsData(); //注意要執行函式的順序(放置位置)，如原本將showCardToDom () 放在外層運行，而getCardsData()沒有放外面，而使得取資料有問題

nextBtn.addEventListener('click', handleNext)
prevBtn.addEventListener('click', handlePrev);
showBtn.addEventListener('click',showAddCard);
addCardBtn.addEventListener('click',handleSubmitCard);
hideBtn.addEventListener('click', () => {
  addContainer.hidden=true;
  addContainer.style["display"] = 'none';
  window.location.reload();
});
// checkBoxes.forEach(box => box.addEventListener('click', deleteCard));
// console.log(checkBoxes)