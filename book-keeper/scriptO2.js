const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const websiteNameEl =document.getElementById('website-name');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');


let bookmarks = {}; //將書籤的所有資料，改為物件
//點擊顯示彈跳視窗
function showModal (){
	modal.classList.add('show-modal');
	websiteNameEl.focus()

}

function closeModal() {
  modal.classList.remove('show-modal');
}



//監聽事件
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click',closeModal)
//使點擊視窗外面也讓消失
window.addEventListener('click', (e)=>{
  // console.log(e);
	(e.target === modal) ? modal.classList.remove('show-modal') : false;
	
})

//驗證網址 https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
function urlValidate(nameValue, urlValue){
  let expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
	let regex = new RegExp(expression);
	if(!nameValue || !urlValue){
		alert('請輸入資料');
		return false;
	}
	// if(urlValue.match(regex)){
	// 	alert('match');
	// }
	if(!urlValue.match(regex)){
		alert('請輸入正確的網址')
		return false;
	}
	//合格
	return true
}

//deleteBookmark
function deleteBookmark(id){
	//改為物件，依照物件id 來刪
	if (bookmarks[id]) {
		delete bookmarks[id]
	}

	//刪除之後，要在localStorage 去設置
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks) );
	getBookmarksArr();
}

//建立書籤樣式
function buildBookmarks (){
  //進入forEach 之前要清空
	bookmarksContainer.textContent = '';
  //建立item
	//console.log(Object.keys(bookmarks))
	Object.keys(bookmarks).forEach((id)=>{
    const {name,url} = bookmarks[id]; //透過將物件解構取得裡面的資料
		console.log (name,url)

    const item = document.createElement('div');
		item.classList.add('item');
		//添加刪除i
		const delIcon = document.createElement('i');
		delIcon.classList.add('fas','fa-times');
		delIcon.setAttribute('title','刪除按鈕');
		delIcon.setAttribute('onClick',`deleteBookmark('${id}')`); //刪除事件

	  //添加網址的  名稱
		const linkInfo = document.createElement('div');
		linkInfo.classList.add('name');
		//在 linkInfo 裡面有網址的 favion 和名
		const linkFavion = document.createElement('img');
		linkFavion.setAttribute('src',`https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
		linkFavion.setAttribute('alt','Favicon');
		//加入連結
		const linkName =  document.createElement('a');
		linkName.setAttribute('href',`${url}`);
		linkName.setAttribute('target', '_blank');
		linkName.textContent= name;
    
		//將資料放入
		linkInfo.append(linkFavion, linkName);
		item.append(delIcon, linkInfo);
		bookmarksContainer.appendChild(item);

		
	})
}

//將取得的JSON 轉為物件
function getBookmarksArr (){
	//判斷原有的localStorage 有沒有資料
	if(localStorage.getItem('bookmarks')){
		bookmarks =JSON.parse(localStorage.getItem('bookmarks'));
	}else{
		// Create bookmarks object in localStorage
		const id = `http://jacinto.design`
		bookmarks[id] = {
			name: 'Jacinto Design',
			url: 'http://jacinto.design',
		}

		localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
			
	}
	buildBookmarks()
}


//儲存書籤 取得表格內的資訊 
//記得要預設防止
//如果 urlValue 不包含... ，使用正則表達式 regexr.com
function  hadleSubmitForm (e) {
	e.preventDefault();
	let nameValue = websiteNameEl.value;
	//動態添增url
	let urlValue = websiteUrlEl.value;
	if(!urlValue.includes('http://') && !urlValue.includes('http://')){
		urlValue =  `https://${urlValue}`
	}
	//進一步要判斷網址是否正確，如果判斷驗證沒通過，就無法執行表單的發送
	//console.log(nameValue,urlValue)
	if(!urlValidate(nameValue, urlValue)){
		return false; 
	}
  
	//儲存輸入的書籤資料
	const bookmark ={
    name: nameValue,
		url:  urlValue,
	}
	
	//將url 變成key值，接續存入物件資料
	bookmarks[urlValue] = bookmark
	console.log(bookmarks)
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks) );
  getBookmarksArr();
	bookmarkForm.reset();
	


}

//注意事件要用submit，若用click 會出現bug
bookmarkForm.addEventListener('submit', hadleSubmitForm)

getBookmarksArr();