// Getting the required elements
var username = document.getElementById("username");
var first_name = document.getElementById("first_name");
var last_name = document.getElementById("last_name");
var password = document.getElementById("password");
var submit_button = document.getElementById("submit");
var register_form = document.getElementById("register_form");
var warning = document.getElementById("warning_text");

// A function to hide the warning text
function hideWarning() {
    warning.style.display = "none";
}

// A function to show the warning text
function showWarning() {
    warning.style.display = "block";
}

// A function to check whether all the details in a form are entered correctly
function checkDetails() {
    if (username.value.toString().trim() === "") {
        warning.innerHTML = "Username cannot be empty";
        return false;
    } else if (first_name.value.toString().trim() === "") {
        warning.innerText = "First name cannot be empty";
        return false;
    } else if (last_name.value.toString().trim() === "") {
        warning.innerText = "Last name cannot be empty";
        return false;
    } else if (password.value.toString().trim() === "") {
        warning.innerText = "Password cannot be empty";
        return false;
    } else if (last_name.value.toString().trim() === first_name.value.toString().trim()) {
        warning.innerText = "First name cannot be same as last name";
        return false;
    } else if (password.value.toString().length < 8) {
        warning.innerText = "Password should be minimum 8 characters long";
        return false;
    } else {
        return true;
    }
}

// Adding an event listener to the document on DOM event loaded for hiding the warning element
document.addEventListener("DOMContentLoaded", hideWarning);

// Adding an event listener to the submit button on click event for checking all the fields and submitting the form
submit_button.addEventListener("click", function () {

    // Defining a bool to check the details
    var details_correct = checkDetails();


    // If the function returns false
    if (!details_correct) {

        // Shows the warning
        showWarning();
    }

    // If the function returned true
    else {

        // Hiding the warning element
        hideWarning();

        // Submitting the form
        register_form.submit();
    }
});
