$(document).ready(function() {
  console.log("Hello, World!");

  updateList();
  $("input.new-item").keyup(function(e) {
    if (e.keyCode == 13) {
      var newItem = $("input.new-item").val();
      if (newItem === "") {
        console.log("no text");
        return;
      }
      //clear textbox
      $("input.new-item").val("");
      console.log(JSON.stringify({"item":newItem}));
      $.post({
        url:"/list",
        data:JSON.stringify({"item":newItem}),
        contentType: "application/json; charset=utf-8",
        success:updateList,
        error:function(e) {
          console.log("error:",e);
        }
      })
    }
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


$("input.new-item").keyup(function(e){
  console.log("key pressed");
  if (e.keycode == 13) {
    console.log("enter pressed");
  }
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
