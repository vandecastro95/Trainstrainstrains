$(document).ready(function () {

  // Initialize Firebase
  let config = {
    apiKey: "AIzaSyBmMCAvFGT4I0Ka2i37qPmZLb18fb4UqWA",
    authDomain: "trainscheduler-82c18.firebaseapp.com",
    databaseURL: "https://trainscheduler-82c18.firebaseio.com",
    projectId: "trainscheduler-82c18",
    storageBucket: "",
    messagingSenderId: "922098643990"
  };
  firebase.initializeApp(config);

  let database = firebase.database();

  // Capture Button Click
  $("#addTrain").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text boxes
    let trainName = $("#trainName").val().trim();
    let destination = $("#destination").val().trim();
    let firstTrain = $("#firstTrain").val().trim();
    let freq = $("#interval").val().trim();

    // Code for handling the push
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: freq
    });
  });


  // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
  database.ref().on("child_added", function (childSnapshot) {

    let newTrain = childSnapshot.val().trainName;
    let newLocation = childSnapshot.val().destination;
    let newFirstTrain = childSnapshot.val().firstTrain;
    let newFreq = childSnapshot.val().frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    let startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");

    // Current Time
    let currentTime = moment();

    // Difference between the times
    let diffTime = moment().diff(moment(startTimeConverted), "minutes");

    // Time apart (remainder)
    let tRemainder = diffTime % newFreq;

    // Minute(s) Until Train
    let tMinutesTillTrain = newFreq - tRemainder;

    // Next Train
    let nextTrain = moment().add(tMinutesTillTrain, "minutes");
    let catchTrain = moment(nextTrain).format("HH:mm");

    // Display On Page
    $("#all-display").append(
      ' <tr><td>' + newTrain +
      ' </td><td>' + newLocation +
      ' </td><td>' + newFreq +
      ' </td><td>' + catchTrain +
      ' </td><td>' + tMinutesTillTrain + ' </td></tr>');

    // Clear input fields
    $("#trainName, #destination, #firstTrain, #interval").val("");
    return false;
  },
    //Handle the errors
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

}); //end document ready
