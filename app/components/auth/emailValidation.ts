const LOWERCASE_EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

export const getLowercaseEmailError = (email: string) => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return "Please enter your email address.";
  }

  if (trimmedEmail !== trimmedEmail.toLowerCase()) {
    return "Email must be in lowercase letters only.";
  }

  if (!LOWERCASE_EMAIL_PATTERN.test(trimmedEmail)) {
    return "Please enter a valid email address.";
  }

  return "";
};