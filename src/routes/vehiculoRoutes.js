const express = require("express");
const router = express.Router(); //manejador de rutas de express
const vehiculoSchema = require("../models/vehiculoModels");
const administradorSchema = require("../models/administradorModels");
const verifyToken = require("./validate_token");

router.post("/vehiculo", verifyToken, async (req, res) => {
    try {
        const { tipoVehiculo, placa, fechaHoraIngreso, administradorId } = req.body;

        // Crear nuevo vehículo con referencia al administrador
        const vehiculo = new vehiculoSchema({
            tipoVehiculo,
            placa,
            fechaHoraIngreso,
            administrador: administradorId
        });

        const nuevoVehiculo = await vehiculo.save();

        // Agregar ID del vehículo al array de vehículos del administrador
        await administradorSchema.findByIdAndUpdate(administradorId, {
            $push: { vehiculos: nuevoVehiculo._id }
        });

        res.status(201).json(nuevoVehiculo);
    } catch (error) {
        res.status(500).json({ message: "Error al guardar vehículo", error: error.message });
    }
});


//consultar los vehiculos existentes en la base de datos

router.get("/vehiculos", (req, res) => {
    vehiculoSchema.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//consultar los vehiculos por id:
router.get("/vehiculos/:id", (req, res) => {
    const { id } = req.params;
    vehiculoSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Modificar el datos de vehiculo  por su id: 
router.put("/vehiculos/:id", (req, res) => {
    const { id } = req.params;
    const {
        tipoVehiculo,
        placa,
        fechaHoraIngreso,
        fechaHoraSalida,
        estado,
        ubicacion,
        tarifaAplicada,
        tiempoTotal
    } = req.body;

    vehiculoSchema
        .updateOne(
            { _id: id },
            {
                $set: {
                    tipoVehiculo,
                    placa,
                    fechaHoraIngreso,
                    fechaHoraSalida,
                    estado,
                    ubicacion,
                    tarifaAplicada,
                    tiempoTotal
                }
            }
        )
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
});

//eliminar vehiculo por id:
router.delete("/vehiculo/:id", async (req, res) => {
    try {
        const vehiculo = await vehiculoSchema.findByIdAndDelete(req.params.id);

        if (vehiculo) {
            await administradorSchema.findByIdAndUpdate(vehiculo.administrador, {
                $pull: { vehiculos: vehiculo._id }
            });
        }

        res.json(vehiculo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;