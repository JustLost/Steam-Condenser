document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("project2 JS imported successfully!");
  },
  false
);

$(document).ready(function () { $("#game-search").autocomplete({ source:
  async function(request, response) { let data = await
  fetch(`http://localhost:3000/search?query=${request.term}`)
  .then(results => results.json()) .then(results => results.map(result =>
  { return { label: result.name, value: result.name, id: result._id };
  })); response(data); }, minLength: 2, select: function(event, ui) {
  fetch(`http://localhost:3000/get/${ui.item.id}`) .then(result =>
  result.json()) .then(result => { $("#games").empty();
  result.games.forEach(game => { $("#games").append(`<li>${game}</li>`);
  }); }); } }); });
