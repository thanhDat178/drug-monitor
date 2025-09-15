let url = location.host;//so it works locally and online

$("table").rtResponsiveTables();//for the responsive tables plugin

$("#add_drug").submit(function(event){//on a submit event on the element with id add_drug
    alert($("#name").val() + " sent successfully!");//alert this in the browser
})



$("#update_drug").submit(function(event){// on clicking submit
    event.preventDefault();//prevent default submit behaviour

    //var unindexed_array = $("#update_drug");
    var unindexed_array = $(this).serializeArray();//grab data from form
    var data = {}

    $.map(unindexed_array, function(n, i){//assign keys and values from form data
        data[n['name']] = n['value']
    })


    var request = {//use a put API request to use data from above to replace what's on database
    "url" : `https://${url}/api/drugs/${data.id}`,
    "method" : "PUT",
    "data" : data
}

$.ajax(request).done(function(response){
    alert(data.name + " Updated Successfully!");
		window.location.href = "/manage";//redirects to index after alert is closed
    })

})

if(window.location.pathname == "/manage"){//since items are listed on manage
    $ondelete = $("table tbody td a.delete"); //select the anchor with class delete
    $ondelete.click(function(){//add click event listener
        let id = $(this).attr("data-id") // pick the value from the data-id

        let request = {//save API request in variable
            "url" : `https://${url}/api/drugs/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this drug?")){// bring out confirm box
            $.ajax(request).done(function(response){// if confirmed, send API request
                alert("Drug deleted Successfully!");//show an alert that it's done
                location.reload();//reload the page
            })
        }

    })
}

if(window.location.pathname == "/purchase"){
//$("#purchase_table").hide();

$("#drug_days").submit(function(event){//on a submit event on the element with id add_drug
    event.preventDefault();//prevent default submit behaviour
    $("#purchase_table").show();
    days = +$("#days").val();
    alert("Drugs for " + days + " days!");//alert this in the browser
})

}// Delete drug
$(document).on("click", ".delete", function () {
  var id = $(this).attr("data-id");

  if (confirm("Are you sure you want to delete this drug?")) {
    $.ajax({
      url: "/api/drugs/" + id,
      type: "DELETE",  // hoặc method: "DELETE"
      success: function (data) {
        alert(data.message || "Drug deleted successfully!");
        location.reload();
      },
      error: function (err) {
        alert("Error deleting drug!");
        console.error(err);
      }
    });
  }
});
// Khi form add drug được submit
$("#add_drug").submit(function(event){
    alert("Drug inserted successfully!");
});

// Khi bấm nút delete trong manage.ejs
if(window.location.pathname == "/manage"){
    $ondelete = $(".delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id");

        var request = {
            "url" : `http://localhost:3100/api/drugs/${id}`,
            "method" : "DELETE"
        };

        if(confirm("Do you really want to delete this drug?")){
            $.ajax(request).done(function(response){
                alert("Drug Deleted Successfully!");
                location.reload();
            });
        }
    });
}

// Khi form update drug được submit
$("#update_drug").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {};

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value'];
    });

    var request = {
        "url" : `http://localhost:3100/api/drugs/${data.id}`,
        "method" : "PUT",
        "data" : data
    };

    $.ajax(request).done(function(response){
        alert("Drug Updated Successfully!");
        window.location.href = "/manage";
    });
});
