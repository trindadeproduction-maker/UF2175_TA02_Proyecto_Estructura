const pool = require("../config/db");

const getTechnologies = async () => {

        const result = await pool.query(`
            SELECT *
            FROM technologies
            ORDER BY name
        `);

        return result.rows;


};

const getTechnologiesById = async (req,res,id) => {
    
        const technologies = await technologiesModel.getTechnologiesById(id);

        const result = await pool.query(`
            SELECT *
            FROM technologies
            WHERE id = $1
            ORDER BY name
        `,
        [id]
    );

    if (!technologies) {
        return res.status(404).json({ error: "No encontrado" });
    }
       return result.rows[0];


};

const buildTechnologiesInsert = (tecnologies) => {

    const {name, category} = tecnologies;

    if (!name || name.length>100) {
        return { error: "Nombre de la tecnologia es obligatoria"};
    }


    if(!category || category.length>100){
        return {error:"Introduce una categoria adecuada"};
    }

    const columns = ["name","category"];
    const values = [name, category];
    const params = ["$1", "$2"];

    return {
        query: `
            INSERT INTO technologies (${columns.join(", ")})
            VALUES (${params.join(", ")})
            RETURNING *`,
        values
    };
};

const createTechnologies = async () => {

    try {

        if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
            return res.status(400).json({
                error: "El body no puede estar vacio"
            });
        }

        if (!Array.isArray(req.body)) {
            const insert = technologiesModel.buildTechnologiesInsert(req.body);

            if (insert.error) {
                return res.status(400).json({ error: insert.error });
            }

            const result = await pool.query(insert.query, insert.values);
            return res.status(201).json(result.rows[0]);
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            const insertedTechnologies = [];

            for (const tecnologies of req.body) {
                const insert = technologiesModel.buildTechnologiesInsert(tecnologies);

                if (insert.error) {
                    await client.query("ROLLBACK");
                    return res.status(400).json({ error: insert.error });
                }

                const result = await client.query(insert.query, insert.values);
                insertedTechnologies.push(result.rows[0]);
            }

            await client.query("COMMIT");
            return res.status(201).json(insertedTechnologies);
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
    getTechnologies,
    getTechnologiesById,
    createTechnologies
};