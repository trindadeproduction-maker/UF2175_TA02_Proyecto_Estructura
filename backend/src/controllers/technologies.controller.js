const technologiesModel = require("../models/technologies.model");


const getTechnologies = async (req, res) => {
    try {

        const technologies = await technologiesModel.getTechnologies();

        res.json(technologies);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Error del servidor" });
    }

};

const getTechnologiesById = async (req, res) => {
     const {id} = req.params;
    
     try {

        const technologies = await technologiesModel.getTechnologiesById(id);


    if (!technologies) {
        return res.status(404).json({ error: "No encontrado" });
    }
        res.json(technologies);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Error del servidor" });
    }

};


const createTechnologies = async (req, res) => {

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

const buildTechnologiesUpdate = (id, tecnologies) => {

    const {name, category} = tecnologies;

    if (!Number.isInteger(Number(id))) {
        return { error: "id debe ser un número entero" };
    }

    if (!name || name.length > 200) {
        return { error: "Nombre de la tecnologia es obligatorio" };
    }

    if (!category || category.length > 100) {
        return { error: "Introduce categoria" };
    }

    return {
        query: `
            UPDATE technologies
            SET name = $2, category = $3
            WHERE id = $1
            RETURNING *`,
        values: [id,name,category]
    };
};

const updateTechnologies = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "El body no puede estar vacio" });
        }

        const update = buildTechnologiesUpdate(id, req.body);

        if (update.error) {
            return res.status(400).json({ error: update.error });
        }

        const result = await pool.query(update.query, update.values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tecnologia no encontrada" });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTechnologies = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            DELETE FROM technologies
            WHERE id = $1
            RETURNING *
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tecnologia no encontrada" });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getTechnologies,
    getTechnologiesById,
    createTechnologies,
    updateTechnologies,
    deleteTechnologies
};