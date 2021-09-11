const users = [
    { id: '1', firstName: 'Bill', age: 27 },
    { id: '2', firstName: 'Tommy', age: 30 },
    { id: '3', firstName: 'Sarah', age: 50 }
];

const find = id => {
    return new Promise((resolve, reject) => {
        const user = users.find(u => u.id === id);
        if (user) resolve(user);
        else reject(new Error(`User with id ${id} not found.`));
    });
}

module.exports = { find }
