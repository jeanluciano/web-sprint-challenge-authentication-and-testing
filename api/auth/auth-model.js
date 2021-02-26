const db = require("../../data/dbConfig");

const insert = async (user) => {
    const [id] = await db("users").insert(user);

    return db("users").where({ id }).first();
};

const remove = async (id) => {
    return db("users").where(id).del();
};

const findBy = (filter) => {
    return db("Users as u")
        .select("u.id", "u.username", "u.password",)
        .where(filter);
};
module.exports = {
    insert,
    remove,
    findBy
};
