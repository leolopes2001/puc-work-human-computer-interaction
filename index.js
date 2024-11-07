const adicionaisSelect = document.getElementById("adicionais");
const adicionarCachorroBtn = document.getElementById("adicionarCachorro");
const pedidoResumo = document.getElementById("pedidoResumo");
const finalizarPedidoBtn = document.getElementById("finalizarPedido");
const listaPedidos = document.getElementById("listaPedidos");

const qrCodeModal = document.getElementById("qrCodeModal");
const qrCodeCanvas = document.getElementById("qrCodeCanvas");
const fecharModal = document.getElementById("fecharModal");

let pedidoAtual = [];

adicionarCachorroBtn.addEventListener("click", () => {
  const adicionaisSelecionados = Array.from(
    adicionaisSelect.selectedOptions
  ).map((option) => option.value);

  if (adicionaisSelecionados.length === 0) {
    alert("Selecione ao menos um adicional!");
    return;
  }

  const cachorro = {
    adicionais: adicionaisSelecionados,
    preco: 10 + adicionaisSelecionados.length * 2,
  };

  pedidoAtual.push(cachorro);
  atualizarResumo();
});

function atualizarResumo() {
  pedidoResumo.innerHTML = "";

  pedidoAtual.forEach((cachorro, index) => {
    const li = document.createElement("li");
    li.textContent = `Cachorro-Quente ${index + 1}: ${cachorro.adicionais.join(
      ", "
    )} - R$ ${cachorro.preco.toFixed(2)}`;
    pedidoResumo.appendChild(li);
  });
}

function cancelarPedido(index) {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    
    if (index >= 0 && index < pedidos.length) {

      const confirmacao = confirm("Tem certeza de que deseja cancelar este pedido?");
      if (!confirmacao) return;
  

      pedidos.splice(index, 1);
  
      localStorage.setItem("pedidos", JSON.stringify(pedidos));
  
      alert("Pedido cancelado com sucesso!");
      carregarPedidos();
    } else {
      alert("Pedido não encontrado.");
    }
  }

finalizarPedidoBtn.addEventListener("click", () => {
  if (pedidoAtual.length === 0) {
    alert("Adicione pelo menos um cachorro-quente ao pedido!");
    return;
  }

  const total = pedidoAtual.reduce((acc, item) => acc + item.preco, 0);
  const pedido = {
    itens: pedidoAtual,
    total: total,
    statusPedido: "Pendente",
    statusPagamento: "Pendente",
  };

  salvarPedidoNoLocalStorage(pedido);
  alert("Pedido finalizado!");
  pedidoAtual = [];
  atualizarResumo();
  carregarPedidos();
});

function salvarPedidoNoLocalStorage(pedido) {
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

function carregarPedidos() {
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  listaPedidos.innerHTML = "";

  pedidos.forEach((pedido, index) => {
    const li = document.createElement("li");
    li.className = "border border-gray-300 p-4 rounded-lg shadow-md mb-4";
    li.innerHTML = `
            <strong>Pedido ${index + 1}</strong><br>
            Itens: ${pedido.itens
              .map((item) => item.adicionais.join(", "))
              .join(" | ")}<br>
            Total: R$ ${pedido.total.toFixed(2)}<br>
            <span class='${
              pedido.statusPedido === "Finalizado"
                ? "text-green-500"
                : "text-red-500"
            }'>Status do Pedido: ${pedido.statusPedido}</span><br>
            <span class='${
              pedido.statusPagamento === "Finalizado"
                ? "text-green-500"
                : "text-red-500"
            }'> Status do Pagamento: ${pedido.statusPagamento}</span><br>
            <div class='flex gap-2'>
                 
            ${pedido.statusPagamento !== "Finalizado"
               ? `<button onclick="abrirModal(${
                    pedido.total
                  })" class="bg-blue-500 text-white font-semibold py-2 px-4 mt-2 rounded hover:bg-blue-600">
                  Visualizar QR Code
                </button>`: ""}

           ${
             pedido.statusPedido !== "Finalizado"
               ? `<button onclick="cancelarPedido(${index})" class="bg-red-500 text-white font-semibold py-2 px-4 mt-2 rounded hover:bg-red-600">
                        Cancelar Pedido
                    </button>`
               : ""
           }
            </div>
         
        `;

    listaPedidos.appendChild(li);
  });
}

function abrirModal(valor) {
  const qr = new QRious({
    element: qrCodeCanvas,
    value: `Pagamento de R$ ${valor.toFixed(2)}`,
    size: 200,
  });
  qrCodeModal.style.display = "flex";
}

fecharModal.addEventListener("click", () => {
  qrCodeModal.style.display = "none";
});

carregarPedidos();
