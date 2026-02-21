

// Esta función ahora recibe el ID del carrito del usuario y el ID del producto
async function addToCart(cartId, productId) {
    if (!cartId) {
        return alert("Error: Tu usuario no tiene un carrito asignado en la base de datos.");
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('¡Producto agregado al carrito satisfactoriamente!');
        } else {
            alert('Error al agregar: ' + (result.message || result.error));
        }
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error de red al intentar agregar el producto.');
    }
}

async function deleteProduct(cartId, productId) {
    console.log("Intentando eliminar:", productId, "del carrito:", cartId);
    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (result.status === 'success') {
            location.reload(); 
        } else {
            alert("Error del servidor: " + result.message);
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("No se pudo conectar con el servidor para eliminar");
    }
}

// VACIAR TODO EL CARRITO
async function emptyCart(cartId) {
    if (!confirm("¿Seguro que quieres quitar todos los productos?")) return;
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (result.status === 'success') {
            location.reload();
        }
    } catch (error) {
        alert("Error al vaciar el carrito");
    }
}

// FINALIZAR LA COMPRA (GENERA TICKET)
async function finalizePurchase(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST'
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            const ticket = result.payload.ticket;
            alert(`¡Compra exitosa!\nTicket: ${ticket.code}\nTotal: $${ticket.amount}`);
            window.location.href = '/'; // Volvemos al inicio tras la compra
        } else {
            alert("Hubo un problema: Algunos productos no tienen stock suficiente.");
        }
    } catch (error) {
        alert("Error al procesar la compra");
    }
}