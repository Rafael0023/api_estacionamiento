const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router(); //manejador de rutas de express
const administradorSchema = require("../models/administradorModels");




// Crear un nuevo administrador

router.post('/signup', async (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    const administrador = new administradorSchema({
        nombre,
        correo,
        contrasena
    });
    administrador.contrasena = await administrador.encryptContrasena(administrador.contrasena);
    await administrador.save(); //save es un método de mongoose para guardar datos en MongoDB 
    //res.json(administrador);

    res.json({
        administrador
    });
  

});


//inicio de sesión
router.post("/login", async (req, res) => {

    // validaciones
    const { error } = administradorSchema.validate(req.body.correo, req.body.contrasena);
    if (error) return res.status(400).json({ error: error.details[0].message });
    //Buscando el usuario por su dirección de correo
    const administrador = await administradorSchema.findOne({ correo: req.body.correo });
    //validando si no se encuentra
    if (!administrador) return res.status(400).json({ error: "Usuario no encontrado" });
    //Transformando la contraseña a su valor original para 
    //compararla con la clave que se ingresa en el inicio de sesión
    const contrasenaValida = await bcrypt.compare(req.body.contrasena, administrador.contrasena);
    if (!contrasenaValida)
        return res.status(400).json({ error: "Clave no válida" });
    const token = jwt.sign({ id: administrador._id }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24, //un día en segundos tiempo valido para el  token
    });
    res.json({
        
        
        data: "Bienvenido(a)",
        auth: true,
        token,

    });

});



//odtener lista de administradores

router.get("/administrador", (req, res) => {
    administradorSchema.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});
//buscar administraor por su id
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
router.delete("/administrador/:id", (req, res) => {
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
