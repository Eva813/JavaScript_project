//選擇到所有拖曳的項目
const draggables = document.querySelectorAll('.draggable');
//找出可以drop 的位置
const containers = document.querySelectorAll('.container');

//監聽所有的draggables
//替項目增加樣式
draggables.forEach((draggable) => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})

//放置位置的設定
containers.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault();
    //設置afterElement ，取得Y的位置，透過參數傳遞
    //如果移動位置有在某個元素上方就會有回傳值
    const afterElement = getDragAfterElement(container, e.clientY);

    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      container.append(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  })
})

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

  //closest => 最接近的element
  return draggableElements.reduce((closest, child) => {
    //他會量測元素包含 border 的大小，並回傳一個 DOMRect 物件
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }

  }, { offset: Number.NEGATIVE_INFINITY }).element
  //如果沒有加element會報錯, 此.element 是因為return整個reduce,最後要取得的只要element
  //Uncaught TypeError: Failed to execute 'insertBefore' on 'Node': parameter 2 is not of type 'Node'.
}
