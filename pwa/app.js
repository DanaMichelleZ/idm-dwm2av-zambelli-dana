document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado.");
    const sections = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll("nav a");
    const catalogoSection = document.getElementById("catalogo");
    const carritoSection = document.getElementById("carrito-items");
    const totalCarrito = document.getElementById("total-carrito");
    const checkoutSection = document.getElementById("checkout");
    const totalCheckout = document.getElementById("total-checkout");
    const checkoutButton = document.getElementById("checkout-button");
    let carrito = [];

    function showSection(sectionId) {
        console.log(`Mostrando sección: ${sectionId}`);
        sections.forEach(section => {
            section.style.display = section.id === sectionId ? "block" : "none";
        });

        if (sectionId === "checkout") {
            actualizarCheckout();
        }
    }

    function actualizarCheckout() {
        console.log("Actualizando resumen del checkout...");
        let total = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
        totalCheckout.textContent = `$${total.toFixed(2)}`;
        console.log("Total del checkout actualizadowo: ", total);
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            console.log(`Navegando a sección: ${targetId}`);
            showSection(targetId);
            history.pushState(null, "", `#${targetId}`);
        });
    });

    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        console.log("Carrito recuperado de localStorage :3", carrito);
        actualizarCarrito();
    }

    async function cargarProductos() {
        try {
            console.log("Cargando productos...");
            const response = await fetch("assets/data/products.json");
            if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");

            const productos = await response.json();
            console.log("Productos obtenidos:", productos);
            let html = "<div class='productos-container d-flex flex-wrap gap-3 justify-content-center'>";

            productos.forEach(producto => {
                html += `
                    <div class='card' style='width: 18rem;'>
                        <picture>
                            <source srcset="${producto.imagenes.xl}" media="(min-width: 1200px)">
                            <source srcset="${producto.imagenes.lg}" media="(min-width: 992px)">
                            <source srcset="${producto.imagenes.md}" media="(min-width: 768px)">
                            <source srcset="${producto.imagenes.sm}" media="(min-width: 576px)">
                            <source srcset="${producto.imagenes.xs}" media="(max-width: 575px)">
                            <img src="${producto.imagenes.xl}" class='card-img-top' alt="${producto.nombre}">
                        </picture>
                        <div class='card-body'>
                            <h5 class='card-title'>${producto.nombre}</h5>
                            <p class='card-text'>${producto.descripcion}</p>
                            <p class='card-price'>$${producto.precio.toFixed(2)}</p>
                            <button class='btn btn-primary' onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>
                        </div>
                    </div>
                `;
            });

            html += "</div>";
            catalogoSection.innerHTML = html;
            console.log("Productos cargados correctamente.");

        } catch (error) {
            console.error("Error cargando productos: ", error);
        }
    }

    cargarProductos();

    function agregarAlCarrito(producto) {
        console.log("Agregando al carrito: ", producto);
        let item = carrito.find(p => p.id === producto.id);
        if (item) {
            item.cantidad += 1;
        } else {
            producto.cantidad = 1;
            carrito.push(producto);
        }
        actualizarCarrito();
    }

    function actualizarCarrito() {
        console.log("Actualizando carrito...");
        carritoSection.innerHTML = "";
        let total = 0;

        carrito.forEach(producto => {
            let subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            carritoSection.innerHTML += `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${subtotal.toFixed(2)}</td>
                    <td><button class='btn btn-danger btn-sm' onclick='eliminarDelCarrito(${producto.id})'>Eliminar</button></td>
                </tr>
            `;
        });

        totalCarrito.textContent = `$${total.toFixed(2)}`;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        console.log("Carrito actualizado en localStorage.");
    }

    function eliminarDelCarrito(id) {
        console.log(`Eliminando producto con ID: ${id}`);
        carrito = carrito.filter(producto => producto.id !== id);
        actualizarCarrito();
    }

    function vaciarCarrito() {
        console.log("Vaciando carrito...");
        carrito = [];
        actualizarCarrito();
        localStorage.removeItem("carrito");
    }

    function realizarPago() {
        if (carrito.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de finalizar la compraAAAAAAAAAAAAA.");
            return;
        }
        console.log("Procesando pago...");
        checkoutButton.disabled = true;

        setTimeout(() => {
            alert("Compra realizada con éxito. Gracias por tu compra :3!");
            vaciarCarrito();
            showSection("home");
            checkoutButton.disabled = false;
            console.log("Pago completado.");
        }, 2000);
    }

    checkoutButton.addEventListener("click", realizarPago);

    window.agregarAlCarrito = agregarAlCarrito;
    window.eliminarDelCarrito = eliminarDelCarrito;
    window.vaciarCarrito = vaciarCarrito;
    window.realizarPago = realizarPago;
    window.showSection = showSection;
});
