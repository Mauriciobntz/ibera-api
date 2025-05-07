import { Router } from 'express';
import { producto } from './controller.js';
import { cliente } from './controller.js';
import { promocion } from './controller.js';
import { combo } from './controller.js';



export const router = Router();


// Rutas para productos
router.get('/productos', producto.getAll);
router.post('/producto', producto.add);
router.delete('/producto', producto.delete);
router.put('/producto', producto.update);



// Rutas para clientes
router.get('/clientes', cliente.getAll);
router.post('/cliente', cliente.add);
router.delete('/cliente', cliente.delete);
router.put('/cliente', cliente.update);
// Ruta para obtener solo los correos electrónicos
router.get('/clientes/emails', cliente.getEmails);

// Ruta para obtener solo los números de teléfono
router.get('/clientes/telefonos', cliente.getTelefonos);

// Ruta para obtener ambos (correos y teléfonos)
router.get('/clientes/emails-telefonos', cliente.getEmailsAndTelefonos);



// Rutas para promociones
router.get('/promociones', promocion.getAll);
router.post('/promocion', promocion.add);
router.delete('/promocion', promocion.delete);
router.put('/promocion', promocion.update);

// Rutas para combos
router.get('/combos', combo.getAll);
router.post('/combo', combo.add);
router.delete('/combo', combo.delete);
router.put('/combo', combo.update);
