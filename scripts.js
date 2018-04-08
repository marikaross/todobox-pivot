$('.save-button').on('click', createTask);
$('.todo-title-input').on('keyup', btnDisable);
$('.todo-task-input').on('keyup', btnDisable);
$('.bottom-section').on('click', '.delete-button', deleteCard);
$('.bottom-section').on('blur', '.todo-title-output', editTitle);
$('.bottom-section').on('blur', '.todo-task-output', editTask);
$('.bottom-section').on('click', '.upvote-button', increaseQuality);
$('.bottom-section').on('click', '.downvote-button', decreaseQuality);

function btnDisable() {
  if ($('.todo-title-input').val() === "" || $('.todo-task-input').val() ==="") {
    $('.save-button').prop('disabled', true);
  } else if ($('.todo-title-input').val() && $('.todo-task-input').val()) {
    $('.save-button').prop('disabled', false);
  }
}

function createTask(event) {
  event.preventDefault();
  var card = new Card($('.todo-title-input').val(), $('.todo-task-input').val());
  prependTask(card);
  storeTask(card);
  $('.todo-title-input').val('');
  $('.todo-task-input').val('');
}

function getTasks() {
  for (var i=0; i < localStorage.length; i++) {
    var stored = localStorage.getItem(localStorage.key(i))
    var parsedCard = JSON.parse(stored);
    prependTask(parsedCard);
  }
};

getTasks();
 
function Card(title, task) {
  this.title = title;
  this.task = task;
  this.id = Date.now();
  this.importance = 'Normal';
}

function prependTask(card) {
  $('.bottom-section').prepend(`
    <article class="todo-card" id=${card.id}>
      <img src="icons/delete.svg" class="delete-button">
      <h2 class="todo-title-output" contenteditable>${card.title}</h2>
      <p class="todo-task-output" contenteditable>${card.task}</p>
      <img src="icons/upvote.svg" class="voters upvote-button">
      <img src="icons/downvote.svg" class="voters downvote-button">
      <h3>importance:</h3><h3 class="importance"> ${card.importance}</h3>
      <hr>
    </article>
  `);
}

function storeTask(card) {
  var stringifyCard = JSON.stringify(card);
  localStorage.setItem(card.id, stringifyCard);
}

function editTitle() {
  var currentCard = $(this).closest('.todo-card');
  var cardId = currentCard.attr('id');
  var parsedCard = JSON.parse(localStorage.getItem(cardId));
  parsedCard.title = $(this).text();
  storeTask(parsedCard);
}

function editTask() {
  var currentCard = $(this).closest('.todo-card');
  var cardId = currentCard.attr('id');
  var parsedCard = JSON.parse(localStorage.getItem(cardId));
  parsedCard.task = $(this).text();
  storeTask(parsedCard);
}

function storeQuality(cardId, qualityValue) {
  var parsedCard = JSON.parse(localStorage.getItem(cardId));
  parsedCard.importance = qualityValue;
  storeTask(parsedCard);
}

function increaseQuality() {
  var cardId = $(this).parent().attr('id');
  var upQualityID = $(this).siblings('.importance'); 
   if (upQualityID.text() === 'Normal') { 
      upQualityID.text('High');
  } else if (upQualityID.text() === 'High') {
    upQualityID.text('Critical');
  } else if (upQualityID.text() === 'None') { 
    upQualityID.text('Low');
  } else if (upQualityID.text() === 'Low') {
    upQualityID.text('Normal');
  } else { 
    upQualityID.text('Critical');
  } storeQuality(cardId, upQualityID.text())
}

function decreaseQuality() {
  var cardId = $(this).parent().attr('id');
  var downQualityID = $(this).siblings('.importance');
    if (downQualityID.text() === 'Normal') {
      downQualityID.text('Low');
    } else if (downQualityID.text() === 'Low') {
      downQualityID.text('None');
    } else if (downQualityID.text() === 'Critical') {
      downQualityID.text('High');
    } else if (downQualityID.text() === 'High') {
      downQualityID.text('Normal');
    } else {
      downQualityID.text('None');
    } storeQuality(cardId, downQualityID.text());
}

function deleteCard() {
  var deleteCard = $(this).closest('.todo-card');
  var cardId = deleteCard.attr('id');
  deleteCard.remove();
  localStorage.removeItem(cardId);
}