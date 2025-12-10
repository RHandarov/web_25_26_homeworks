let submitHandler = async function(event) {
    event.preventDefault();
    const fields = parseFormFields(event);
    const errors = validateFormFields(fields);
    if (errors.length > 0) {
        // display errors to clients
    } else {
        let users = await getAllUsers();
        console.log(users);
    }
}

function parseFormFields(event) {
    const formData = new FormData(event.target);
    return Object.fromEntries(formData.entries());
}

function validateFormFields(fields) {
    const errors = [];

    const username = fields.username;
    if (!username || username.length < 3 || username.length > 10) {
        errors.push("Потребителското име трябва да има между 3 и 10 символа!");
    }

    const name = fields.name;
    if (!name || name.length > 50) {
        errors.push("Първото име трябва да има най-много 50 символа!");
    }

    const familyName = fields["family-name"];
    if (!familyName || familyName.length > 10) {
        errors.push("Фамилното име трябва да има най-много 50 символа!");
    }

    const email = fields.email;
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!email || !email.match(emailRegex)) {
        errors.push("Имейлът не е валиден!");
    }

    const password = fields.password;
    if (!password || password.length < 6 || password.length > 10 || isPasswordOnlyInOneCase(password)) {
        errors.push("Паролата трябва да е между 6 и 10 символа и да има главни и малки букви!");
    }

    const postalCode = fields["postal-code"];
    const postalCodeRegex = "\d\d\d\d\d-\d\d\d\d";
    if (!postalCode && postalCode != "" || postalCode.match(postalCodeRegex)) {
        errors.push("Пощенският код трябва да е във формат 11111-1111!");
    }

    return errors;
}

function isPasswordOnlyInOneCase(password) {
    return hasOnlyLowerCaseLetters(password) || hasOnlyUpperCaseLetters(password);
}

function hasOnlyUpperCaseLetters(password) {
    for (let index = 0; index < password.length; ++index) {
        const character = password.charAt(index);
        if (character >= 'a' && character <= 'z') {
            return false;
        }
    }

    return true;
}

function hasOnlyLowerCaseLetters(password) {
    for (let index = 0; index < password.length; ++index) {
        const character = password.charAt(index);
        if (character >= 'A' && character <= 'Z') {
            return false;
        }
    }

    return true;
}

async function getAllUsers() {
    try {
        let request = await makeGetRequest("https://jsonplaceholder.typicode.com/users");
        return JSON.parse(request);
    } catch (error) {
        console.error(error);
    }
};

function makeGetRequest(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.responseText);
            }
        };

        xhr.open("GET", url, true);
        xhr.send(null);
    });
}

let form = document.getElementById("registration-form");
form.addEventListener("submit", submitHandler);