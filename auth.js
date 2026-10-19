
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const form = $("authForm");
  const loginTab = $("loginTab");
  const signupTab = $("signupTab");
  const switchModeButton = $("switchMode");
  const statusMessage = $("statusMessage");

  const nameGroup = $("nameGroup");
  const confirmGroup = $("confirmGroup");
  const rememberRow = $("rememberRow");
  const termsRow = $("termsRow");

  const fullName = $("fullName");
  const email = $("email");
  const password = $("password");
  const confirmPassword = $("confirmPassword");

  const forgotPassword = $("forgotPassword");
  const submitButton = $("submitButton");

  let currentMode = "login";

  /*
    FRONTEND DEMO ONLY.

    This stores demo credentials in localStorage.
    Never store real passwords this way in production.
    Replace this demo logic with a secure backend API.
  */

  const DEMO_STORAGE_KEY = "nova-demo-accounts";

  function getDemoAccounts() {
    try {
      const accounts = JSON.parse(
        localStorage.getItem(DEMO_STORAGE_KEY) || "{}"
      );

      return accounts &&
        typeof accounts === "object" &&
        !Array.isArray(accounts)
        ? accounts
        : {};
    } catch {
      return {};
    }
  }

  function saveDemoAccounts(accounts) {
    try {
      localStorage.setItem(
        DEMO_STORAGE_KEY,
        JSON.stringify(accounts)
      );

      return true;
    } catch {
      showStatus(
        "Browser storage is unavailable. Please enable local storage to test this demo.",
        "error"
      );

      return false;
    }
  }

  function setError(id, message) {
    const errorElement = $(id);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function clearErrors() {
    [
      "nameError",
      "emailError",
      "passwordError",
      "confirmError",
      "termsError"
    ].forEach((id) => setError(id, ""));

    [fullName, email, password, confirmPassword].forEach((input) => {
      input.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
    });
  }

  function markInvalid(input, errorId, message) {
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    setError(errorId, message);
  }

  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.hidden = false;
  }

  function clearStatus() {
    statusMessage.textContent = "";
    statusMessage.className = "status-message";
    statusMessage.hidden = true;
  }

  function setMode(mode) {
    currentMode = mode;
    const isSignup = mode === "signup";

    clearErrors();
    clearStatus();

    nameGroup.hidden = !isSignup;
    confirmGroup.hidden = !isSignup;
    termsRow.hidden = !isSignup;
    rememberRow.hidden = isSignup;
    forgotPassword.hidden = isSignup;

    fullName.required = isSignup;
    confirmPassword.required = isSignup;

    password.autocomplete = isSignup
      ? "new-password"
      : "current-password";

    loginTab.classList.toggle("active", !isSignup);
    signupTab.classList.toggle("active", isSignup);

    loginTab.setAttribute("aria-selected", String(!isSignup));
    signupTab.setAttribute("aria-selected", String(isSignup));

    $("formEyebrow").textContent = isSignup
      ? "JOIN THE NOVA COMMUNITY"
      : "WELCOME BACK";

    $("formTitle").innerHTML = isSignup
      ? "Create account<span>.</span>"
      : "Sign in<span>.</span>";

    $("formSubtitle").textContent = isSignup
      ? "Create your account and discover something new."
      : "Enter your details to access your account.";

    $("submitText").textContent = isSignup
      ? "Create Account"
      : "Sign In";

    $("switchPrompt").firstChild.textContent = isSignup
      ? "Already have an account? "
      : "Don't have an account? ";

    switchModeButton.textContent = isSignup
      ? "Sign in"
      : "Create one";

    if (isSignup) {
      email.autocomplete = "email";
    }

    password.value = "";
    confirmPassword.value = "";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateForm() {
    clearErrors();

    let valid = true;
    const nameValue = fullName.value.trim();
    const emailValue = email.value.trim().toLowerCase();
    const passwordValue = password.value;

    if (currentMode === "signup") {
      if (nameValue.length < 2) {
        markInvalid(
          fullName,
          "nameError",
          "Please enter your full name."
        );
        valid = false;
      }

      if (nameValue.length > 80) {
        markInvalid(
          fullName,
          "nameError",
          "Name must be 80 characters or fewer."
        );
        valid = false;
      }
    }

    if (!isValidEmail(emailValue)) {
      markInvalid(
        email,
        "emailError",
        "Please enter a valid email address."
      );
      valid = false;
    }

    if (passwordValue.length < 8) {
      markInvalid(
        password,
        "passwordError",
        "Password must be at least 8 characters."
      );
      valid = false;
    } else if (passwordValue.length > 128) {
      markInvalid(
        password,
        "passwordError",
        "Password must be 128 characters or fewer."
      );
      valid = false;
    }

    if (
      currentMode === "signup" &&
      confirmPassword.value !== passwordValue
    ) {
      markInvalid(
        confirmPassword,
        "confirmError",
        "Passwords do not match."
      );
      valid = false;
    }

    if (
      currentMode === "signup" &&
      !$("acceptTerms").checked
    ) {
      setError(
        "termsError",
        "Please accept the demo terms to continue."
      );
      valid = false;
    }

    return valid;
  }

  function redirectToStore() {
    showStatus(
      "Demo login successful! Redirecting to NOVA...",
      "success"
    );

    submitButton.disabled = true;

    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 900);
  }

  function handleSignup() {
    const emailValue = email.value.trim().toLowerCase();
    const accounts = getDemoAccounts();

    if (accounts[emailValue]) {
      markInvalid(
        email,
        "emailError",
        "An account with this email already exists."
      );
      return;
    }

    /*
      Demo-only credential storage.
      Replace this section with POST /api/register.
    */

    accounts[emailValue] = {
      name: fullName.value.trim(),
      password: password.value,
      createdAt: new Date().toISOString()
    };

    if (!saveDemoAccounts(accounts)) {
      return;
    }

    showStatus(
      "Account created! You can now sign in with your email and password.",
      "success"
    );

    setMode("login");
    email.value = emailValue;

    showStatus(
      "Account created successfully. Please sign in.",
      "success"
    );

    password.focus();
  }

  function handleLogin() {
    const emailValue = email.value.trim().toLowerCase();
    const passwordValue = password.value;

    const accounts = getDemoAccounts();
    const account = accounts[emailValue];

    if (!account || account.password !== passwordValue) {
      showStatus(
        "Incorrect email or password. Please try again or create a demo account.",
        "error"
      );
      return;
    }

    /*
      In a real app, the backend should create a secure session.
      Do not treat this localStorage demo as secure authentication.
    */

    try {
      if ($("rememberMe").checked) {
        sessionStorage.setItem(
          "nova-demo-user",
          JSON.stringify({
            name: account.name,
            email: emailValue
          })
        );
      }
    } catch {
      // The demo login can still proceed without session storage.
    }

    redirectToStore();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearStatus();

    if (!validateForm()) {
      return;
    }

    if (currentMode === "signup") {
      handleSignup();
    } else {
      handleLogin();
    }
  });

  loginTab.addEventListener("click", () => setMode("login"));
  signupTab.addEventListener("click", () => setMode("signup"));

  switchModeButton.addEventListener("click", () => {
    setMode(currentMode === "login" ? "signup" : "login");
  });

  document.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = $(button.dataset.toggle);
      const showing = target.type === "password";

      target.type = showing ? "text" : "password";
      button.textContent = showing ? "Hide" : "Show";
      button.setAttribute(
        "aria-label",
        showing ? "Hide password" : "Show password"
      );
    });
  });

  forgotPassword.addEventListener("click", () => {
    clearStatus();

    showStatus(
      "Password reset is not connected in this demo. A real app should send a secure reset link to your email.",
      "error"
    );
  });

  $("termsLink").addEventListener("click", (event) => {
    event.preventDefault();

    showStatus(
      "This is a demo form. Add your official Terms & Conditions before publishing.",
      "error"
    );
  });

  [fullName, email, password, confirmPassword].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("invalid");
      input.removeAttribute("aria-invalid");

      const errorMap = {
        fullName: "nameError",
        email: "emailError",
        password: "passwordError",
        confirmPassword: "confirmError"
      };

      setError(errorMap[input.id], "");
    });
  });

  // Start on the login form.
  setMode("login");
})();


