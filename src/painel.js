//READY: MOSTRAR TELA DE ADIÇÃO DE PRODUTO E ALTERAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pictureForm');
  const imageInput = document.getElementById('image');
  const imagePreviewContainer = document.getElementById(
    'imagePreviewContainer'
  );
  const imagePreview = document.getElementById('imagePreview');
  const cropImageBtn = document.getElementById('cropImageBtn');
  const selectionBox = document.getElementById('selectionBox');
  const cropWidth = 280;
  const cropHeight = 310;

  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  // Exibir o preview da imagem selecionada
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreviewContainer.classList.remove('hidden');
        resetSelectionBox();
      };
      reader.readAsDataURL(file);
    }
  });

  // Função para resetar a seleção da caixa
  function resetSelectionBox() {
    const imageRect = imagePreview.getBoundingClientRect();
    selectionBox.style.width = `${cropWidth}px`;
    selectionBox.style.height = `${cropHeight}px`;
    selectionBox.style.top = `${(imageRect.height - cropHeight) / 2}px`;
    selectionBox.style.left = `${(imageRect.width - cropWidth) / 2}px`;
  }

  // Eventos de arrastar a caixa de seleção
  selectionBox.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - selectionBox.getBoundingClientRect().left;
    offsetY = e.clientY - selectionBox.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const imageRect = imagePreview.getBoundingClientRect();
      let newLeft = e.clientX - offsetX - imageRect.left;
      let newTop = e.clientY - offsetY - imageRect.top;

      // Limitar a caixa de seleção dentro dos limites da imagem
      newLeft = Math.max(
        0,
        Math.min(newLeft, imageRect.width - selectionBox.offsetWidth)
      );
      newTop = Math.max(
        0,
        Math.min(newTop, imageRect.height - selectionBox.offsetHeight)
      );

      selectionBox.style.left = `${newLeft}px`;
      selectionBox.style.top = `${newTop}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Evento de clique no botão de cortar imagem
  cropImageBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = function () {
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const scaleFactor = imagePreview.naturalWidth / imagePreview.width;

      // Obter as coordenadas do canto superior esquerdo da seleção
      const selectionX =
        (selectionBox.offsetLeft - imagePreview.offsetLeft) * scaleFactor;
      const selectionY =
        (selectionBox.offsetTop - imagePreview.offsetTop) * scaleFactor;

      // Desenhar a região selecionada no canvas
      ctx.drawImage(
        img,
        selectionX,
        selectionY,
        cropWidth * scaleFactor,
        cropHeight * scaleFactor,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // Exibir a imagem cortada para o usuário
      const croppedUrl = canvas.toDataURL('image/jpeg');
      imagePreview.src = croppedUrl;

      // Fechar a visualização da imagem
      imagePreviewContainer.classList.add('hidden');
    };
    img.src = imagePreview.src;
  });

  // Evento de envio do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productId = document.getElementById('productId').value;
    console.log('Product ID (getElementById):', productId);

    if (
      productId !== null &&
      productId !== undefined &&
      productId.trim() !== ''
    ) {
      deleteProduct(productId);
    } else {
      console.error('Product ID is invalid.');
    }

    // Verificar se todos os campos do formulário estão preenchidos
    if (!form.checkValidity()) {
      alert('Por favor, preencha todos os campos do formulário.');
      return;
    }

    // Criar FormData com os dados do formulário
    const formData = new FormData(form);

    // Adicionar a imagem cortada ao FormData
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    ctx.drawImage(imagePreview, 0, 0, cropWidth, cropHeight);
    canvas.toBlob(function (blob) {
      const croppedFile = new File([blob], 'cropped-image.jpg', {
        type: 'image/jpeg',
      });
      formData.set('image', croppedFile); // Substituir o arquivo original pelo arquivo cortado

      // Enviar formData para o servidor via fetch ou XMLHttpRequest
      const endpoint =
        'https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/';
      fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao enviar formulário');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Dados salvos com sucesso:', data);
          alert('Produto incluido com sucesso!');
          form.reset(); // Limpar o formulário após o envio bem-sucedido
        })
        .catch((error) => {
          console.error('Erro ao enviar formulário:', error);
          alert(
            'Erro ao enviar formulário. Verifique o console para mais detalhes.'
          );
        });
    }, 'image/jpeg');
  });
});

// READY: MOSTRAR BOTOES DE OPCOES
const btnOptionsProducts = document.getElementById('btnOptionsProducts');
const menuOptionsProducts = document.getElementById('menuOptionsProducts');

// READY: MOSTRAR BOTOES DE OPCOES
const btnOptionsBanner = document.getElementById('btnOptionsBanners');
const menuOptionsBanner = document.getElementById('menuOptionsBanners');
// READY: MENU PRODUCTS
btnOptionsProducts.addEventListener('click', () => {
  menuOptionsProducts.classList.toggle('hidden');
  menuOptionsProducts.classList.add('flex');
  menuOptionsBanner.classList.add('hidden');
});
// READY: MENU BANNER
btnOptionsBanner.addEventListener('click', () => {
  menuOptionsBanner.classList.toggle('hidden');
  menuOptionsBanner.classList.add('flex');
  menuOptionsProducts.classList.add('hidden');
});

//READY: MOSTRAR TELA DE ADIÇÃO DE PRODUTO
const addProductBtn = document.getElementById('addProductBtn');
const formAddProduct = document.getElementById('formAddProduct');
addProductBtn.addEventListener('click', () => {
  formAddProduct.classList.toggle('hidden');
  const telaDeAlteracao = document.getElementById('telaDeAlteracao');
  telaDeAlteracao.classList.add('hidden');
});

//TODO: MOSTRAR TELA DE ADIÇÃO DE BANNER
const addBannerBtn = document.getElementById('addBannerBtn');
const formAddBanner = document.getElementById('formAddBanner');

addBannerBtn.addEventListener('click', () => {
  const telaDeAlteracao = document.getElementById('telaDeAlteracao');
  telaDeAlteracao.classList.add('hidden');
  formAddBanner.classList.toggle('hidden');
});

//TODO: FUNÇÃO PARA ENVIAR BANNER PARA O SERVIDOR
// Adicione um listener para o evento de envio do formulário
document
  .getElementById('bannerForm')
  .addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar o envio padrão do formulário

    // Criar FormData a partir do formulário
    const formData = new FormData(this);

    // Endpoint para enviar os dados
    const endpoint = 'https://back-artlaser-c5e8836155b5.herokuapp.com/banner/';

    // Enviar requisição fetch
    fetch(endpoint, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao enviar formulário');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Dados salvos com sucesso:', data);
        alert('Imagem enviada com sucesso!');
        this.reset(); // Limpar o formulário após o envio bem-sucedido
      })
      .catch((error) => {
        console.error('Erro ao enviar formulário:', error);
        alert(
          'Erro ao enviar formulário. Verifique o console para mais detalhes.'
        );
      });
  });

function closeTelaDeAlteracao() {
  const telaDeAlteracao = document.getElementById('telaDeAlteracao');
  telaDeAlteracao.classList.add('hidden');
}

function openTelaDeAlteracao() {
  const telaDeAlteracao = document.getElementById('telaDeAlteracao');
  telaDeAlteracao.classList.remove('hidden');
}

//READY: MOSTRAR TELA DE ALTERAÇÃO DE PRODUTO
const altProductBtn = document.getElementById('altProductBtn');
altProductBtn.addEventListener('click', () => {
  const formAddProduct = document.getElementById('formAddProduct');
  formAddProduct.classList.add('hidden');
  openTelaDeAlteracao();

  fetch('https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/')
    .then((response) => response.json())
    .then((product) => {
      console.log(product);
      showItems(product);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
});

//TODO: REMOVER PRODUTO:
const delProductBtn = document.getElementById('delProductBtn');

delProductBtn.addEventListener('click', () => {
  openTelaDeAlteracao();
  const formAddProduct = document.getElementById('formAddProduct');
  formAddProduct.classList.add('hidden');

  fetch('https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/')
    .then((response) => response.json())
    .then((product) => {
      console.log(product);
      showItems(product);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
});

function showItems(products) {
  try {
    const catalog = document.getElementById('gridContainer');
    catalog.innerHTML = '';

    products.forEach((product) => {
      const item = document.createElement('div');
      item.innerHTML = `
        <div class="container-item w-44 h-auto py-2 flex flex-col items-center  gap-1 mt-2 relative">
          <img id="img" class="w-40 h-48 rounded-xl" src="https://back-artlaser-c5e8836155b5.herokuapp.com/${product.src}" alt="imagem" />
          <h2 id="nameProduct" class="nameProduct text-center font-semibold">${product.title}</h2>
          <div class="container-buy mt-1 flex flex-col gap-2 justify-center items-center">
            <button class="text-white font-bold text-sm bg-yellow-600 w-32 h-8 rounded gap-2 flex justify-center items-center" id="btnAltItem" data-id="${product._id}" >
              <i class="fa-solid fa-pen-to-square"></i> Alterar
            </button>
            <button class="text-white font-bold text-sm bg-red-600 w-32 h-8 rounded gap-2 flex justify-center items-center" id="btnAltItem" data-id="${product._id}" >
              <i class="fa-solid fa-pen-to-square"></i> Remover
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

    const buttons = document.querySelectorAll('#btnAltItem');

    // Adiciona um evento de clique a cada botão
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const dataId = event.target.getAttribute('data-id');

        // aparecer o form
        const formArea = document.getElementById('formAddProduct');
        const form = document.getElementById('pictureForm');
        const telaDeAlteracao = document.getElementById('telaDeAlteracao');
        const titleTela = document.getElementById('titleTela');
        titleTela.innerHTML = 'Tela de Alteração de Produto';
        telaDeAlteracao.classList.toggle('hidden');
        formArea.classList.remove('hidden');

        fetch(
          `https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/${dataId}`
        )
          .then((response) => response.json())
          .then((product) => {
            console.log(product);
            preencherForm(product);
          })
          .catch((error) => {
            console.error('Erro ao buscar dados:', error);
          });

        const btnCancel = document.getElementById('btnCancel');
        btnCancel.addEventListener('click', () => {
          formArea.classList.toggle('hidden');
          telaDeAlteracao.classList.toggle('hidden');
        });

        function preencherForm(product) {
          console.log('preenchendo form', product);
          form.querySelector('#productId').value = product._id;
          form.querySelector('#title').value = product.title;
          form.querySelector('#description').value = product.description;
          form.querySelector('#qtdMin').value = product.qtdMin;
          form.querySelector('#category').value = product.category;
          form.querySelector('#retail').value = product.retail;
          form.querySelector('#wholesale').value = product.wholesale;
        }
      });
    });
  } catch (error) {
    console.error('Erro ao exibir catálogo:', error);
  }
}

// READY: DELETAR PRODUTO
function deleteProduct(productId) {
  const url = `https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/${productId}`; // URL para a requisição DELETE

  fetch(url, {
    method: 'DELETE', // Método da requisição
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Se a resposta for bem-sucedida, converte para JSON
      }
      throw new Error('Erro ao excluir o produto');
    })
    .then((data) => {
      console.log('Produto excluído com sucesso:', data);
      // Atualize a interface conforme necessário
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
}

// BOTAO REMOVER BANNER
const btnRemoveBanner = document.getElementById('delBannerBtn');
btnRemoveBanner.addEventListener('click', () => {
  const telaDeAlteracao = document.getElementById('telaDeAlteracao');
  const formAddProduct = document.getElementById('formAddProduct');
  const formAddBanner = document.getElementById('formAddBanner');
  formAddBanner.classList.add('hidden');
  formAddProduct.classList.add('hidden');
  telaDeAlteracao.classList.toggle('hidden');

  mostrarBanners();
});

//TODO: MOSTRAR BANNERS
function mostrarBanners() {
  fetch('https://back-artlaser-c5e8836155b5.herokuapp.com/banner/')
    .then((response) => response.json())
    .then((banners) => {
      console.log(banners);
      showBanners(banners);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
}

function showBanners(banners) {
  const catalog = document.getElementById('gridContainer');
  catalog.innerHTML = '';
  banners.forEach((banner) => {
    const item = document.createElement('div');
    item.innerHTML = `
          <div class="container-item w-44 h-auto py-2 flex flex-col items-center  gap-1 mt-2 relative">
            <img id="img" class="w-40 h-48 rounded-xl" src="https://back-artlaser-c5e8836155b5.herokuapp.com/${banner.src}" alt="imagem" />
            <h2 id="nameProduct" class="nameProduct text-center font-semibold">${banner.imageName}</h2>
            <div class="container-buy mt-1 flex justify-center items-center">
              <button class="text-white font-bold text-sm bg-red-600 w-32 h-8 rounded gap-2 flex justify-center items-center" id="btnDelItem" data-id="${banner._id}" >
                <i class="fa-solid fa-pen-to-square"></i> Remover
              </button>
            </div>
            </div>  
          </div>
        `;

    catalog.appendChild(item);
  });

  const buttons = document.querySelectorAll('#btnDelItem');

  // Adiciona um evento de clique a cada botão
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const dataId = event.target.getAttribute('data-id');

      fetch(
        `https://back-artlaser-c5e8836155b5.herokuapp.com/banner/${dataId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          console.log('Item deletado com sucesso:', result);
          alert('Item removido com sucesso!');
          // Adicione qualquer outra lógica após a exclusão do item, como atualizar a interface
        })
        .catch((error) => {
          console.error('Erro ao deletar item:', error);
          alert('Erro ao remover !');
        });
    });
  });
}

function mostrarProdutos() {
  const telaDeAlteracao = document.getElementById('telaDeAlteracao');
  telaDeAlteracao.classList.toggle('hidden');

  fetch('https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/')
    .then((response) => response.json())
    .then((product) => {
      console.log(product);
      showItems(product);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
  function showItems(products) {
    try {
      const catalog = document.getElementById('gridContainer');
      catalog.innerHTML = '';
      products.forEach((product) => {
        const item = document.createElement('div');
        item.innerHTML = `
          <div class="container-item w-44 h-auto py-2 flex flex-col items-center  gap-1 mt-2 relative">
            <img id="img" class="w-40 h-48 rounded-xl" src="https://back-artlaser-c5e8836155b5.herokuapp.com/${product.src}" alt="imagem" />
            <h2 id="nameProduct" class="nameProduct text-center font-semibold">${product.title}</h2>
            <div class="container-buy mt-1 flex justify-center items-center">
              <button class="text-white font-bold text-sm bg-red-600 w-32 h-8 rounded gap-2 flex justify-center items-center" id="btnDelItem" data-id="${product._id}" >
                <i class="fa-solid fa-trash"></i> Remover
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

      const buttons = document.querySelectorAll('#btnDelItem');

      buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
          const dataId = event.target.getAttribute('data-id');

          fetch(
            `https://back-artlaser-c5e8836155b5.herokuapp.com/pictures/${dataId}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((result) => {
              console.log('Item deletado com sucesso:', result);
              alert('Item removido com sucesso!');
              // Adicione qualquer outra lógica após a exclusão do item, como atualizar a interface
            })
            .catch((error) => {
              console.error('Erro ao deletar item:', error);
              alert('Erro ao remover !');
            });
        });
      });
    } catch (error) {
      console.error('Erro ao exibir catálogo:', error);
    }
  }
}
