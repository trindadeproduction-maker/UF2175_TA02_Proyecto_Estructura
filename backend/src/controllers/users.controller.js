const pool = require("../config/db");

const getUsers = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT *
            FROM users
            ORDER BY email
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Error del servidor" });
    }

}

const getUsersByid = async (req, res) => {
    try {

        const {id} = req.params;

        const result = await pool.query(`
            SELECT *
            FROM users
            WHERE id = $1
            ORDER BY email
        `,[id]);

        if(result.rows.length === 0){
            return res.status(404).json({error:"Usuario no encontrado"});
        };
        res.json(result.rows[0]);

    } catch (error) {

         console.error(error);
        res.status(500).json({ error: "Error del servidor" });
    }

}

const buildUsersInsert = (users) => {

    const ROLE = ["candidate","company","headhunter","admin"];


    const {email, password_hash, role} = users;


    if(!email || email.length > 255){
        return {error: "Introduce un email valido"};
    }


    if(!role || !ROLE.includes(role)){
        return {error: "El rol debe ser: candidato,empresa,headhunter"};
    }
    const columns = ["email","password_hash","role"];
    const values = [email,password_hash,role];
    const params = ["$1", "$2","$3"];



    return {
        query: `
            INSERT INTO users (${columns.join(", ")})
            VALUES (${params.join(", ")})
            RETURNING *`,
        values
    };
};

//Falta insertar el createUsers
const createUsers = async (req, res) => {

    try {

        if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
            return res.status(400).json({
                error: "El body no puede estar vacio"
            });
        }

        if (!Array.isArray(req.body)) {
            const insert = buildUsersInsert(req.body);

            if (insert.error) {
                return res.status(400).json({ error: insert.error });
            }

            const result = await pool.query(insert.query, insert.values);
            return res.status(201).json(result.rows[0]);
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            const insertedUsers = [];

            for (const users of req.body) {
                const insert = buildUsersInsert(users);

                if (insert.error) {
                    await client.query("ROLLBACK");
                    return res.status(400).json({ error: insert.error });
                }

                const result = await client.query(insert.query, insert.values);
                insertedUsers.push(result.rows[0]);
            }

            await client.query("COMMIT");
            return res.status(201).json(insertedUsers);
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



module.exports = {
getUsers,
getUsersByid,
createUsers
}