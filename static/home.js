// Getting the required elements
var first_name = document.getElementById("first_name");
var last_name = document.getElementById("last_name");
var mobile_number = document.getElementById("mobile_number");
var submit_button = document.getElementById("submit_button");
var form = document.getElementById("form");
var warning = document.getElementById("warning");
var table = document.getElementById("table");
var editModal = document.getElementById("editModal");
var deleteModal = document.getElementById("deleteModal");
var warning_edit = document.getElementById("warning_edit");
var first_name_edit = document.getElementById("first_name_edit");
var last_name_edit = document.getElementById("last_name_edit");
var mobile_number_edit = document.getElementById("mobile_number_edit");
var submit_button_edit = document.getElementById("submit_button_edit");
var form_delete = document.getElementById("form_delete");
var submit_button_delete = document.getElementById("delete_contact_button");


// A function to hide the warning text
function hideWarning() {
    warning.style.display = "none";
}

// A function to show the warning text
function showWarning() {
    warning.style.display = "block";
}

// A function to hide the warning text for the Edit Modal
function hideWarningEdit() {
    warning_edit.style.display = "none";
}

// A function to show the warning text for the Edit Modal
function showWarningEdit() {
    warning_edit.style.display = "block";
}

// Checking the details in the form
function checkDetails() {

    // If the username is not empty
    if (first_name.value.toString().trim() === "") {

        // Updating the innerHTML
        warning.innerHTML = "First Name cannot be empty";

        // Returning false
        return false;
    }

    // If the password is not empty
    else if (last_name.value.toString().trim() === "") {

        // Updating the innerHTML
        warning.innerText = "Last Name cannot be empty";

        // Returning false
        return false;
    }

    // If the mobile number is empty
    else if (mobile_number.value.toString().trim() == "") {

        // Updating the innerHTML
        warning.innerText = "Mobile Number cannot be empty";

        // Returning false
        return false;
    }

    // If the mobile number is minimum 10 characters long
    else if (mobile_number.value.toString().trim().length != 10) {

        // Updating the innerHTML
        warning.innerText = "Mobile Number should be only 10 characters long";

        // Returning false
        return false;
    }

    // Otherwise return true
    else {
        return true;
    }
}

// A function to check the edit details
function checkEditDetails() {

    // If the username is not empty
    if (first_name_edit.value.toString().trim() === "") {

        // Updating the innerHTML
        warning_edit.innerHTML = "First Name cannot be empty";

        // Returning false
        return false;
    }

    // If the password is not empty
    else if (last_name_edit.value.toString().trim() === "") {

        // Updating the innerHTML
        warning_edit.innerText = "Last Name cannot be empty";

        // Returning false
        return false;
    }

    // If the mobile number is empty
    else if (mobile_number_edit.value.toString().trim() == "") {

        // Updating the innerHTML
        warning_edit.innerText = "Mobile Number cannot be empty";

        // Returning false
        return false;
    }

    // If the mobile number is minimum 10 characters long
    else if (mobile_number_edit.value.toString().trim().length != 10) {

        // Updating the innerHTML
        warning_edit.innerText = "Mobile Number should be only 10 characters long";

        // Returning false
        return false;
    }

    // Otherwise return true
    else {
        return true;
    }
}


// Defining a function to update the contacts
function updateContacts() {

    // Fetching over the custom URL with the custom User ID
    fetch("/get_contacts_be/" + userId)

        // Converting the response to JSON
        .then(response => response.json())

        // Processing the data
        .then(data => {

            // Checking if there are no contacts
            if (data.length == 0) {

                // Changing the innerHTML of the table tag
                table.innerHTML = "No Contacts Found";
            }

            // Otherwise
            else {

                // Clearing the innerHTML
                table.innerHTML = "";

                // Changing the innerHTML
                table.innerHTML = `
                
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Middle Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Contact Number</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>`

                // For each element in the list
                for (var i = 0; i < data.length; i++) {

                    // Adding to the table tag
                    table.innerHTML += `
                    <tbody>
                        <tr>
                            <th scope="row">${i + 1}</th>
                            <td>${data[i]["first_name"]}</td>
                            <td>${data[i]["middle_name"]}</td>
                            <td>${data[i]["last_name"]}</td>
                            <td>${data[i]["number"]}</td>
                            <td>
                                <button type="button" class="btn btn-link" onclick="openEditModal(${data[i]["id"]}, '${data[i]["first_name"]}', '${data[i]["middle_name"]}','${data[i]["last_name"]}', '${data[i]["number"]}')" data-bs-toggle="modal" data-bs-target="#editModal">
                                    <span class="text-primary material-symbols-outlined">
                                        edit
                                    </span>
                                </button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="deleteContact(${data[i]["id"]}, '${data[i]["first_name"]}', '${data[i]["middle_name"]}','${data[i]["last_name"]}', '${data[i]["number"]}')">
                                    <span class="text-danger material-symbols-outlined">
                                        delete
                                    </span>
                                </button>
                            </td>
                        </tr>
                        
                    </tbody>
                    `
                }
            }
        })
}


// Defining a function to change the edit modal

// Accepting 5 arguments for ID, First Name, Middle Name, Last Name and Mobile Number
function openEditModal(id, first_name, middle_name, last_name, number) {

    // Getting the form from the edit modal
    var form = editModal.getElementsByTagName("form")[0].getElementsByClassName("mb-3 text-start");

    // Changing the input of the first name
    form[0].getElementsByTagName("input")[0].value = first_name;

    // Changing the input of the middle name
    form[1].getElementsByTagName("input")[0].value = middle_name;

    // Changing the input of the last name
    form[2].getElementsByTagName("input")[0].value = last_name;

    // CHanging the input of the mobile number
    form[3].getElementsByTagName("input")[0].value = number;

    // Changing the value of the Contact ID
    var editId = document.getElementById("contact_id");
    var contactId = (editModal.getElementsByClassName("hidden_contact_id")[0]);

    // Changing the innerHTML of the tag
    editId.innerHTML = `#${id}`
    contactId.value = id;
}


// Defining a function to delete the contact
function deleteContact(id, first_name, middle_name, last_name, number) {

    // Logging the data
    console.log(id, first_name, last_name, middle_name, number);

    // Changing the innerHTML
    document.getElementById("first_name_delete").innerHTML = first_name;
    document.getElementById("last_name_delete").innerHTML = last_name;
    document.getElementById("middle_name_delete").innerHTML = middle_name;
    document.getElementById("mobile_number_delete").innerHTML = number;
    document.getElementById("first_name_delete_input").value = first_name;
    document.getElementById("last_name_delete_input").value = last_name;
    document.getElementById("middle_name_delete_input").value = middle_name;
    document.getElementById("number_delete_input").value = number;
    document.getElementById("contact_id_delete_input").value = id;

}


// Adding an Event Listener to the DOM Content for hiding the add contact warning
document.addEventListener("DOMContentLoaded", hideWarning);

// Adding an Event Listener to the DOM Content for hiding the edit contact warning
document.addEventListener("DOMContentLoaded", hideWarningEdit);

// Adding an Event Listener to the DOM Content for updating the contact
document.addEventListener("DOMContentLoaded", updateContacts);

// Adding an Event Listener to the submit button for submitting the form
submit_button.addEventListener("click", function () {

    // Checking the details of the form
    var check = checkDetails();

    // If the function returns false
    if (!check) {

        // Show the warning
        showWarning();
    }

    // Otherwise
    else {

        // Submitting the form
        form.submit();

        // Dismissing the warning
        hideWarning();

        // Running the update contacts function
        updateContacts();
    }
});



// Adding an Event Listener to the submit button
submit_button_edit.addEventListener("click", function () {

    // Checking the edit modal's input details
    var check = checkEditDetails();

    // If the function returns false
    if (!check) {

        // Show the warning
        showWarningEdit();
    }

    // Otherwise
    else {

        // Submit the form
        form_edit.submit();

        // Hide the warning for the edit modal
        hideWarningEdit();

        // Updating the list of contacts
        updateContacts();
    }
})


// Adding an event listener to the delete button
submit_button_delete.addEventListener("click", function () {
    form_delete.submit();
    updateContacts();
})