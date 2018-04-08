$titleInput = $('.todo-title-input');
$taskInput = $('.todo-task-input');
$saveBtn = $('.save-button');
$topSection = $('.top-section');
$bottomSection = $('.bottom-section');
$filterInput = $('.filter-input');
$deleteBtn = $('.delete-button');
$upvoteBtn = $('.upvote-button')
$downvoteBtn = $('.downvote-button')
$titleOutput = $('.todo-title-output');

$saveBtn.on('click', createTask);
$bottomSection.on('click', '.delete-button', deleteCard);
$bottomSection.on('blur', '.todo-title-output', editTitle);
$bottomSection.on('blur', '.todo-task-output', editTask);
$bottomSection.on('click', '.upvote-button', increaseQuality);
$bottomSection.on('click', '.downvote-button', decreaseQuality);

function createTask(event) {
  event.preventDefault();
  var card = new Card($titleInput.val(), $taskInput.val());
  prependTask(card);
  storeTask(card);
  $('.title-input').val('');
  $('.task-input').val('');
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
  $bottomSection.prepend(`
    <article class="todo-card" id=${card.id}>
      <img src="icons/delete.svg" class="delete-button">
      <h2 class="todo-title-output" contenteditable>${card.title}</h2>
      <p class="todo-task-output" contenteditable>${card.task}</p>
      <img src="icons/upvote.svg" class="voters upvote-button">
      <img src="icons/downvote.svg" class="voters downvote-button">
      <h3>importance: </h3>
      <h3 class="importance"> ${card.importance}</h3>
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
  var upQualityID = $(this).parent().find('.importance');
  var cardId = upQualityID.parent().attr('id');
   if (upQualityID.text() === 'Normal') { 
      upQualityID.text() = 'high';
   console.log(upQualityID.text())
  } else if (upQualityID.text() === 'high') { 
      upQualityID.text('critical');
  } 
  storeQuality(cardId, upQualityID.text())
}

function decreaseQuality() {
  var downQualityID = $(this).parent().find('.importance');
  var cardId = downQualityID.parent().attr('id');
    if (downQualityID.text() === ' normal') {
      downQualityID.text('low');
    } else if (downQualityID.text() ===' low'){
      downQualityID.text('none');
    }
    storeQuality(cardId, downQualityID.text());
}

function deleteCard() {
  var deleteCard = $(this).closest('.todo-card');
  var cardId = deleteCard.attr('id');
  deleteCard.remove();
  localStorage.removeItem(cardId);
}