# Importing the required libraries and objects
from flask import Flask, render_template, request, redirect, session, flash, jsonify
from flask_session import Session
import os
from helper import apology
from cs50 import SQL
from werkzeug.security import generate_password_hash, check_password_hash

# Setting up the flask application
app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


# Creating a SQL object for the database
db = SQL("sqlite:///database.db")


def create_and_init_db():
    """Creates and initializes the database."""

    # Checking if the database exists
    if not os.path.exists(os.path.join(os.getcwd(), "phonebook.db")):

        # Writing the database if it doesn't exist
        with open("phonebook.db", "w"):
            pass

    # Creating the SQL object
    db = SQL("sqlite:///database.db")

    # Executing SQL queries to create the tables
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS "users" (
            id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            username TEXT NOT NULL,
            hash TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL
        );
        """
    )
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS  "contacts" (
            id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            user_id INTEGER NOT NULL,
            first_name TEXT NOT NULL,
            middle_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            number TEXT NOT NULL
        );
        """
    )


# Ensures that the cache is removeed
@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Defining a route for the main page
@app.route("/")

# Defining a function for the main
def main_route():

    # Returning the redirect to login page
    return redirect("/login")


# Setting up the routes
@app.route("/register")

# Defining the register route's function
def register_route():

    # Clearing the session
    session.clear()

    # Returning the `index.html` template
    return render_template("register.html")


# Setting up the login route
@app.route("/login")

# Defining the login function
def login_route():

    # Clearing the session
    session.clear()

    # Returning the `login.html` template
    return render_template("login.html")


# Defining a route for the backend for the registration
@app.route("/register_be", methods=["POST"])

# Defining a function for the backend for the registration
def register_be():

    # Clearing the session
    session.clear()

    # Getting the data from the form
    username = request.form.get("username")
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    password = request.form.get("password")

    # Checking the database if the user exists
    does_user_exist = db.execute(
        """
            SELECT * FROM users WHERE username = ?
        """,
        username,
    )

    # If the length of the query returns 0
    if len(does_user_exist) != 0:

        # Returns an apology
        return apology("Username already exists")

    # If the length of the query is not zero, add the user to the database
    else:
        db.execute(
            """
                INSERT INTO users (username, hash, first_name, last_name)
                VALUES (?, ?, ?, ?)
            """,
            username,
            generate_password_hash(password),
            first_name,
            last_name,
        )

        # Flashing the message
        flash("Registered Successfully! ")

        # Redirecting the user
        return redirect("/login")


# Defining a route for the backend for the login
@app.route("/login_be", methods=["POST"])

# Defining a function for the backend for the login
def login_be():

    # Clearing the session
    session.clear()

    # Getting the username and the password
    username = request.form.get("username")
    password = request.form.get("password")

    # Checking if the user exists
    does_user_exist = db.execute(
        """
            SELECT * FROM users WHERE username = ?
        """,
        username,
    )

    # If the length of the query returns 0
    if len(does_user_exist) == 0:

        # Returns an apology
        return apology("Username doesn't exist")

    # If the length of the query is not zero
    else:

        # Checking if the password is correct
        if check_password_hash(does_user_exist[0]["hash"], password):

            # Setting the session
            session["user_id"] = does_user_exist[0]["id"]
            session["username"] = does_user_exist[0]["username"]
            session.modified = True

            # Redirecting the user
            return redirect("/home")

        # If the password is not correct
        else:

            # Returns an apology
            return apology("Incorrect Password")


# Defining a route for the home page
@app.route("/home")

# Defining the function for the home
def home_route():

    # If the user ID is not valid
    if not session["user_id"]:

        # Redirecting the user to login route
        return redirect("/login")

    # Rendering the template
    return render_template(
        "home.html", user_id=session["user_id"], username=session["username"]
    )


# Defining a route for adding the contact (backend)
@app.route("/add_contact_be", methods=["POST"])

# Defining the function for the route
def add_contact_be():

    # Getting the first name and the last name
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    middle_name = (
        request.form.get("middle_name") if request.form.get("middle_name") else "-"
    )
    mobile_number = request.form.get("mobile_number")

    # Checking if the user exists
    does_user_exist = db.execute(
        """
            SELECT * FROM contacts WHERE id = ?
            AND first_name = ? AND last_name = ? AND middle_name = ?
            AND number = ?
        """,
        session["user_id"],
        first_name,
        last_name,
        middle_name,
        mobile_number,
    )

    # If the length of the query returns 0
    if len(does_user_exist) != 0:

        # Returns an apology
        return apology("Contact already exists")

    # If the contact does not exists
    else:

        # Adding the contact
        db.execute(
            """
                INSERT INTO contacts (user_id, first_name, last_name, middle_name, number)
                VALUES (?, ?, ?, ?, ?)
            """,
            session["user_id"],
            first_name,
            last_name,
            middle_name,
            mobile_number,
        )

        # Flashing the message
        flash("Contact Added Successfully! ")

        # Redirecting the user
        return redirect("/home")


# Defining the route for getting the contacts as a list (backend)
@app.route("/get_contacts_be/<user_id>")

# Defining a function to get the details
def get_contacts_be(user_id: str):

    # Getting the contacts
    contacts = db.execute(
        """
            SELECT * FROM contacts WHERE user_id = ?
        """,
        user_id,
    )

    # Returning the contacts
    return jsonify(contacts)


# Defining a route for editing the contacts
@app.route("/edit_contact_be", methods=["POST"])

# Defining a function to update the contact
def edit_contact_be():

    # Getting the first name, last name, middle name, mobile number, contact id
    first_name = request.form.get("first_name")
    middle_name = (
        request.form.get("middle_name") if request.form.get("middle_name") else "-"
    )
    last_name = request.form.get("last_name")
    mobile_number = request.form.get("mobile_number")
    contact_id = request.form.get("contact_id")

    # Updating the database
    db.execute(
        """
        UPDATE contacts SET first_name = ?, middle_name = ?, last_name = ?, number = ?
        WHERE id = ?
        """,
        first_name,
        middle_name,
        last_name,
        mobile_number,
        contact_id,
    )

    # Flashing the message
    flash("Updated Successfully!")

    return redirect("/home")


# Defining a route for the delete function
@app.route("/delete_contact_be", methods=["POST"])


# Adding a function to the route
def delete_contact_be():

    # Getting the required details (first name, last name, middle name, number, contact ID)
    first_name = request.form.get("first_name")
    middle_name = request.form.get("middle_name")
    last_name = request.form.get("last_name")
    number = request.form.get("number")
    contact_id = request.form.get("contact_id")

    # Updating the database
    db.execute(
        """DELETE FROM contacts
        WHERE id = ? AND first_name = ? AND middle_name = ? AND last_name = ? AND number = ?
        """,
        contact_id,
        first_name,
        middle_name,
        last_name,
        number,
    )

    # Flashing the message
    flash("Deleted Successfully! ")

    # Returning a redirect to the home page
    return redirect("/home")


# If the file is used as a main file
if __name__ == "__main__":

    # Creating an initializing database
    create_and_init_db()

    # Running the app in debug mode
    app.run(debug=True)
