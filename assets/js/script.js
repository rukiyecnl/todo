import { saveToLocalStorage } from "../modules/localStorage.js";
import { qs } from "../modules/querySelector.js";
import { qsAll } from "../modules/querySelector.js";
import { bindEventsAll } from "../modules/bindEvents.js";

let todos = JSON.parse(localStorage.getItem("todos")) || [];
const localCheck = JSON.parse(localStorage.getItem("checkControl")) || [];
const form = qs(".form");
const todoList = qs(".todoList");
const minEndDate = qs(".endDate");
const date = new Date("05/05/2024");
console.log(date.toLocaleDateString("tr"));
const day = date.getDate();
const month = date.getMonth() + 1 ;  // ay bilgisini 1 eksik veriyor
const year = date.getFullYear();
// console.log(month);

let currentId = 1;
// minEndDate.min = date.toLocaleDateString("tr");
const leftItems = qs(".leftItems");
const completedTodoBtn = qs(".completedTodoBtn");
const allActiveTodoBtn = qs(".allActive");
const allTodosBtn = qs(".allTodos");
const clearCompletedBtn = qs(".clearCompletedBtn");
let remainingDay = 0;
let remainingMonth = 0;
let remainingYear = 0;

function calculateTime(finishDay, finishMonth, finishYear){


    if ((finishDay - day) < 0) { 
        remainingDay = finishDay - day + 30;

        if ((finishMonth - month) < 0) { 
            remainingMonth = finishMonth - month + 11;
    
            if (finishYear - year >= 2) {
                remainingYear = finishYear - year - 1;
            }
            else {
                remainingYear = 0;
            }
    
        }else {
            remainingMonth = finishMonth - month - 1;
            remainingYear = finishYear - year;
        }
    
    }else {
        remainingDay = finishDay - day;
        
        if ((finishMonth - month) < 0) { 
            remainingMonth = finishMonth - month + 12;
    
            if (finishYear - year >= 2) {
                remainingYear = finishYear - year - 1;
            }
            else {
                remainingYear = 0;
            }
    
        }else {
            remainingMonth = finishMonth - month;
            remainingYear = finishYear - year;
        }
    
    }

    const totalTime = remainingDay + remainingMonth*30 + remainingYear*365;
    

    if (totalTime > 365) {
        return `kalan süre : ${remainingDay} gün ${remainingMonth} ay ${remainingYear} yıl`;
    }
    else if (totalTime > 30) {
        return `kalan süre : ${remainingDay} gün ${remainingMonth} ay`;
    }
    else{
        return `kalan süre : ${remainingDay} gün `;
    }



}


function getFormInfos(){
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const todo = formData.get("todo");
        const endDate = formData.get("endDate");
        // const finallyEndDate = endDate.replaceAll("-", ".").split(".").reverse().join(".");

        const finishDay = endDate.replaceAll("-", ".").split(".").reverse()[0];
        const finishMonth = endDate.replaceAll("-", ".").split(".").reverse()[1];
        const finishYear = endDate.replaceAll("-", ".").split(".").reverse()[2];
        const newTodo = {
            id: createId(),
            todo,
            finishDay,
            finishMonth,
            finishYear,
            isCompleted: false
        }

        todos.push(newTodo);
        saveToLocalStorage("todos", todos);

        renderTodos(todos);
        e.target.reset();
    })
    // countLeftTodos();
}

let count = 0;
function renderTodos(todoArray){
    count = 0;
    todoList.innerHTML = "";
    todoArray.forEach(task => {
        todoList.innerHTML += `<div class="item" id = "${task.id}">

                                <div class="itemLeftSide">
                                    <div class="main">
                                        <input id = "${task.id}" type="checkbox" class="taskCheckBox" >
                                        <span class="checkbox-container"><img class="check" src="assets/img/icon-check.svg" alt=""></span>
                                    </div>
                                    <div class="todoTimeDiv">
                                        <span id = "${task.id}">${task.todo}</span> 
                                        <span class="remainingTime"> ${calculateTime(task.finishDay, task.finishMonth, task.finishYear)}</span>
                                    </div>
                                </div>

                                <div class="itemRightSide">
                                    <button class="editBtn">🔄️</button>
                                    <button class="deleteBtn">❌</button>
                                </div>

                            </div`;
        if (task.isCompleted == false) {
            count++;
        }
    });
    console.log(count);
    bindEventsAll(".taskCheckBox", "change", handleTaskCheckbox);
    bindEventsAll(".editBtn", "click", handleEditBtn);
    bindEventsAll(".deleteBtn", "click", handleDeleteBtn);
    load(".taskCheckBox");
    countLeftTodos();
    calculateTime(".remainingTime");
}

function handleDeleteBtn(){
    const deletedDiv = this.parentElement.parentElement;
    deletedDiv.remove();

    const deletedTodo = todos.find(todo => todo.id == deletedDiv.id);

    todos.splice(todos.indexOf(deletedTodo), 1);
    saveToLocalStorage("todos", todos);
    countLeftTodos();
}

function handleEditBtn(){
    const editedSpan = this.parentElement.previousElementSibling.lastElementChild.firstElementChild;
    const editedTodo = todos.find(todo => todo.id == this.parentElement.parentElement.id);

    editedSpan.innerHTML = `<div class="updateBar">
                                <input type="text" class="updateBarInput">
                                <button class="changeBtn"><span>✅</span></button>
                            </div>`;

    const updateBarInput = qs(".updateBarInput");

    updateBarInput.value = editedTodo.todo;

    // console.log(editedSpan);
    bindEventsAll(".changeBtn", "click", handleChangeBtns);


    
}

function handleChangeBtns(){
    const changedTodo = this.previousElementSibling.value;
    const editedTodo = todos.find(todo => todo.id == this.parentElement.parentElement.id);
    console.log(editedTodo);
    editedTodo.todo = changedTodo;

    if (editedTodo.isCompleted == true) {
        this.parentElement.parentElement.innerHTML =  `<del>${changedTodo}</del>`;
    }
    else {
        this.parentElement.parentElement.innerHTML = `${changedTodo}`;
    }

    

    saveToLocalStorage("todos", todos);
}

function handleTaskCheckbox(){
    const checkedTodo = todos.find(task => task.id == this.id);
    // console.log(checkedTodo);
    const finished = this.parentElement.nextElementSibling.firstElementChild.textContent;
    const finishedTag = this.parentElement.nextElementSibling.firstElementChild;
    console.log(finished);
    if (this.checked) {
        finishedTag.innerHTML = `<del>${finished}</del>`;
        checkedTodo.isCompleted = true;
        this.classList.add("checked");
        
    }else if(!this.checked){
        finishedTag.textContent = finished;
        checkedTodo.isCompleted = false;
    }
    saveToLocalStorage("todos", todos);

    const isCheckedBefore = localCheck.find(c => c.id == checkedTodo.id);
    if (isCheckedBefore) {
        isCheckedBefore.status = this.checked;
    }else {

        localCheck.push({
            status:this.checked,
            id:checkedTodo.id
        })

    }
    saveToLocalStorage("checkControl", localCheck);
    countLeftTodos();
}

function createId(){
    if (todos.length == 0) {
        currentId = 1;
    }
    else {
        currentId = todos[todos.length - 1].id + 1;
    }
    return currentId;
}

function load(elements){
    const degisken = qsAll(elements);
    // console.log(degisken[0].id);
    const checkedList = todos.filter(todo => todo.isCompleted == true);


    for (let i = 0; i < degisken.length; i++) {
        
        for (const d of checkedList) {
            console.log(d.id);
            if (d.id == degisken[i].id) {
                degisken[i].checked = true;
                const chengedTextTag = degisken[i].parentElement.nextElementSibling.firstElementChild;
                chengedTextTag.innerHTML = `<del>${chengedTextTag.textContent}</del>`;
            }
        }
        
    }
   

}

function countLeftTodos(){
    // todos = JSON.parse(localStorage.getItem("todos"));
    const leftTodos = todos.filter(todo => todo.isCompleted == false);

    leftItems.innerHTML = `${leftTodos.length} items left`;

}

function handleCompletedTodoBtn(){
    completedTodoBtn.addEventListener("click", showCompletedTodos);
}

function showCompletedTodos(){
    const completedTodos = todos.filter(todo => todo.isCompleted == true);
    renderTodos(completedTodos);
}

function handleAllActiveTodos(){
    allActiveTodoBtn.addEventListener("click", showActiveTodos);
}

function showActiveTodos(){
    const activeTodos = todos.filter(todo => todo.isCompleted == false);
    renderTodos(activeTodos);
}

function handleAllTodosBtn(){
    allTodosBtn.addEventListener("click", showAllTodos);
}

function showAllTodos(){
    renderTodos(todos);
}

function handleClearCompletedBtn(){
    clearCompletedBtn.addEventListener("click", clearCompleted);
}

function clearCompleted(){
    // todos = JSON.parse(localStorage.getItem("todos"));
    const completedTodos = todos.filter(todo => todo.isCompleted == true);
    const findAllIndex = completedTodos.map(function(todo){
        return {
            index: todos.indexOf(todo)
        }
    })
    // console.log(findAllIndex);

  
    for (let i = 0; i < findAllIndex.length; i++) {
        if (findAllIndex[i].index == findAllIndex[0].index) {
            todos.splice(findAllIndex[0].index, 1);
        }    
        else {
            todos.splice(findAllIndex[i].index - i, 1);
        }    
    }

    
    saveToLocalStorage("todos", todos);

    // console.log(todos);


    renderTodos(todos);


}

function init(){
    renderTodos(todos);
    getFormInfos();
    countLeftTodos();
    handleAllTodosBtn();
    handleCompletedTodoBtn();
    handleAllActiveTodos();
    handleClearCompletedBtn();
}

// load();
init();