$('.save-button').on('click', createTask);
$('.todo-title-input').on('keyup', btnDisable);
$('.todo-task-input').on('keyup', btnDisable);
$('.bottom-section').on('click', '.delete-button', deleteCard);
$('.bottom-section').on('keydown', '.todo-title-output', editTitle);
$('.bottom-section').on('keydown', '.todo-task-output', editTask);
$('.bottom-section').on('click', '.upvote-button', increaseImportance);
$('.bottom-section').on('click', '.downvote-button', decreaseImportance);
$('.filter-input').on('keyup', filterTasks);
$('.bottom-section').on('click', '.completed-task', changeClassComplete);
$('.show-completed').on('click', getCompletedTasks);
$('.show-more-ToDos').on('click', showAllCards);
$('.filter-none-btn').on('click', filterNone);
$('.filter-low-btn').on('click', filterLow);
$('.filter-normal-btn').on('click', filterNormal);
$('.filter-high-btn').on('click', filterHigh);
$('.filter-critical-btn').on('click', filterCritical);
$('.todo-title-input').on('keyup', titleCounter);
$('.todo-task-input').on('keyup', taskCounter);



function btnDisable() {
  if ($('.todo-title-input').val() && $('.todo-task-input').val()) {
    $('.save-button').prop('disabled', false);
  } else {
    $('.save-button').prop('disabled', true);
  }
}

function createTask(event) {
  event.preventDefault();
  var card = new Card($('.todo-title-input').val(), $('.todo-task-input').val());
  prependTask(card);
  storeTask(card);
  showTenCards();
  clearInputs();
}

  function clearInputs() {
  $('.todo-title-input').val('');
  $('.todo-task-input').val('');
  $('.save-button').prop('disabled', true);
};

function getTasks() {
  for (var i = 0; i < localStorage.length; i++) {
    var stored = localStorage.getItem(localStorage.key(i))
    var parsedCard = JSON.parse(stored);
    if (parsedCard.checked === false) {
      prependTask(parsedCard);
      }
  } 
  showTenCards();
};

function getCompletedTasks() {
  for (var i = 0; i < localStorage.length; i++) {
    var stored = localStorage.getItem(localStorage.key(i))
    var parsedCard = JSON.parse(stored); 
    if (parsedCard.checked) {
      prependTask(parsedCard, 'card-complete');
    } 
  }
};

getTasks();
 
function Card(title, task) {
  this.title = title;
  this.task = task;
  this.id = Date.now();
  this.importance = 'Normal';
  this.checked = false;
}

function prependTask(card, completed) {
  $('.bottom-section').prepend(`
    <article class="todo-card ${completed}" id=${card.id}>
      <img src="icons/delete.svg" class="delete-button" alt="delete task button">
      <h2 class="todo-title-output" contenteditable>${card.title}</h2>
      <p class="todo-task-output" contenteditable>${card.task}</p>
      <img src="icons/upvote.svg" class="voters upvote-button" alt="level of importance upvote button">
      <img src="icons/downvote.svg" class="voters downvote-button" alt="level of importance down vote button">
      <h3>importance:</h3><h3 class="importance">${card.importance}</h3>
      <button type="submit" aria-label="completed task button" class="completed-task">Completed Task</button>
      <hr>
    </article>
  `);
}

function storeTask(card) {
  var stringifyCard = JSON.stringify(card);
  localStorage.setItem(card.id, stringifyCard);
}


function storeImportance(cardId, importanceValue) {
  var parsedCard = JSON.parse(localStorage.getItem(cardId));
  parsedCard.importance = importanceValue;
  storeTask(parsedCard);
}

function increaseImportance() {
  var cardId = $(this).parent().attr('id');
  var upImportanceId = $(this).siblings('.importance'); 
   if (upImportanceId.text() === 'None') { 
      upImportanceId.text('Low');
  } else if (upImportanceId.text() === 'Low') {
    upImportanceId.text('Normal');
  } else if (upImportanceId.text() === 'Normal') { 
    upImportanceId.text('High');
  } else if (upImportanceId.text() === 'High') {
    upImportanceId.text('Critical');
  }  
  storeImportance(cardId, upImportanceId.text())
}

function decreaseImportance() {
  var cardId = $(this).parent().attr('id');
  var downImportanceId = $(this).siblings('.importance');
    if (downImportanceId.text() === 'Critical') {
      downImportanceId.text('High');
    } else if (downImportanceId.text() === 'High') {
      downImportanceId.text('Normal');
    } else if (downImportanceId.text() === 'Normal') {
      downImportanceId.text('Low');
    } else if (downImportanceId.text() === 'Low') {
      downImportanceId.text('None');
    } 
    storeImportance(cardId, downImportanceId.text());
}

function deleteCard() {
  var deleteCard = $(this).closest('.todo-card');
  var cardId = deleteCard.attr('id');
  deleteCard.remove();
  localStorage.removeItem(cardId);
}

function editTitle(e) {
  if (e.which === 13) { 
    e.preventDefault();
    $('.todo-title-input').focus();
  }
    var currentCard = $(this).closest('.todo-card');
    var cardId = currentCard.attr('id');
    var parsedCard = JSON.parse(localStorage.getItem(cardId));
    parsedCard.title = $(this).text();
    storeTask(parsedCard);
}

function editTask(e) {
  if (e.which === 13) { 
    e.preventDefault();
    $('.todo-title-input').focus();
  }
    var currentCard = $(this).closest('.todo-card');
    var cardId = currentCard.attr('id');
    var parsedCard = JSON.parse(localStorage.getItem(cardId));
    parsedCard.task = $(this).text();
    storeTask(parsedCard);
}

function changeClassComplete() {
  $(this).parent('article').toggleClass('card-complete');
  var cardId = $(this).parent().attr('id');
  var parsedCard = JSON.parse(localStorage.getItem(cardId));
  parsedCard.checked = !parsedCard.checked;
  storeTask(parsedCard);

  }

function filterTasks() {
  $("article:contains('"+ $('.filter-input').val() +"')").show();
  $("article:not(:contains('"+ $('.filter-input').val() +"'))").hide();
}


function showTenCards() {
  var allTheCards = $('article');
  for (var i = 0; i < allTheCards.length; i++) {
    if (i > 9) {
      $(allTheCards[i]).hide();
    }
  }
}

function showAllCards() {
    var allTheCards = $('article');
      $(allTheCards).show();
}


function filterNone() {
  $("article:contains('importance:None')").show();
  $("article:not(:contains('importance:None'))").hide();
}

function filterLow() {
  $("article:contains('importance:Low')").show();
  $("article:not(:contains('importance:Low'))").hide();
}

function filterNormal() {
  $("article:contains('importance:Normal')").show();
  $("article:not(:contains('importance:Normal'))").hide();
}

function filterHigh() {
  $("article:contains('importance:High')").show();
  $("article:not(:contains('importance:High'))").hide();
}

function filterCritical() {
  $("article:contains('importance:Critical')").show();
  $("article:not(:contains('importance:Critical'))").hide();
}


function titleCounter() {
  var titleInput = document.querySelector('.todo-title-input');
  var titleCharCount = document.querySelector('.title-counter');
  titleCharCount.innerText = titleInput.value.length;
}

function taskCounter() {
  var taskInput = document.querySelector('.todo-task-input');
  var taskCharCount = document.querySelector('.task-counter');
  taskCharCount.innerText = taskInput.value.length;
}




