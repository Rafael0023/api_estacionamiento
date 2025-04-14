const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const administradorSchema = mongoose.Schema({
    nombre: {
        type: String,
      
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true
    },
    vehiculos: [{ type: mongoose.Schema.Types.ObjectId, ref: "vehiculo" }]
});

// Middleware para encriptar la contraseña automáticamente

administradorSchema.methods.encryptContrasena = async (contrasena) => {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(contrasena, salt);
    }

module.exports = mongoose.model("administrador", administradorSchema);
