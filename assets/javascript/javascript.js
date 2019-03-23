//firebase initilization 
var config = {
    apiKey: "AIzaSyCNKdFy67-i0Hx_xa19gPT5i-x3610zyWo",
    authDomain: "class318-88119.firebaseapp.com",
    databaseURL: "https://class318-88119.firebaseio.com",
    projectId: "class318-88119",
    storageBucket: "class318-88119.appspot.com",
    messagingSenderId: "262669921349"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

//event that happens when the add-train button is hit
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    //gathering the values from the variables for the form input fields 
    var tName = $("#train-name-input").val().trim();
    var tDestination = $("#destination-input").val().trim();
    var firstTime = $("#first-time-input").val().trim();
    var frequency = $("#frequency-input").val().trim()
    
    //pushing the information to the database as key/value pairs
    database.ref().push({
        train: tName,
        destination: tDestination,
        firstTime,
        frequency,
    })

    alert("Hope you packed your bags!");

    //clearning the input fields 
    $("#train-name-input").empty();
    $("#destionation-input").empty();
    $("#first-time-input").empty();
    $("#frequency-input").empty();

});
$(document).on("click", ".remove", function() {
    var tr = $(this).closest("tr");
    var key = tr.attr("data-key")
    console.log(key);

    database.ref(key).remove();
    tr.remove(); 
    console.log("deleted!");
});

database.ref().on("child_added", function(Snapshot) {
    console.log(Snapshot.key);
  
    // Store everything into a variable.
    var tName = Snapshot.val().train;
    var tDestination = Snapshot.val().destination;
    var firstTime = Snapshot.val().firstTime;
    var frequency = Snapshot.val().frequency;
    var clearBtn = $("<button>").addClass("remove btn btn-primary").text("Clear");

        // $(".remove").on("click", function() {
        //     $(this).closest("tr").remove(); 
        //     console.log("deleted!");
        // });

    //converting the first time 
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    //collecting the current time 
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    //getting the difference between the current time and the first time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);
  
    // Minute Until Train
    var minutesTill = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesTill);
    
    // Next Train
    var nextTrain = moment().add(minutesTill, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var newInfo = $("<tr>").attr("data-key", Snapshot.key).append(
        $("<td>").text(tName),
        $("<td>").text(tDestination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrain),
        $("<td>").text(minutesTill),
        $("<td>").html(clearBtn)
      );

      $("#train-table > tbody").append(newInfo);

    });
