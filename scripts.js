$titleInput = $('.title-input');
$bodyInput = $('.body-input');
$saveBtn = $('.save-button');
$topSection = $('.top-section');
$bottomSection = $('.bottom-section');
$searchInput = $('.search-input');
$deleteBtn = $('.delete-button');
$upvoteBtn = $('.upvote-button')
$downvoteBtn = $('.downvote-button')
$ideaTitle = $('.idea-title');

$saveBtn.on('click', createIdea);
$bottomSection.on('click', '.delete-button', deleteCard);
$bottomSection.on('blur', '.idea-title', editTitle);
$bottomSection.on('blur', '.idea-body', editBody);
$bottomSection.on('click', '.upvote-button', increaseQuality);
$bottomSection.on('click', '.downvote-button', decreaseQuality);

function createIdea() {
 var card = new Card($titleInput.val(), $bodyInput.val());
 prependIdea(card);
 storeIdea(card);
 $('.title-input').val('');
 $('.body-input').val('');
}

function getIdeas() {
 for (var i=0; i < localStorage.length; i++) {
   var stored = localStorage.getItem(localStorage.key(i))
   var parsedCard = JSON.parse(stored);
   prependIdea(parsedCard);
 }
};

getIdeas();
 
function Card(title, body) {
 this.title = title;
 this.body = body;
 this.id = Date.now();
 this.quality = 'swill';
}

function prependIdea(card) {
$bottomSection.prepend (`
<article class="idea-card" id=${card.id}>
<img src = 'icons/delete.svg' class='delete-button' width='20px' height='20px'>
 <h2 class='idea-title' contenteditable>${card.title}</h2>
 <h3 class='idea-body' contenteditable>${card.body}</h3>
 <img src = 'icons/upvote.svg' class='upvote-button' width="20px" height='20px'>
 <img src = 'icons/downvote.svg' class='downvote-button' width='20px' height='20px'>
 <p>quality:</p>
 <p id ='quality'> ${card.quality}</p>
 <hr id='idea-underline'>
</article>`);
}

function storeIdea(card) {
 var stringifyCard = JSON.stringify(card);
 localStorage.setItem(card.id, stringifyCard);
}

function editTitle() {
 var currentCard = $(this).closest('.idea-card');
 var cardId = currentCard.attr('id');
 var parsedCard = JSON.parse(localStorage.getItem(cardId));
 parsedCard.title = $(this).text();
 storeIdea(parsedCard);
}

function editBody() {
 var currentCard = $(this).closest('.idea-card');
 var cardId = currentCard.attr('id');
 var parsedCard = JSON.parse(localStorage.getItem(cardId));
 parsedCard.body = $(this).text();
 storeIdea(parsedCard);
}

function storeQuality(cardId, qualityValue) {
 var parsedCard = JSON.parse(localStorage.getItem(cardId));
 parsedCard.quality = qualityValue;
 storeIdea(parsedCard);
}

function increaseQuality() {
var upQualityID = $(this).parent().find('#quality');
 var cardId = upQualityID.parent().attr('id');
 if (upQualityID.text() === ' swill') {
  upQualityID.text(' plausible');
} else if (upQualityID.text() === ' plausible') {
    upQualityID.text(' genius');
}
storeQuality(cardId, upQualityID.text())
}

function decreaseQuality() {
var downQualityID = $(this).parent().find('#quality');
var cardId = downQualityID.parent().attr('id');
if (downQualityID.text() === ' genius') {
  downQualityID.text(' plausible');
} else if (downQualityID.text() === ' plausible') {
  downQualityID.text(' swill');
}
 storeQuality(cardId, downQualityID.text());
}

function deleteCard() {
 var deleteCard = $(this).closest('.idea-card');
 var cardId = deleteCard.attr('id');
 deleteCard.remove();
 localStorage.removeItem(cardId);
}