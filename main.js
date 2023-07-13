window.onload = function(){
    window.showCompleted = true;
    window.todos = _loadData();
    window.defaultPlaceholderText = "No items in list. Start adding!";
    _renderToDoList();
}

function _renderToDoList(){
    _renderPlaceholderText(window.defaultPlaceholderText);
    const todos = window.todos;
    todos.forEach(element => {
        const item = element;
        item.id = _generateNextId();
        _renderToDoItem(item);
    });
    _updateListUi();
}

function _renderPlaceholderText(text){
    const placeholder = document.createElement('span');
    placeholder.innerText = text;
    placeholder.id = 'placeholder';
    placeholder.style.display = 'none';
    _getToDoList().appendChild(placeholder);
}

function _generateNextId(){
    window.nextId = window.nextId ? window.nextId + 1 :1;
    return window.nextId;
}

function _updateListUi(){
    document.getElementById('button-add').disabled = _getInputElement().value.length === 0;
    let listHasElements = window.todos.length > 0;
    document.getElementById('button-remove-all').disabled = !listHasElements;
    _updateListPlaceholderText();
    window.todos.forEach(element => {
        const todo = element;
        const uiItem = _findUiItem(todo.id);
        if (window.showCompleted){
            uiItem.style.display = '';
        } else if (todo.completed) {
            uiItem.style.display = 'none';
        }
    })
}

function _getInputElement(){
    return document.getElementById("todo-text-input");
}

function _renderToDoItem(itemModel){
    const item = document.createElement('div');
    item.classList.add("item");
    if(itemModel.completed) {
        item.classList.add("is-completed");
    }
    const container = document.createElement('div');
    container.classList.add("container");

    const check = document.createElement('input');
    check.type = "checkbox";
    check.checked = itemModel.completed;
    check.onclick = function() {
        updateItemState(itemModel.id);
    }
    container.appendChild(check);

    const itemText = document.createElement('span');
    itemText.innerText = itemModel.todo;
    container.appendChild(itemText);

    const deleteItemButton = document.createElement('button');
    deleteItemButton.innerText = "Delete";
    deleteItemButton.className = "type_2"
    deleteItemButton.onclick = function() {
        deleteItem(itemModel.id);
    };

    item.appendChild(container);
    item.setAttribute('data-id', itemModel.id);
    item.appendChild(deleteItemButton);
    _getToDoList().appendChild(item);
}

function updateItemState(itemId) {
    const item = window.todos.find(function(item) {
        return item.id === itemId;
    });
    item.completed = !item.completed;
    const uiItem =_findUiItem(item.id);
    if(item.completed) {
        uiItem.classList.add("is-completed");
    } else {
        uiItem.classList.remove("is-completed");
    }
    _updateListUi();
}

function _loadData(){
    const data = [];
    return data;
}

function _findUiItem(itemId) {
    return document.querySelector('div[data-id="'+itemId+'"]');
}

function _createNewModelItem(itemText, itemCompleted) {
    const newItem = {
        id: _generateNextId(),
        todo: itemText,
        completed: itemCompleted
    };
    return newItem;
}

function _getToDoList(){
    return document.getElementById("todo-list")
}

function _shouldDisplayPlaceholder(){
    if(window.todos.length === 0){
        return true;
    }
    const activeItem = window.todos.find(function(item){
        if (!item.completed){
            return item;
        }
    });
    if (!activeItem && !window.showCompleted){
        return true;
    }
    return false;
}

function _updateListPlaceholderText(){
    const placeholderHTMLElement = document.getElementById('placeholder');
    placeholderHTMLElement.style.display = _shouldDisplayPlaceholder() ? "" : "none";
}

function inputChanged(e) {
    if(e.key === "Enter") {
        createNewTodoItem();
    }
    document.getElementById("button-add").disabled = _getInputElement().value.length === 0;
}

function createNewTodoItem() {
    const itemText = _getInputElement().value;
    const newItem = _createNewModelItem(itemText);
    window.todos.push(newItem);
    _getInputElement().value = "";
    _renderToDoItem(newItem);
    _updateListUi();
}

function deleteAllItems() {
    const todoList = _getToDoList();
    while(window.todos.length > 0) {
        const itemModel = window.todos.pop();
        todoList.removeChild(_findUiItem(itemModel.id));
    }
    _renderToDoList();
}

function toggleShow() {
    window.showCompleted = !window.showCompleted;
    document.getElementById("toggle-show").innerText = (window.showCompleted ? "Hide completed" : "Show completed");
    _updateListUi();
}

function deleteItem(itemId) {
    const todolist = _getToDoList();
    todolist.removeChild(_findUiItem(itemId));
    for (let i = 0; i < window.todos.length; i++) {
      if (window.todos[i].id === itemId) {
        window.todos.splice(i, 1);
        break;
      }
    }
    _updateListUi();
}