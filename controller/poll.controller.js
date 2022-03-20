function get(req, res, next) {
    try {
        res.json({
            title: 'What is your favorite programming language?',
            description: 'Choose one option.',
            options: ['Ruby', 'PHP', 'Java', 'Rust'],
        });
      } catch (err) {
        console.error(`Error while creating programming language`, err.message);
        next(err);
      }
    
}

module.exports = {
    get
};