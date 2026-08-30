/* ======================================
SHOPX AUTHENTICATION
Frontend Demo
====================================== */

/* ======================================
REGISTER
====================================== */

const registerForm =
document.getElementById("registerForm");

if (registerForm) {

```
registerForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim().toLowerCase();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const terms =
        document.getElementById("terms").checked;


    /* Password check */

    if (password !== confirmPassword) {

        showAuthToast(
            "Passwords do not match!"
        );

        return;

    }


    if (password.length < 6) {

        showAuthToast(
            "Password must contain at least 6 characters."
        );

        return;

    }


    if (!terms) {

        showAuthToast(
            "Please accept the Terms & Conditions."
        );

        return;

    }


    /* Get existing users */

    let users =
        JSON.parse(
            localStorage.getItem("shopxUsers")
        ) || [];


    /* Check existing email */

    const existingUser =
        users.find(
            user => user.email === email
        );


    if (existingUser) {

        showAuthToast(
            "An account with this email already exists."
        );

        return;

    }


    /* Create user */

    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        password: password,

        createdAt: new Date().toISOString()

    };


    users.push(newUser);


    /* Save user */

    localStorage.setItem(
        "shopxUsers",
        JSON.stringify(users)
    );


    showAuthToast(
        "Account created successfully! 🎉"
    );


    /* Redirect */

    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 1500);

});
```

}

/* ======================================
LOGIN
====================================== */

const loginForm =
document.getElementById("loginForm");

if (loginForm) {


loginForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        document.getElementById("loginPassword").value;


    /* Get users */

    const users =
        JSON.parse(
            localStorage.getItem("shopxUsers")
        ) || [];


    /* Find user */

    const user =
        users.find(
            user =>
                user.email === email &&
                user.password === password
        );


    if (!user) {

        showAuthToast(
            "Invalid email or password ❌"
        );

        return;

    }


    /* Create login session */

    const session = {

        id: user.id,

        name: user.name,

        email: user.email,

        loggedInAt: new Date().toISOString()

    };


    localStorage.setItem(
        "shopxCurrentUser",
        JSON.stringify(session)
    );


    showAuthToast(
        `Welcome back, ${user.name}! 👋`
    );


    setTimeout(() => {

        window.location.href =
            "index.html";

    }, 1200);

});
```

}

/* ======================================
FORGOT PASSWORD
====================================== */

function forgotPassword(event) {

```
event.preventDefault();

const email =
    prompt(
        "Enter your registered email:"
    );


if (!email) return;


const users =
    JSON.parse(
        localStorage.getItem("shopxUsers")
    ) || [];


const user =
    users.find(
        user =>
            user.email ===
            email.trim().toLowerCase()
    );


if (!user) {

    showAuthToast(
        "Email address not found."
    );

    return;

}


alert(
    "For this frontend demo, password reset is simulated.\n\nReal password reset requires a backend/email service."
);
```

}

/* ======================================
TOAST
====================================== */

function showAuthToast(message) {

```
const toast =
    document.getElementById("authToast");


if (!toast) return;


toast.textContent = message;

toast.classList.add("show");


setTimeout(() => {

    toast.classList.remove("show");

}, 2500);


}
