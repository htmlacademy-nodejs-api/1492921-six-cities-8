const validateEmail = (email: string): boolean => {
  const regExpEmail: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regExpEmail.test(email);
};

export { validateEmail };
