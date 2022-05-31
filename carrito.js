const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    listaCursos.addEventListener('click', agregarCurso);

    carrito.addEventListener('click', eliminarCurso);

    
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    
    document.addEventListener('DOMContentLoaded', () => {
          articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || []  ;
          // console.log(articulosCarrito);
          carritoHTML();
     });
}

function agregarCurso(e) {
    
    e.preventDefault();
    if( e.target.classList.contains('agregar-carrito') ) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
     
        Swal.fire({
            icon: 'success',
            title: 'El curso fue agregado al carrito',
            showConfirmButton: false,
            timer: 1000
        }) 
    }
    
}


function eliminarCurso(e) {
    if(e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId );
        carritoHTML();
    }
}

function leerDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'), 
        cantidad : 1
    }
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id );
    if(existe) {
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; 
            } else {
                return curso;
            }
        } );
        articulosCarrito = [...cursos];
    } else { 
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
    carritoHTML();
}

function carritoHTML() {
    limpiarHTML();
    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td> <img src="${imagen}" width="150" ></td>
            <td> ${titulo}</td>
            <td> ${precio}</td>
            <td> ${cantidad}</td>
            <td> <a href="#" class="borrar-curso" data-id="${curso.id}" > X </a></td>
        `;
        contenedorCarrito.appendChild(row);
        
    }) 
    
    sincronizarStorage();
    
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito) );
}

function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

function vaciarCarrito() {
    while(contenedorCarrito.firstChild) {
         contenedorCarrito.removeChild(contenedorCarrito.firstChild); 
         vaciarLocalStorage();
     }
     Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'El carrito ha sido borrado con exito',
        showConfirmButton: false,
        timer: 1500
    }) 
    
}

function vaciarLocalStorage() {
    localStorage.clear();
}


const lista = document.querySelector('#listado')


const pedirPost = async () => {

    const resp = await fetch('data.json')
    const data = await resp.json()

    html = ''
    data.forEach( product => {
        html += `
            <div class="card">
                <img src="${product.img}" class="imagen-curso">
                <div class="info-card">
                    <h4>${product.titulo}</h4>
                    <p>${product.profe}</p>
                    <p class="precio">${product.precio}  <span class="precioFinal">${product.precioFinal}</span></p>
                    <a href="#" class="btn agregar-carrito" data-id="${product.id}">Agregar Al Carrito</a>
                </div>
            </div>`
    })

    lista.innerHTML = html
}



pedirPost()
