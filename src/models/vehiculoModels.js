const mongoose = require("mongoose"); // importando el componente mogoose

const vehiculoSchema = mongoose.Schema({
    tipoVehiculo: {
        type: String,
        required: true
    },
    placa: {
        type: String,
        required: true
    },
    fechaHoraIngreso: {
        type: Date,
        required: true
    },
    fechaHoraSalida: {
        type: Date,
        default: null
    },
    estado: {
        type: String,
        enum: ['activo', 'finalizado'],
        default: 'activo'
    },
    ubicacion: {
        type: String,
        default: ''
    },
    tarifaAplicada: {
        type: Number,
        default: 0
    },
    tiempoTotal: {
        type: String,
        default: ''
    },
    administrador: { type: mongoose.Schema.Types.ObjectId, ref: "administrador" }
});

// Exportamos el modelo
module.exports = mongoose.model("vehiculo", vehiculoSchema);