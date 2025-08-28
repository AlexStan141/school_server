export const validateEmail = (email) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const validatePassword = (password) => {
  var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return re.test(password);
}