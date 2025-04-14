const express = require("express");
const router = express.Router(); //manejador de rutas de express
const vehiculoSchema = require("../models/vehiculoModels");
const administradorSchema = require("../models/administradorModels");



// Crear un nuevo administrador

router.post('/signup', async (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    const administrador = new administradorSchema({
        administrador : nombre,
        correo: correo,
        contrasena: contrasena
    });
    administrador.contrasena = await administrador.encryptContrasena(administrador.contrasena);
    await administrador.save(); //save es un método de mongoose para guardar datos en MongoDB 
    res.json(administrador);
});




router.get("/administrador", (req, res) => {
    administradorSchema.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get("/administrador/:id", async (req, res) => {
    try {
        const administrador = await administradorSchema.findById(req.params.id).populate("vehiculos");
        if (!administrador) return res.status(404).json({ message: "Administrador no encontrado" });
        res.json(administrador);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Modificar el datos de administrador por su id: 
router.put("/administrador/:id", (req, res) => {
    const { id } = req.params;
    const {
        nombre,
        correo,
        contrasena,
    } = req.body;

    administradorSchema
        .updateOne(
            { _id: id },
            {
                $set: {
                    nombre,
                    correo,
                    contrasena,
                }
            }
        )
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
});

//eliminar administrador por id:
router.delete("/administrador:id", (req, res) => {
    const { id } = req.params;
    administradorSchema
        .findByIdAndDelete(id)
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.json({ message: error });
        });
});

module.exports = router;
