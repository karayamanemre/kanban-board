const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const resetBtn = document.querySelector('.footer-title');
const listColumns = document.querySelectorAll('.drag-item-list');
const toDoListEl = document.getElementById('todo-list');
const inProgressListEl = document.getElementById('in-progress-list');
const inReviewListEl = document.getElementById('in-review-list');
const doneListEl = document.getElementById('done-list');

let updatedOnLoad = false;

let toDoListArray = [];
let inProgressListArray = [];
let inReviewListArray = [];
let doneListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('toDoItems')) {
    toDoListArray = JSON.parse(localStorage.toDoItems);
    inProgressListArray = JSON.parse(localStorage.inProgressItems);
    inReviewListArray = JSON.parse(localStorage.inReviewItems);
    doneListArray = JSON.parse(localStorage.doneItems);
  } else {
    toDoListArray = ['Do something'];
    inProgressListArray = ['Add something'];
    inReviewListArray = ['Drag something'];
    doneListArray = ['Drop something'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [toDoListArray, inProgressListArray, inReviewListArray, doneListArray];
  const arrayNames = ['toDo', 'inProgress', 'inReview', 'done'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Filter Array to remove empty values
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.textContent = item;
  listEl.id = index;
  listEl.classList.add('drag-item');
  listEl.draggable = true;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // toDo Column
  toDoListEl.textContent = '';
  toDoListArray.forEach((toDoItem, index) => {
    createItemEl(toDoListEl, 0, toDoItem, index);
  });
  toDoListArray = filterArray(toDoListArray);
  // inProgress Column
  inProgressListEl.textContent = '';
  inProgressListArray.forEach((inProgressItem, index) => {
    createItemEl(inProgressListEl, 1, inProgressItem, index);
  });
  inProgressListArray = filterArray(inProgressListArray);
  // inReview Column
  inReviewListEl.textContent = '';
  inReviewListArray.forEach((inReviewItem, index) => {
    createItemEl(inReviewListEl, 2, inReviewItem, index);
  });
  inReviewListArray = filterArray(inReviewListArray);
  // On Hold Column
  doneListEl.textContent = '';
  doneListArray.forEach((doneItem, index) => {
    createItemEl(doneListEl, 3, doneItem, index);
  });
  doneListArray = filterArray(doneListArray);
  // Don't run more than once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumn[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumn[id].textContent;
    }
    updateDOM();
  }
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM(column);
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  toDoListArray = Array.from(toDoListEl.children).map(i => i.textContent);
  inProgressListArray = Array.from(inProgressListEl.children).map(i => i.textContent);
  inReviewListArray = Array.from(inReviewListEl.children).map(i => i.textContent);
  doneListArray = Array.from(doneListEl.children).map(i => i.textContent);
  updateDOM();
}

// When Item Enters Column Area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// When Item Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // Add item to Column
  parent.appendChild(draggedItem);
  // Dragging inReview
  dragging = false;
  rebuildArrays();
}

// Empty all arrays and update
resetBtn.addEventListener('click', () => {
  toDoListArray = [];
  inProgressListArray = [];
  inReviewListArray = [];
  doneListArray = [];
  listArrays = [];
  updateDOM();
});

// On Load
updateDOM();
