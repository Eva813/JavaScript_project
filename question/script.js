
//抓出按鈕(一次抓出一個陣列的數量)
const questionButtons = document.querySelectorAll('.question-btn')

// const plusIcon = document.querySelector('.plus-icon');
const questionText = document.querySelector('.question-text');

// function showQuestionText(e){
//   // console.log(e.currentTarget.parentElement.parentElement);
//   // const question = e.currentTarget.parentElement.parentElement
//   questionText.classList.toggle('show-text')
// }

// questionButtons.forEach(question =>{
//   question.addEventListener('click', showQuestionText)
// })

//從question 中找尋
//using selectors inside the element
const questions = document.querySelectorAll(".question");


//透過 forEach 來實現點擊事件: 從所有question來取得
//在forEach中找出他的按鈕並宣告
//監聽取得的3個按鈕，建立點擊事件
questions.forEach(question =>{
  //console.log('question',question) ;//每一個問題
  const btn = question.querySelector(".question-btn");
  //console.log(btn); //取得每個問題的btn，3個

  //監聽按鈕，並透過點擊按鈕來觸發文字的顯示
  btn.addEventListener('click',function(){
    //console.log(question); //得到點擊的那一個項目
    //從 forEach 中的 question  來取得
    // question.classList.toggle('show-text');

    //當點擊到其他項目，要去關掉已經打開的文字區:
    //要再針對const questions來回圈，對應點擊的item和沒有被點擊到的
    questions.forEach(function(item){
      //要去參照每一個item
      console.log(item);//透過點擊找出有加入show-text的item
      if(item !== question){
        item.classList.remove('show-text')
      }
        question.classList.toggle('show-text');
      
    })
  })


})