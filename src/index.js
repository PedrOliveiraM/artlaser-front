function init() {
  fetchAllProducts();
  fetchBannerData();
  fetchCategories();
}

// NOTE: INICIANDO O SISTEMA
init();

const btnSearchProduct = document.getElementById('btnSearchProduct');
const inputSearchProduct = document.getElementById('inputSearchProduct');

inputSearchProduct.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    fetchProductBySearh();
  }
});
btnSearchProduct.addEventListener('click', () => {
  fetchProductBySearh();
});

function fetchProductBySearh() {
  const search = inputSearchProduct.value;
  fetch(
    `https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/search/${search}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      showCatalog(data);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
}

//READY: MENU COM A GRID DE ITEMS
const menu = document.getElementById('menu');
// READY: ABRIR MENU
function openMenu() {
  menu.classList.remove('hidden');
}
//READY: FECHAR MENU
function closeMenu() {
  menu.classList.add('hidden');
}
// READY: MOSTRAR CATALOGO
function showCatalog(products) {
  try {
    const catalog = document.getElementById('gridContainer');
    catalog.innerHTML = '';

    products.forEach((product) => {
      const item = document.createElement('div');
      item.innerHTML = `
        <div class="container-item w-44 h-[500px] py-2 flex flex-col items-center  gap-1 mt-2 relative">
          <img id="img" class="w-40 h-48 rounded-xl" src="https://back-artlaser-c5e8836155b5.herokuapp.com/${
            product.src
          }" alt="imagem" />
          <h2 id="nameProduct" class="nameProduct text-center font-semibold">${
            product.title
          }</h2>
          <p id="descripcion" class="descripcion text-sm text-center max-w-full break-words">${
            product.description
          }</p>

        <div class="container-info text-center flex flex-col justify-center items-center  absolute bottom-0">
          <div class="values text-center flex flex-col">
            <label class="retail text-sm text-center max-w-full break-wordss font-bold">
              Varejo: <span id="retail">R$ ${product.retail.toFixed(2)}</span>
            </label>
            <label class="wholesale text-sm font-bold text-center max-w-full break-words">
              Atacado: <span id="wholesale">R$ ${product.wholesale.toFixed(
                2
              )}</span>
            </label>
            <label class="qtdMin text-sm text-center max-w-full break-words">
              A partir de: <span id="qtdMin">${product.qtdMin}</span> peças
            </label>
          </div>
          <div class="quantidade bg-gray-300 rounded w-32 h-7 flex justify-between items-center">
            <button id="btnDelProduct" class="btn-minus px-3 scroll-py-10 text-black font-semibold rounded-lg">-</button>
            <input class="ml-2 text-center w-12 h-10 bg-transparent outline-none font-bold" type="number" name="quantidade" value="1" />
            <button id="btnAddProduct" class="btn-plus px-3 py-1 text-black font-semibold rounded-lg">+</button>
          </div>
          <div class="container-buy mt-1 flex justify-center items-center">
            <button class="text-white font-bold text-sm bg-[#28A745] w-32 h-8 rounded gap-2 flex justify-center items-center" id="btnAddCart" data-id="${
              product._id
            }" >
              <i class="fa-solid fa-cart-plus"></i> Adicionar
            </button>
          </div>
          </div>  
        </div>
      `;

      catalog.appendChild(item);
    });

    const items = document.querySelectorAll('.container-item');
    let maxHeight = 0;

    items.forEach((item) => {
      const itemHeight = item.offsetHeight;
      if (itemHeight > maxHeight) {
        maxHeight = itemHeight;
      }
    });

    items.forEach((item) => {
      item.style.height = `${maxHeight}px`;
    });

    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.add('hidden');
    const modalCart = document.getElementById('myCart');
    modalCart.classList.add('hidden');

    fetchBannerData();
    const carrossel = document.getElementById('carrossel');
    carrossel.classList.remove('hidden');

    const main = document.getElementById('main');
    main.classList.remove('hidden');
  } catch (error) {
    console.error('Erro ao exibir catálogo:', error);
  }
}

// READY: BUSCAR TODOS OS PRODUTOS
function fetchAllProducts() {
  fetch('https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      showCatalog(data);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
}
// READY: BUSCAR PRODUTOS POR CATEGORIA
function fetchProductsByCategory(category) {
  fetch(
    `https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/category/${category}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      showCatalog(data);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
}
// READY: BUSCAR CATEGORIAS DE PRODUTOS : MENU LATERAL
function fetchCategories() {
  fetch('https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      listCategorias(data);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
}
// READY: Implementar categorias de produtos
function listCategorias(products) {
  const categoriasContainer = document.getElementById('containerCategorias');
  categoriasContainer.innerHTML = '';

  const categoriasSet = new Set();

  products.forEach((product) => {
    const category = capitalizeFirstLetter(product.category);
    if (!categoriasSet.has(category)) {
      categoriasSet.add(category);
      const item = document.createElement('div');
      item.classList.add('categoria');
      item.innerHTML = `
        <button
          id="btnCategoria"
          data-item="${category}"
          class="flex w-full items-center justify-between px-2 border-b-2 py-1 border-gray-200"
        >
          ${category}
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      `;

      categoriasContainer.appendChild(item);
    }
  });

  // Corrigido o seletor e chamado no document
  const btnCategory = document.querySelectorAll('#btnCategoria');

  btnCategory.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const categoria = event.currentTarget.dataset.item;
      fetchProductsByCategory(categoria);
    });
  });
}
// READY: BTN LOGO HOME : HEADER
const btnLogoHome = document.getElementById('btnLogoHome');
btnLogoHome.addEventListener('click', () => {
  fetchAllProducts();
});

// READY: BTN TODOS OS ITENS : MENU LATERAL
const btnTodos = document.getElementById('btnTodos');
btnTodos.addEventListener('click', () => {
  fetchAllProducts();
});

// READY: BUSCAR BANNERS
function fetchBannerData() {
  fetch('https://back-artlaser-c5e8836155b5.herokuapp.com/banner/')
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetch banner', data);
      createCarousel(data);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
}
// READY: CRIAR CARROSSEL DE BANNERS
function createCarousel(banners) {
  const bannersContainer = document.getElementById('banners');

  banners.forEach((banner) => {
    const item = document.createElement('div');
    item.classList.add('carousel-item');
    item.innerHTML = `
      <img class="w-screen h-auto rounded-xl" src="https://back-artlaser-c5e8836155b5.herokuapp.com/${banner.src}" alt="${banner.imageName}" />
    `;
    bannersContainer.appendChild(item);
  });

  const carouselItems = document.querySelectorAll('.carousel-item');
  const totalItems = carouselItems.length;
  const itemWidth = carouselItems[0].clientWidth;

  let currentIndex = 0;

  function showSlide(index) {
    const offset = -index * itemWidth;
    bannersContainer.style.transform = `translateX(${offset}px)`;
    currentIndex = index;
  }

  // Inicia o carrossel
  showSlide(currentIndex);

  // Intervalo para avançar automaticamente
  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalItems;
    showSlide(currentIndex);
  }, 4000); // Intervalo de 3 segundos para trocar os slides
}

// READY: MENU LATERAL
const btnSideMenu = document.getElementById('btnSideMenu');
const sideMenu = document.getElementById('sideMenu');

// READY: ABRIR & FECHAR MENU LATERAL
function openCloseSideMenu() {
  sideMenu.classList.toggle('hidden');
}
// READY: BTN MENU LATERAL
btnSideMenu.addEventListener('click', () => {
  openCloseSideMenu();
});

// READY: FECHAR MENU QUANDO CLICADO FORA
window.addEventListener('click', function (event) {
  const modalSideMenu = document.getElementById('sideMenu');
  if (event.target === modalSideMenu) {
    openCloseSideMenu();
  }
});

//READY: FORMATAR LETRAS DE CATEGORIAS : MENU LATERAL
function capitalizeFirstLetter(string) {
  if (!string) return ''; // Verifica se a string está vazia ou indefinida
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

//READY: IR PARA O CARRINHO
const btnGoToCart = document.getElementById('btnGoToCart');
const btnIcoGoToCart = document.getElementById('btnIcoGoToCart');
// READY: BTN CARRINHO
btnIcoGoToCart.addEventListener('click', () => {
  showCart();
});
// READY: BTN CARRINHO
btnGoToCart.addEventListener('click', () => {
  showCart();
});

// READY: MOSTRAR CARRINHO
function showCart() {
  //esconder os elementos de catalogo e mostrar o de carrinho
  const myCart = document.getElementById('myCart');
  const main = document.getElementById('main');
  const sideMenu = document.getElementById('sideMenu');
  const carrossel = document.getElementById('carrossel');

  carrossel.classList.add('hidden');
  sideMenu.classList.add('hidden');
  myCart.classList.remove('hidden');
  main.classList.add('hidden');
}
// READY: BTN FECHAR CARRINHO
const btnCloseCart = document.getElementById('btnKeepBuy');
btnCloseCart.addEventListener('click', () => {
  init();
  closeCart();
});

// READY: FECHAR CARRINHO
function closeCart() {
  //esconder os elementos de carrinho e mostrar o de catalogo
  const myCart = document.getElementById('myCart');
  const main = document.getElementById('main');

  main.classList.remove('hidden');
  myCart.classList.add('hidden');
}

// TODO: CONFIG DOS BOTES DE ADD E DIM:
document.body.addEventListener('click', (event) => {
  const target = event.target;

  if (
    target.classList.contains('btn-minus') ||
    target.classList.contains('btn-plus')
  ) {
    const quantityInput = target
      .closest('.quantidade')
      .querySelector('input[name="quantidade"]');
    let currentValue = parseInt(quantityInput.value);

    if (target.classList.contains('btn-minus')) {
      if (currentValue > 1) {
        // Previne quantidade menor que 1
        quantityInput.value = currentValue - 1;
      }
    } else if (target.classList.contains('btn-plus')) {
      quantityInput.value = currentValue + 1;
    }
  }

  if (target.id === 'btnAddCart') {
    const product = target.closest('.container-item');
    const productId = target.dataset.id;
    const quantity = parseInt(
      product.querySelector('input[name="quantidade"]').value
    );

    console.log('Adicionar ao carrinho:', productId, quantity);
    gerarPedido(productId, quantity);
  }
});

// NOTE: PEDIDOS
// READY: ARMAZENAR PEDIDOS:
const meusPedidos = [
  {
    id: '',
    title: '',
    quantidade: '',
    valor: '',
    valorTotal: '',
  },
];
// READY: FUNÇÃO PARA VERIFICAR O VALOR DO PRODUTO
async function verificarValorAtacado(id, quantidade) {
  const response = await fetch(
    `https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/${id}`
  );
  const pedido = await response.json();

  console.log('VERIFICAR VALOR ATACADO: pedido', pedido);
  if (quantidade >= pedido.qtdMin) {
    console.log('pedido.wholesale', pedido.wholesale);
    return pedido.wholesale;
  } else {
    console.log('pedido.wholesale', pedido.wholesale);
    return pedido.retail;
  }
}

// READY: ATUALIZAR PEDIDO
async function uptadePedido(id, quantidade) {
  for (let pedido of meusPedidos) {
    if (pedido.id === id) {
      const valor = await verificarValorAtacado(id, quantidade);
      pedido.valor = valor;
      pedido.quantidade = quantidade;
      pedido.valorTotal = parseFloat(pedido.valor * quantidade).toFixed(2);
    }
  }
  uptadeTotal(); // Chame uptadeTotal após atualizar o pedido
}

// READY: ATUALIZAR TOTAL DO CARRINHO
function uptadeTotal() {
  const qtdeFinalItens = document.getElementById('qtdeFinalItens');
  const valorFinalItens = document.getElementById('valorFinalItens');
  let sumQtde = 0;
  let sumValor = 0;

  meusPedidos.forEach((pedido) => {
    sumQtde += Number(pedido.quantidade);
    sumValor += Number(pedido.valorTotal);
  });
  console.log(sumValor);
  qtdeFinalItens.innerText = sumQtde;
  valorFinalItens.innerText = `R$ ${sumValor.toFixed(2)}`;
  console.log(sumValor);
}

// READY: GERAR PEDIDO
async function gerarPedido(id, quantidade) {
  //buscar o produto pelo id :
  console.log(id);
  console.log(quantidade);

  const response = await fetch(
    `https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/${id}`
  );
  const pedido = await response.json();

  console.log(pedido);
  // container onde vai ficar
  const containerDePedidos = document.getElementById('containerDePedidos');

  const valor = await verificarValorAtacado(id, quantidade);

  if (meusPedidos.includes(pedido._id)) {
    meusPedidos.forEach((pedido) => {
      if (pedido.id === id) {
        pedido.quantidade += quantidade;
        pedido.valorTotal = pedido.quantidade * pedido.valor;
      }
    });
    uptadeTotal();
    return;
  }

  let existPedido = meusPedidos.find((pedido) => pedido.id === id);

  if (existPedido) {
    meusPedidos.forEach((pedido) => {
      if (pedido.id === id) {
        pedido.quantidade += quantidade;
        pedido.valorTotal = pedido.quantidade * pedido.valor;
      }
    });
    const quantidadeCart = document.getElementById('quantidadeCart');
    quantidadeCart.value = existPedido.quantidade;
    uptadeTotal();
    return;
  } else {
    meusPedidos.push({
      id: pedido._id,
      title: pedido.title,
      quantidade: quantidade,
      valor: valor,
      valorTotal: valor * quantidade,
    });
    // criando um pedido
    const item = document.createElement('div');
    item.innerHTML = `
  <div class="Pedido-1 border-2 border-[#747474] rounded-lg h-36 flex md:p-2 md:h-auto items-center px-1"
  >
    <img
      class="w-30 h-32 md:w-48 md:h-64 shrink-0 rounded-xl"
      src="https://back-artlaser-c5e8836155b5.herokuapp.com/${pedido.src}"
      alt="imagem do produto"
    />
    <span id="idDoPedido" class="hidden">${pedido._id}</span>
    <div
      class="Infor space-y-5 flex flex-col justify-center items-center w-full"
    >
    <div class="flex justify-between">
    <h2 class="font-semibold  text-center">${pedido.title}</h2>
    <button
      class="btnRemove px-3 scroll-py-10 text-black font-semibold rounded-lg">
      <i class="fa-solid fa-trash text-red-600"></i>
    </button
    </div>
    </div>
      
      <div class="flex justify-between w-full">
        <div class="md:text-lg flex flex-col w-full px-2">
          <div class="flex justify-between">
            <p class="font-semibold">Valor:</p>
            <p id="valorDoPedido">R$ ${valor}</p>
          </div>

          <div class="flex justify-between">
            <p class="font-semibold">Qtd:</p>
            <div
              class="quantidade bg-gray-300 rounded w-24 h-7 flex justify-center items-center"
            >
              <button
                id="btnDelProduct"
                class="btn btn-minus-rem scroll-py-10 text-black font-semibold rounded-lg"
              >
                -
              </button>
              <input
                class="ml-2 text-center w-12 h-10 bg-transparent outline-none font-bold"
                type="number"
                name="quantidade"
                id="quantidadeCart"
                min="0"
                value="${quantidade}"
              />
              <button
                id="btnAddProduct"
                class="btn btn-plus-add py-1 text-black font-semibold rounded-lg"
              >
                +
              </button>
            </div>
          </div>

          <div class="flex justify-between">
            <p class="font-semibold">Valor Total:</p>
            <p id="valorDoPedido">R$ ${valor * quantidade}</p>
          </div>
        </div>
      </div>
    </div>
  </div>  
  `;
    containerDePedidos.appendChild(item);
    const input = item.querySelector('input[name="quantidade"]');
    input.addEventListener('change', (event) => {
      const quantidade = parseInt(event.target.value);
      uptadePedido(pedido._id, quantidade);
    });

    // READY: remover pedido
    const btnRemove = document.querySelectorAll('.btnRemove');
    btnRemove.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        const id = btn
          .closest('.Pedido-1')
          .querySelector('#idDoPedido').innerText;
        meusPedidos.forEach((pedido, index) => {
          if (pedido.id === id) {
            meusPedidos.splice(index, 1);
            btn.closest('.Pedido-1').remove();
            uptadeTotal();
          }
        });
      });
    });

    const btnAddProduct = item.querySelector('.btn-plus-add');
    const btnDelProduct = item.querySelector('.btn-minus-rem');
    btnAddProduct.addEventListener('click', () => {
      const currentValue = parseInt(input.value);
      input.value = currentValue + 1;
      uptadePedido(pedido._id, currentValue + 1);
    });
    btnDelProduct.addEventListener('click', () => {
      const currentValue = parseInt(input.value);
      if (currentValue > 1) {
        input.value = currentValue - 1;
        uptadePedido(pedido._id, currentValue - 1);
      }
    });
  }

  uptadeTotal();
  showModalAddToCart();
}

// READY: MOSTRAR MODAL DE ADICIONAR AO CARRINHO
function showModalAddToCart() {
  const modalAddCart = document.getElementById('modalAddCart');
  modalAddCart.classList.remove('hidden');
  modalAddCart.classList.add('flex');

  setTimeout(() => {
    modalAddCart.classList.add('hidden');
    modalAddCart.classList.remove('flex');
  }, 2000); // 3000 ms = 3 seconds
}

const btnModalGoToCart = document.getElementById('btnModalGoToCart');
const btnModalStayHome = document.getElementById('btnModalStayHome');

btnModalGoToCart.addEventListener('click', modalBtnGoToCart);
btnModalStayHome.addEventListener('click', modalBtnStay);

// ir para o carrinho
function modalBtnGoToCart() {
  const modalMyCart = document.getElementById('myCart');
  const modalAddCart = document.getElementById('modalAddCart');
  modalMyCart.classList.add('hidden');
  modalAddCart.classList.add('hidden');
  showCart();
}

// voltar
function modalBtnStay() {
  const modalCart = document.getElementById('modalAddCart');
  modalCart.classList.add('hidden');
}

const btnFinalizarPedido = document.getElementById('btnFinalizarPedido');
btnFinalizarPedido.addEventListener('click', () => {
  finalizarPedido();
});

// verificar a mudança do valor e quantidade e atualizar o valor total
function finalizarPedido() {
  // Gerar texto com os itens
  if (meusPedidos.length === 0) {
    alert('Adicione itens ao carrinho');
    return;
  }

  const items = meusPedidos
    .map((pedido) => {
      if (pedido.quantidade && pedido.title && pedido.valorTotal) {
        return `${pedido.quantidade}x ${pedido.title} - R$ ${pedido.valorTotal}`;
      }
    })
    .join('\n');

  const valorFinal = document.getElementById('valorFinalItens').innerText;
  const qtdeFinal = document.getElementById('qtdeFinalItens').innerText;

  const msg = `*Pedido:*\n${items}\n\n*Total de itens:* ${qtdeFinal}\n*Valor total:* ${valorFinal}`;
  const encodedMsg = encodeURIComponent(msg);
  const phone = '5577988438467';
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMsg}`;

  // Debugging
  console.log('URL gerada:', url);

  // Abrir o link do WhatsApp em uma nova aba
  window.open(url, '_self');
}

//
const cleanItensCarts = document.getElementById('cleanItensCarts');
cleanItensCarts.addEventListener('click', () => {
  meusPedidos.splice(0, meusPedidos.length);
  const containerDePedidos = document.getElementById('containerDePedidos');
  containerDePedidos.innerHTML = '';
  uptadeTotal();
});
