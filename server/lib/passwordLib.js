module.exports = {
  generatePassword: async function (password) {
    if (password) {
    }

    const upperCases = 'ABCDEFGHJKLMNPRSTUVYZ';
    const lowerCases = 'abcdefghjkmnprstuvyz';
    const numbers = '0123456789';
    const symbols = '!@#$%&';

    const getRandom = (str) => str[Math.floor(Math.random() * str.length)];

    let generatedPassword = [
      getRandom(lowerCases),
      getRandom(numbers),
      getRandom(lowerCases),
      getRandom(numbers),
      getRandom(upperCases),
      getRandom(numbers),
      getRandom(symbols),
      getRandom(numbers)
    ].join('');

    generatedHash = await bcrypt.hash(generatedPassword, 10);

    return {
      hash: generatedHash,
      password: generatedPassword
    };
  }

};
