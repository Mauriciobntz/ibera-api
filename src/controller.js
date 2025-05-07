import { pool } from './database.js';

class ProductoController {
    
    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM productos');
        res.json(result);
    }

    async getById(req, res) {
        const { id } = req.params;

        try {
            const [result] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);

            if (result.length === 0) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            res.json(result[0]);
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            res.status(500).json({ error: "Error al obtener el producto" });
        }
    }

    async add (req, res) {
        const producto = req.body;
        const [result] = await pool.query(
            `INSERT INTO productos (nombre, codigo_barra, categoria, marca, fecha_vencimiento, fecha_ingreso, stock_actual, precio_unitario, rotacion, estado, fecha_ultima_promocion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                producto.nombre,
                producto.codigo_barra,
                producto.categoria,
                producto.marca,
                producto.fecha_vencimiento,
                producto.fecha_ingreso,
                producto.stock_actual,
                producto.precio_unitario,
                producto.rotacion,
                producto.estado || 'activo', // valor por defecto
                producto.fecha_ultima_promocion || null
            ]); 
        res.json({"id insertado": result.insertId});
    }

    async delete(req, res) {
        const producto = req.body;
        const [result] = await pool.query('DELETE FROM productos WHERE id=(?)', [producto.id]);
        res.json({"Reguistros eliminados": result.affectedRows});
    }

    async update(req, res) {
        try {
            const producto = req.body;
    
            if (!producto.id) {
                return res.status(400).json({ error: "El ID del producto es obligatorio" });
            }
    
            const [result] = await pool.query(
                `UPDATE productos 
                    SET nombre = ?, codigo_barra = ?, categoria = ?, marca = ?, 
                        fecha_vencimiento = ?, fecha_ingreso = ?, stock_actual = ?, 
                        precio_unitario = ?, rotacion = ?, estado = ?, 
                        fecha_ultima_promocion = ?
                    WHERE id = ?`,
                [
                    producto.nombre,
                    producto.codigo_barra,
                    producto.categoria,
                    producto.marca,
                    producto.fecha_vencimiento,
                    producto.fecha_ingreso,
                    producto.stock_actual,
                    producto.precio_unitario,
                    producto.rotacion,
                    producto.estado,
                    producto.fecha_ultima_promocion,
                    producto.id
                ]
            );
    
            res.json({ "Registros actualizados": result.affectedRows });
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).json({ error: "Error al actualizar el producto" });
        }
    }
    
}

export const producto = new ProductoController();


class ClienteController {

    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM clientes');
        res.json(result);
    }

    async add(req, res) {
        const cliente = req.body;

        try {
            const [result] = await pool.query(
                `INSERT INTO clientes (nombre, email, telefono, preferencias, historial_compras, segmento)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    cliente.nombre,
                    cliente.email,
                    cliente.telefono,
                    JSON.stringify(cliente.preferencias || []),
                    JSON.stringify(cliente.historial_compras || []),
                    cliente.segmento || null
                ]
            );
            res.json({ "id insertado": result.insertId });
        } catch (error) {
            console.error("Error al agregar cliente:", error);
            res.status(500).json({ error: "Error al agregar el cliente" });
        }
    }

    async delete(req, res) {
        const { id } = req.body;

        try {
            const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
            res.json({ "Registros eliminados": result.affectedRows });
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
            res.status(500).json({ error: "Error al eliminar el cliente" });
        }
    }

    async update(req, res) {
        const cliente = req.body;

        if (!cliente.id) {
            return res.status(400).json({ error: "El ID del cliente es obligatorio" });
        }

        try {
            const [result] = await pool.query(
                `UPDATE clientes SET 
                    nombre = ?, 
                    email = ?, 
                    telefono = ?, 
                    preferencias = ?, 
                    historial_compras = ?, 
                    segmento = ?
                WHERE id = ?`,
                [
                    cliente.nombre,
                    cliente.email,
                    cliente.telefono,
                    JSON.stringify(cliente.preferencias || []),
                    JSON.stringify(cliente.historial_compras || []),
                    cliente.segmento,
                    cliente.id
                ]
            );
            res.json({ "Registros actualizados": result.affectedRows });
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            res.status(500).json({ error: "Error al actualizar el cliente" });
        }
    }
        // Método para obtener solo los correos electrónicos de los clientes
        async getEmails(req, res) {
            try {
                const [result] = await pool.query('SELECT email FROM clientes');
                res.json(result); // Devuelve un array con los correos electrónicos
            } catch (error) {
                console.error("Error al obtener los correos electrónicos de los clientes:", error);
                res.status(500).json({ error: "Error al obtener los correos electrónicos de los clientes" });
            }
        }
    
        // Método para obtener solo los números de teléfono de los clientes
        async getTelefonos(req, res) {
            try {
                const [result] = await pool.query('SELECT telefono FROM clientes');
                res.json(result); // Devuelve un array con los números de teléfono
            } catch (error) {
                console.error("Error al obtener los números de teléfono de los clientes:", error);
                res.status(500).json({ error: "Error al obtener los números de teléfono de los clientes" });
            }
        }
    
        // Método para obtener tanto los correos electrónicos como los números de teléfono
        async getEmailsAndTelefonos(req, res) {
            try {
                const [result] = await pool.query('SELECT email, telefono FROM clientes');
                res.json(result); // Devuelve un array con ambos campos
            } catch (error) {
                console.error("Error al obtener los correos y teléfonos de los clientes:", error);
                res.status(500).json({ error: "Error al obtener los correos y teléfonos de los clientes" });
            }
        }   
}

export const cliente = new ClienteController();


class PromocionesController {
    
    async getAll(req, res) {
        try {
            const [result] = await pool.query('SELECT * FROM promociones');
            res.json(result);
        } catch (error) {
            console.error("Error al obtener promociones:", error);
            res.status(500).json({ error: "Error al obtener las promociones" });
        }
    }

    async add(req, res) {
        const promo = req.body;

        try {
            const [result] = await pool.query(
                `INSERT INTO promociones 
                (producto_id, descuento_aplicado, fecha_inicio, fecha_fin, mensaje_generado)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    promo.producto_id,
                    promo.descuento_aplicado,
                    promo.fecha_inicio,
                    promo.fecha_fin,
                    promo.mensaje_generado
                ]
            );
            res.json({ "id insertado": result.insertId });
        } catch (error) {
            console.error("Error al agregar promoción:", error);
            res.status(500).json({ error: "Error al agregar la promoción" });
        }
    }

    async delete(req, res) {
        const { id } = req.body;

        try {
            const [result] = await pool.query('DELETE FROM promociones WHERE id = ?', [id]);
            res.json({ "Registros eliminados": result.affectedRows });
        } catch (error) {
            console.error("Error al eliminar promoción:", error);
            res.status(500).json({ error: "Error al eliminar la promoción" });
        }
    }

    async update(req, res) {
        const promo = req.body;

        if (!promo.id) {
            return res.status(400).json({ error: "El ID de la promoción es obligatorio" });
        }

        try {
            const [result] = await pool.query(
                `UPDATE promociones SET 
                    producto_id = ?, 
                    descuento_aplicado = ?, 
                    fecha_inicio = ?, 
                    fecha_fin = ?, 
                    mensaje_generado = ?
                WHERE id = ?`,
                [
                    promo.producto_id,
                    promo.descuento_aplicado,
                    promo.fecha_inicio,
                    promo.fecha_fin,
                    promo.mensaje_generado,
                    promo.id
                ]
            );
            res.json({ "Registros actualizados": result.affectedRows });
        } catch (error) {
            console.error("Error al actualizar promoción:", error);
            res.status(500).json({ error: "Error al actualizar la promoción" });
        }
    }
}


export const promocion = new PromocionesController();

class ComboController {
    
    async getAll(req, res) {
        try {
            const [result] = await pool.query('SELECT * FROM combos');
            res.json(result);
        } catch (error) {
            console.error("Error al obtener combos:", error);
            res.status(500).json({ error: "Error al obtener los combos" });
        }
    }

    async add(req, res) {
        const combo = req.body;

        try {
            const [result] = await pool.query(
                `INSERT INTO combos 
                (nombre, descripcion, productos_incluidos, precio_total, fecha_creacion)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    combo.nombre,
                    combo.descripcion,
                    JSON.stringify(combo.productos_incluidos || []),
                    combo.precio_total,
                    combo.fecha_creacion || new Date()
                ]
            );
            res.json({ "id insertado": result.insertId });
        } catch (error) {
            console.error("Error al agregar combo:", error);
            res.status(500).json({ error: "Error al agregar el combo" });
        }
    }

    async delete(req, res) {
        const { id } = req.body;

        try {
            const [result] = await pool.query('DELETE FROM combos WHERE id = ?', [id]);
            res.json({ "Registros eliminados": result.affectedRows });
        } catch (error) {
            console.error("Error al eliminar combo:", error);
            res.status(500).json({ error: "Error al eliminar el combo" });
        }
    }

    async update(req, res) {
        const combo = req.body;

        if (!combo.id) {
            return res.status(400).json({ error: "El ID del combo es obligatorio" });
        }

        try {
            const [result] = await pool.query(
                `UPDATE combos SET 
                    nombre = ?, 
                    descripcion = ?, 
                    productos_incluidos = ?, 
                    precio_total = ?, 
                    fecha_creacion = ?
                WHERE id = ?`,
                [
                    combo.nombre,
                    combo.descripcion,
                    JSON.stringify(combo.productos_incluidos || []),
                    combo.precio_total,
                    combo.fecha_creacion,
                    combo.id
                ]
            );
            res.json({ "Registros actualizados": result.affectedRows });
        } catch (error) {
            console.error("Error al actualizar combo:", error);
            res.status(500).json({ error: "Error al actualizar el combo" });
        }
    }
}

export const combo = new ComboController();

