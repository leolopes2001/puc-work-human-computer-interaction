function carregarPedidosAdmin() {
    const listaPedidosAdmin = document.getElementById('listaPedidosAdmin');
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    
    listaPedidosAdmin.innerHTML = '';

    if (pedidos.length === 0) {
        listaPedidosAdmin.innerHTML = '<li class="text-center text-gray-500">Nenhum pedido encontrado.</li>';
        return;
    }

    pedidos.forEach((pedido, index) => {
        const li = document.createElement('li');
        li.className = "bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg shadow-md mb-4 flex justify-between items-center";

        li.innerHTML = `
            <div>
                <p class="font-bold text-orange-600 mb-1">Pedido ${index + 1}</p>
                <p class="text-sm text-gray-600 mb-1">
                    <strong>Itens:</strong> ${pedido.itens.map(item => item.adicionais.join(', ')).join(' | ')}
                </p>
                <p class="text-sm text-gray-600 mb-1">
                    <strong>Total:</strong> R$ ${pedido.total.toFixed(2)}
                </p>
                <p class="text-sm ${pedido.statusPedido === 'Finalizado' ? 'text-green-500' : 'text-red-500'}">
                    <strong>Status do Pedido:</strong> ${pedido.statusPedido}
                </p>
            </div>

            <button 
                onclick="finalizarPedido(${index})" 
                class="py-2 px-4 rounded-lg font-semibold text-white 
                       ${pedido.statusPedido === 'Finalizado' 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-green-500 hover:bg-green-600'}"
                ${pedido.statusPedido === 'Finalizado' ? 'disabled' : ''}
            >
                ${pedido.statusPedido === 'Finalizado' ? 'Finalizado' : 'Finalizar'}
            </button>
        `;

        listaPedidosAdmin.appendChild(li);
    });
}

function finalizarPedido(index) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos[index].statusPedido = 'Finalizado';
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    carregarPedidosAdmin(); 
}

window.onload = carregarPedidosAdmin;
