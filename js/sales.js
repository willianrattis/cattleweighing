document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const saleId = urlParams.get('saleId');
    const sales = JSON.parse(localStorage.getItem('sales')) || [];

    const salesContainer = document.getElementById('salesContainer');
    const saveSaleButton = document.getElementById('saveSaleButton');
    const saleSummaryDiv = document.getElementById('saleSummary');
    const addTruckButton = document.getElementById('addTruckButton');
    const saveTruckButton = document.getElementById('saveTruckButton');

    // Função para exibir a lista de vendas
    const loadSales = () => {
        salesContainer.innerHTML = '';
        if (sales.length === 0) {
            salesContainer.innerHTML = '<li class="list-group-item">Nenhuma venda encontrada</li>';
        } else {
            sales.forEach((sale, index) => {
                const saleItem = document.createElement('li');
                saleItem.classList.add('list-group-item');
                saleItem.innerHTML = `
                    <a href="resumo-da-venda.html?saleId=${index}">
                        ${sale.name} (${sale.date})
                    </a>
                `;
                salesContainer.appendChild(saleItem);
            });
        }
    };

    // Exibir lista de vendas na página 'pesagem-gado.html'
    if (salesContainer) {
        loadSales();
    }

    // Adicionar nova venda na página 'adicionar-venda.html'
    if (saveSaleButton) {
        saveSaleButton.addEventListener('click', function() {
            const saleNameInput = document.getElementById('saleName');
            let saleName = saleNameInput.value.trim();

            // Obter a data atual e formatá-la como '08-SET-2024'
            const currentDate = new Date();
            const day = String(currentDate.getDate()).padStart(2, '0');
            const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            const month = monthNames[currentDate.getMonth()];
            const year = currentDate.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;
            const formattedTime = currentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Usar nome padrão se o nome não for fornecido
            if (!saleName) {
                saleName = `VENDA GADO ${formattedDate}, ${formattedTime}`;
            } else {
                saleName = `${saleName.toUpperCase()} ${formattedDate}`;
            }

            // Criar nova venda e adicioná-la ao localStorage
            const newSale = {
                name: saleName,
                date: formattedDate,
                trucks: []
            };
            sales.push(newSale);
            localStorage.setItem('sales', JSON.stringify(sales));

            // Redirecionar de volta para a lista de vendas
            window.location.href = 'pesagem-gado.html';
        });
    }

    // Exibir resumo da venda na página 'resumo-da-venda.html'
    if (saleSummaryDiv && saleId && sales[saleId]) {
        const sale = sales[saleId];
        let totalWeight = 0;
        let totalArrobas = 0;
        let totalValue = 0;

        if (sale.trucks && sale.trucks.length > 0) {
            sale.trucks.forEach(truck => {
                totalWeight += truck.cattleWeight;
                totalArrobas += truck.totalArrobas;
                totalValue += truck.totalValue;
            });

            const funruralDiscount = totalValue * 0.015;
            const netValue = totalValue - funruralDiscount;

            saleSummaryDiv.innerHTML = `
                <h2>${sale.name}</h2>
                <p><strong>Total de Peso (kg):</strong> ${totalWeight.toFixed(2)}</p>
                <p><strong>Total de Arrobas:</strong> ${totalArrobas.toFixed(2)}</p>
                <p><strong>Desconto FUNRURAL (1,5%):</strong> R$ ${funruralDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Valor Bruto:</strong> R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Valor Líquido:</strong> R$ ${netValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            `;
        } else {
            saleSummaryDiv.innerHTML = `<p>Nenhum caminhão adicionado ainda.</p>`;
        }

        // Configurar o botão 'Adicionar Caminhão'
        if (addTruckButton) {
            addTruckButton.href = `adicionar-caminhao.html?saleId=${saleId}`;
        }
    }

    // Adicionar caminhão à venda na página 'adicionar-caminhao.html'
    if (saveTruckButton && saleId && sales[saleId]) {
        saveTruckButton.addEventListener('click', function() {
            const truckPlate = document.getElementById('truckPlate').value.trim();
            const taraWeight = parseFloat(document.getElementById('taraWeight').value);
            const grossWeight = parseFloat(document.getElementById('grossWeight').value);
            const headsCount = parseInt(document.getElementById('headsCount').value);

            if (truckPlate && !isNaN(taraWeight) && !isNaN(grossWeight) && !isNaN(headsCount)) {
                const cattleWeight = grossWeight - taraWeight;
                const averageWeight = cattleWeight / headsCount;
                const averageArrobas = averageWeight * 0.53 / 15;
                const totalArrobas = headsCount * averageArrobas;
                const totalValue = totalArrobas * 330; // Valor da arroba, ajustar se necessário

                // Criar objeto de caminhão e adicioná-lo à venda
                const newTruck = {
                    plate: truckPlate,
                    taraWeight,
                    grossWeight,
                    cattleWeight,
                    headsCount,
                    totalArrobas,
                    totalValue
                };
                sales[saleId].trucks.push(newTruck);
                localStorage.setItem('sales', JSON.stringify(sales));

                // Redirecionar de volta para o resumo da venda
                window.location.href = `resumo-da-venda.html?saleId=${saleId}`;
            } else {
                alert('Por favor, preencha todos os campos corretamente.');
            }
        });
    }
});