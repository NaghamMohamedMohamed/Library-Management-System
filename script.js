import * as B from "./classes.js";

// Upon Loading the DOM
document.addEventListener("DOMContentLoaded", () => {

    // DOM Elements
    const inputContainer = document.getElementById("userInput");
    const booksNumInput = document.getElementById("booksNum");

    const booksForm = document.getElementById("BooksInput");
    const addBookButton = document.getElementById("addBook");
    const resetButton = document.querySelector("button[type='reset']");

    const bNameInput = document.getElementById("BName");
    const priceInput = document.getElementById("Price");
    const aNameInput = document.getElementById("AName");
    const authorEmailInput = document.getElementById("AuthorEmail");

    const bookNameError = document.getElementById("bookNameError");
    const priceError = document.getElementById("priceError");
    const authorNameError = document.getElementById("authorNameError");
    const emailError = document.getElementById("emailError");

    const booksTable = document.getElementById("BooksDataBase");
    const booksTableBody = document.getElementById("BooksTableInfo");


    // Global variables
    let books = [];
    let booksNum = 0;

    /*********************** First Page : Books Number Input ***********************/

    // OK Button Event Listener
    document.getElementById("okButton").addEventListener("click", () => {
        booksNum = parseInt(booksNumInput.value.trim());

        if (!isNaN(booksNum) && booksNum > 0) 
        {
            // Hide the first page
            inputContainer.style.display = "none"; 
            // Show the form
            booksForm.style.display = "block"; 
        } 
        else 
        {
            alert("Please enter a valid number of books.");
        }
    });

    /*********************** Second Page : Books Info Input Form ***********************/

    // Real-time validation on input fields
    bNameInput.addEventListener("input", () => validateName(bNameInput.value, bookNameError));
    priceInput.addEventListener("input", () => validatePrice(priceInput.value));
    aNameInput.addEventListener("input", () => validateName(aNameInput.value, authorNameError));
    authorEmailInput.addEventListener("input", () => validateEmail(authorEmailInput.value));


    // Validation Functions for the book's info form
    function validateName(name, errorElement) 
    {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!name.trim()) 
        {
            errorElement.textContent = "This field is required";
            return false;
        }
        if (!nameRegex.test(name)) 
        {
            errorElement.textContent = "Name must contain letters only!";
            return false;
        }
        errorElement.textContent = "";
        return true;
    }

    function validatePrice(price) 
    {
        if (!price.trim()) 
        {
            priceError.textContent = "This field is required";
            return false;
        }
        if (isNaN(price) || parseFloat(price) <= 0) 
        {
            priceError.textContent = "Price must be a positive number!";
            return false;
        }
        priceError.textContent = "";
        return true;
    }

    function validateEmail(email) 
    {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.trim()) 
        {
            emailError.textContent = "This field is required";
            return false;
        }
        if (!emailRegex.test(email)) 
        {
            emailError.textContent = "Not a valid e-mail address";
            return false;
        }
        emailError.textContent = "";
        return true;
    }

    // Add Book Button Click Event
    addBookButton.addEventListener("click", () => {
        const bookName = bNameInput.value.trim();
        const price = priceInput.value.trim();
        const authorName = aNameInput.value.trim();
        const authorEmail = authorEmailInput.value.trim();

        let isValid = true;

        if (!validateName(bookName, bookNameError)) isValid = false;
        if (!validatePrice(price)) isValid = false;
        if (!validateName(authorName, authorNameError)) isValid = false;
        if (!validateEmail(authorEmail)) isValid = false;

        if (isValid) 
        {
            if (books.length < booksNum) 
            {
                books.push({
                    name: bookName,
                    price: parseFloat(price).toFixed(2),
                    author: authorName,
                    email: authorEmail
                });

                alert("Book was added successfully!");

                // Clear input fields
                bNameInput.value = "";
                priceInput.value = "";
                aNameInput.value = "";
                authorEmailInput.value = "";
            }

            if (books.length === booksNum) 
            {
                alert("All books have been added.");
                booksForm.style.display = "none"; 
                booksTable.style.display = "block"; 
            }
        }
    });

    // Reset Button Functionality
    resetButton.addEventListener("click", () => {
        bNameInput.value = "";
        priceInput.value = "";
        aNameInput.value = "";
        authorEmailInput.value = "";

        bookNameError.textContent = "";
        priceError.textContent = "";
        authorNameError.textContent = "";
        emailError.textContent = "";
    });

    /*********************** Third Page : Displaying Books Details With Editing Options ***********************/

    // Function to display books in the table
    function displayBooks() 
    {
        // Clear previous table rows to prevent overwriting
        booksTableBody.innerHTML = "";
        /* For each new book added , create a new row to display its details */
        books.forEach((book, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><span class="text">${book.name}</span><input class="edit-input" type="text" value="${book.name}" style="display:none;"></td>
                <td><span class="text">${book.price}</span><input class="edit-input" type="number" value="${book.price}" style="display:none;"></td>
                <td><span class="text">${book.author}</span><input class="edit-input" type="text" value="${book.author}" style="display:none;"></td>
                <td><span class="text">${book.email}</span><input class="edit-input" type="email" value="${book.email}" style="display:none;"></td>
                <td>
                    <button class="edit-btn" onclick="editBook(${index}, this)">Edit</button>
                    <button class="save-btn" onclick="saveBook(${index}, this)" style="display:none;">Save</button>
                    <button class="cancel-btn" onclick="cancelEdit(${index}, this)" style="display:none;">Cancel</button>
                    <button class="delete-btn" onclick="deleteBook(${index})">Delete</button>
                </td>
            `;
            booksTableBody.appendChild(row);
        });
        booksTable.style.display = "block";
    }

    // Show table when all books are added
    document.getElementById("addBook").addEventListener("click", () => {
        if ( books.length === booksNum) 
        {
            displayBooks();
        }
    });

    // Upon pressing edit button in a specific row , replace the edit , delete buttons with the save , cancel buttons 
    // and allow writing/editing in the table fields of theis specific row.
    window.editBook = function(index, btn) 
    {
        const row = btn.closest("tr") ;

        // Hides all static ( non-editable ) text inside <span> elements ( rows ).
        // Shows the corresponding input fields ( .edit-input ) to allow user modifications.
        row.querySelectorAll(".text").forEach(el => el.style.display = "none");
        row.querySelectorAll(".edit-input").forEach(el => el.style.display = "inline-block");

        // Hides the "Edit" and "Delete" buttons & Shows the "Save" and "Cancel" buttons.
        row.querySelector(".edit-btn").style.display = "none";
        row.querySelector(".delete-btn").style.display = "none";
        row.querySelector(".save-btn").style.display = "inline-block";
        row.querySelector(".cancel-btn").style.display = "inline-block";
    };

    // Upon pressing edit button and then save in a specific row , it saves the changes made in the specific row by replacing the old/exisitng
    // values of te book object at specific index by the new values/changes.
    window.saveBook = function(index, btn) 
    {
        // Locates the nearest row that contains the button (i.e., the current row in the table).
        const row = btn.closest("tr");

        // Updates the books object at index with new input values
        books[index] = {
            // Gets the : updated book name , book price , author name , email respectively and stores them in the object attributes.
            name: row.querySelector("td:nth-child(1) .edit-input").value,
            price: row.querySelector("td:nth-child(2) .edit-input").value,
            author: row.querySelector("td:nth-child(3) .edit-input").value,
            email: row.querySelector("td:nth-child(4) .edit-input").value
        };
        displayBooks();
    };

    // Upon pressing edit button and then cancel in a specific row , it cancel all changes made in this row and display it as it is
    //  before editing in its info fields.
    window.cancelEdit = function() 
    {
        displayBooks();
    };

    // Upon pressing delete button in a specific row , it deletes this entire row
    window.deleteBook = function(index) 
    {
        // Removes 1 element/object from the books array of objects at the specified index.
        books.splice(index, 1);
        displayBooks();
    };

});
