const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');


const count = 10;
const apiKey = 'DEMO_KEY'	;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let dataArr = [];
let favoriteItems = {};

function showContent (page){
  //behavior: 'smooth'
  window.scrollTo({ top: 0, behavior: 'instant' });
  loader.hidden = false;
  if( page === 'results'){
    favoritesNav.classList.add('hidden');
    resultsNav.classList.remove('hidden');
  }else{
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
  }
}


//點擊favorite 會出現喜愛的文章列表
function createDOMNodes (page){
  //傳入來判斷
  //console.log(Object.values(favoriteItems));// 取得value為陣列
  const currentArray = page === 'results' ? dataArr :Object.values(favoriteItems);
  currentArray.forEach((item)=>{
    //console.log(item)
    const cardItem = document.createElement('div');
    cardItem.classList.add('card');
    
    const imgLink = document.createElement('a');
    imgLink.href = item.hdurl
    imgLink.title='查看圖片'
    imgLink.setAttribute('target','_blank');

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.setAttribute('src',`${item.hdurl}`);
    img.setAttribute('alt','NASA Picture of the Day');
    img.loading='lazy';
    //body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = item.title;
    //加入最愛
    const saveCard = document.createElement('p');
    saveCard.classList.add('clickable');
     //判斷如果已經加入，就不用有文字
    if(page === 'favorites'){
      saveCard.textContent = '去除我的最愛';
      saveCard.setAttribute('onclick',`removeFavoriteItems('${item.url}')`)
    }else{
      saveCard.textContent ='加入我的最愛';
      saveCard.setAttribute('onclick',`saveFavoriteItems('${item.url}')`)
    }
    

    //文字介紹
    const cardInfo = document.createElement('p');
    cardInfo.textContent = item.explanation;
    //footer
    const footer = document.createElement('small');
    footer.classList.add('text-muted')
    const date = document.createElement('strong');
    date.textContent= item.date;
    const copyright = document.createElement('sapn');
    copyright.textContent = ` ${item.copyright}`;
    
    //將元素插入(從bottom到top) 
    footer.append(date,copyright);
    cardBody.append(cardTitle,saveCard,cardInfo,footer);
    imgLink.appendChild(img); //照片區域只有一個要塞入
    cardItem.append(imgLink,cardBody);
    //console.log(cardItem);
    imagesContainer.appendChild(cardItem);
    

  });
}


//呼叫陣列中的每個item
//page作為參數，來判斷
function updateDOM (page){
  //取得我的最愛物件資料
  if(localStorage.getItem('nasaFavorites')){
    favoriteItems = JSON.parse(localStorage.getItem('nasaFavorites'))
  }
  //console.log(page)
  imagesContainer.textContent = ''; //刪除時沒馬上更新，因為我們一直append to items，但都沒有reset it
  createDOMNodes(page);
  showContent (page);
}

//刪除我的最愛
function removeFavoriteItems(itemUrl){
  //console.log(favoriteItems[itemUrl])
  if(favoriteItems[itemUrl]){
    delete favoriteItems[itemUrl]
    //刪除之後，要在localStorage 去設置，並且要同時顯示更新資料
    localStorage.setItem('nasaFavorites', JSON.stringify(favoriteItems) );
    updateDOM('favorites');
  }
}




function saveFavoriteItems (itemUrl) {

  //要循環所有的item資料，並(includes)檢查，此外還要檢查是否已經存在物件資料中
  dataArr.forEach((item,i)=>{
    //console.log(item.url.includes(itemUrl));
    if(item.url.includes(itemUrl) && !(favoriteItems[itemUrl])){
      favoriteItems[itemUrl] = item; //等於後的item 是指，讓所有的item資料都作為value
      //此方式，就會自動存入點擊的各個資料
      //console.log('存入',favoriteItems)
      //點擊加入後顯示加入成功2秒，先讓在點擊後，hidden 先消失
      saveConfirmed.hidden =false;
      setTimeout(function() {
        saveConfirmed.hidden = true;
      }, 2000); 
      localStorage.setItem('nasaFavorites',JSON.stringify(favoriteItems))
    }
  
  })
}



//取得照片
async function getNasaPictures (){
  loader.classList.remove('hidden');
  try{
    let response = await fetch(apiUrl);
    dataArr = await response.json();
    //console.log(dataArr);
    updateDOM ('results');
  }catch(error){

  }
}


//getNasaPictures ();
