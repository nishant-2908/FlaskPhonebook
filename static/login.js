// Getting the required elements
var username = document.getElementById("username");
var password = document.getElementById("password");
var warning = document.getElementById("warning_text");
var registered_form = document.getElementById("form");
var submit_button = document.getElementById("submit");

// A function to hide the warning text
function hideWarning() {
    warning.style.display = "none";
}

// A function to show the warning text
function showWarning() {
    warning.style.display = "block";
}

// Checking the details in the form
function checkDetails() {

    // If the username is not empty
    if (username.value.toString().trim() === "") {

        // Updating the innerHTML
        warning.innerHTML = "Username cannot be empty";

        // Returning false
        return false;
    }

    // If the password is not empty
    else if (password.value.toString().trim() === "") {

        // Updating the innerHTML
        warning.innerText = "Password cannot be empty";

        // Returning false
        return false;
    }

    // Otherwise return true
    else {
        return true;
    }
}

// Adding an event listener to the document for the DOMContentLoaded to hide the warning
document.addEventListener("DOMContentLoaded", hideWarning)

// Adding an event listener to the submit button for checking all the fields and submitting the form
submit_button.addEventListener("click", function () {

    // Defining a bool to check the details
    var details_correct = checkDetails();

    // If the function returns false
    if (!details_correct) {

        // Hide the warning
        showWarning();
    }

    // Else
    else {

        // Hide the warning
        hideWarning();

        // Submitting the form
        registered_form.submit();
    }
})