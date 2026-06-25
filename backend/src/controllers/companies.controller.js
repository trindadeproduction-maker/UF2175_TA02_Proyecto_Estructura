const pool = require("../config/db");

const getCompanies = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT *
            FROM companies
            ORDER BY name
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor" });
    }

};

const getCompaniesById = async (req, res) => {
    try {

        const {id} = req.params;

        const result = await pool.query(`
            SELECT *
            FROM companies
            WHERE id = $1
            ORDER BY name
        `,
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "No encontrado" });
    }
    
    res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor" });
    }

};

const buildCompaniesInsert = (companies) => {

    const COMPANY_SIZES = ["startup","small","medium","large","enterprise"];


    const {user_id, name, description,industry,size,location,website } = companies;


    if (!user_id || !Number.isInteger(user_id)) {
        return { error: "user_id debe ser un numero entero" };
    }

    if (!name || name.length>200) {
        return { error: "Nombre de la compañia es obligatoria"};
    }

    if(!description){
        return {error:"Introduce una breve descripcion"};
    }

    if(!industry || industry.length>100){
        return {error:"Introduce industria"};
    }

    if(!size || !COMPANY_SIZES.includes(size)){
        return {error: "size debe ser startup, small, medium, large o enterprise"};
    }


    if(!location || location.length>150){
        return {error:"Tienes que introducir una direccion"};
    }

    if(!website || website.length>300){
        return {error:"Tienes que introducir una pagina web correcta"};
    }

    const columns = ["user_id","name","description","industry","size","location","website"];
    const values = [user_id, name, description,industry,size,location,website];
    const params = ["$1", "$2","$3","$4","$5","$6","$7"];



    return {
        query: `
            INSERT INTO companies (${columns.join(", ")})
            VALUES (${params.join(", ")})
            RETURNING *`,
        values
    };
};

const createCompanies = async (req, res) => {

    try {

        if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
            return res.status(400).json({
                error: "El body no puede estar vacio"
            });
        }

        if (!Array.isArray(req.body)) {
            const insert = buildCompaniesInsert(req.body);

            if (insert.error) {
                return res.status(400).json({ error: insert.error });
            }

            const result = await pool.query(insert.query, insert.values);
            return res.status(201).json(result.rows[0]);
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            const insertedCompanies = [];

            for (const companies of req.body) {
                const insert = buildCompaniesInsert(companies);

                if (insert.error) {
                    await client.query("ROLLBACK");
                    return res.status(400).json({ error: insert.error });
                }

                const result = await client.query(insert.query, insert.values);
                insertedCompanies.push(result.rows[0]);
            }

            await client.query("COMMIT");
            return res.status(201).json(insertedCompanies);
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

const buildCompaniesUpdate = (id, companies) => {
    const COMPANY_SIZES = ["startup", "small", "medium", "large", "enterprise"];

    const { user_id, name, description, industry, size, location, website } = companies;

    if (!Number.isInteger(Number(id))) {
        return { error: "id debe ser un número entero" };
    }

    if (!user_id || !Number.isInteger(user_id)) {
        return { error: "user_id debe ser un número entero" };
    }

    if (!name || name.length > 200) {
        return { error: "Nombre de la compañia es obligatorio" };
    }

    if (!description) {
        return { error: "Introduce una breve descripcion" };
    }

    if (!industry || industry.length > 100) {
        return { error: "Introduce industria" };
    }

    if (!size || !COMPANY_SIZES.includes(size)) {
        return { error: "size debe ser startup, small, medium, large o enterprise" };
    }

    if (!location || location.length > 150) {
        return { error: "Tienes que introducir una direccion" };
    }

    if (!website || website.length > 300) {
        return { error: "Tienes que introducir una pagina web correcta" };
    }

    return {
        query: `
            UPDATE companies
            SET user_id = $1, name = $2, description = $3,
                industry = $4, size = $5, location = $6, website = $7
            WHERE id = $8
            RETURNING *`,
        values: [user_id, name, description, industry, size, location, website, id]
    };
};

const updateCompanies = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "El body no puede estar vacio" });
        }

        const update = buildCompaniesUpdate(id, req.body);

        if (update.error) {
            return res.status(400).json({ error: update.error });
        }

        const result = await pool.query(update.query, update.values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Empresa no encontrada" });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCompanies = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            DELETE FROM companies
            WHERE id = $1
            RETURNING *
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Empresa no encontrada" });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getCompanies,
    getCompaniesById,
    createCompanies,
    updateCompanies,
    deleteCompanies
};