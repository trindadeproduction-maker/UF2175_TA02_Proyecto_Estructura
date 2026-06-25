const salariesModel = require("../models/salaries.model");

// GET /salaries
const getAllSalaries = async (req, res) => {
    try {
        const salaries = await salariesModel.getAllSalaries();

        res.json(salaries);
    } catch (error) {
        console.error("Error al obtener salarios:", error);
        res.status(500).json({ message: "Error al obtener salarios" });
    }
};

// GET /salaries/:id
const getSalaryById = async (req, res) => {
    const { id } = req.params;

    try {
        const salary = await salariesModel.getSalaryById(id);

        if (!salary) {
            return res.status(404).json({ message: "Salario no encontrado" });
        }

        res.json(salary);
    } catch (error) {
        console.error("Error al obtener salario:", error);
        res.status(500).json({ message: "Error al obtener salario" });
    }
};

// POST /salaries
const createSalary = async (req, res) => {
    const {
        company_id,
        technology_id,
        role_name,
        amount,
        currency,
        experience_level,
    } = req.body;

    if (!role_name || !amount) {
        return res.status(400).json({
            message: "role_name y amount son obligatorios",
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            message: "amount debe ser mayor que 0",
        });
    }

    try {
        const salary = await salariesModel.createSalary(
            company_id,
            technology_id,
            role_name,
            amount,
            currency,
            experience_level
        );

        res.status(201).json({
            message: "Salario creado correctamente",
            salary,
        });
    } catch (error) {
        console.error("Error al crear salario:", error);

        if (error.code === "23503") {
            return res.status(400).json({
                message: "company_id o technology_id no existe",
            });
        }

        if (error.code === "23514") {
            return res.status(400).json({
                message: "amount debe ser mayor que 0",
            });
        }

        if (error.code === "22P02") {
            return res.status(400).json({
                message: "Valor inválido para experience_level",
            });
        }

        res.status(500).json({ message: "Error al crear salario" });
    }
};

// PUT /salaries/:id
const updateSalary = async (req, res) => {
    const { id } = req.params;

    const {
        company_id,
        technology_id,
        role_name,
        amount,
        currency,
        experience_level,
    } = req.body;

    if (
        company_id === undefined &&
        technology_id === undefined &&
        !role_name &&
        amount === undefined &&
        !currency &&
        !experience_level
    ) {
        return res.status(400).json({
            message: "Debes enviar al menos un campo para actualizar",
        });
    }

    if (amount !== undefined && amount <= 0) {
        return res.status(400).json({
            message: "amount debe ser mayor que 0",
        });
    }

    try {
        const salary = await salariesModel.updateSalary(
            id,
            company_id,
            technology_id,
            role_name,
            amount,
            currency,
            experience_level
        );

        if (!salary) {
            return res.status(404).json({ message: "Salario no encontrado" });
        }

        res.json({
            message: "Salario actualizado correctamente",
            salary,
        });
    } catch (error) {
        console.error("Error al actualizar salario:", error);

        if (error.code === "23503") {
            return res.status(400).json({
                message: "company_id o technology_id no existe",
            });
        }

        if (error.code === "23514") {
            return res.status(400).json({
                message: "amount debe ser mayor que 0",
            });
        }

        if (error.code === "22P02") {
            return res.status(400).json({
                message: "Valor inválido para experience_level",
            });
        }

        res.status(500).json({ message: "Error al actualizar salario" });
    }
};

// DELETE /salaries/:id
const deleteSalary = async (req, res) => {
    const { id } = req.params;

    try {
        const salary = await salariesModel.deleteSalary(id);

        if (!salary) {
            return res.status(404).json({ message: "Salario no encontrado" });
        }

        res.json({
            message: "Salario eliminado correctamente",
            salary,
        });
    } catch (error) {
        console.error("Error al eliminar salario:", error);
        res.status(500).json({ message: "Error al eliminar salario" });
    }
};

module.exports = {
    getAllSalaries,
    getSalaryById,
    createSalary,
    updateSalary,
    deleteSalary,
};