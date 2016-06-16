$(document).ready(function() {
  console.log("Hello, World!");

  updateList();

  $(document).on("submit","#new-item-form",function(event) {
    console.log("data: " + data);
  });
});

$(document).on("click",".remove-list-item",function(event){
  var index = event.target.id.slice(-1);
  console.log("delete " + index);

  $.ajax({
    url:"/list/" + index,
    method:"DELETE",
    success:updateList,
    error:function (error) {
      alert("failed to delete item");
      console.log(error);
    }
  });
});

function updateList() {
  console.log("updating list");
  $("ul.list").empty();
  $.get("/list", function(items) {
    items = JSON.parse(items);
    items.forEach(function (item,i) {
      $("ul.list").prepend('<li class="list-item"><p class="list-item-text">' + item + '<button id=item' + i + ' class="remove-list-item">&#10006;</button></p></li>');
    });
  });
}
