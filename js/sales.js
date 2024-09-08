document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const saleId = urlParams.get('saleId');
    const truckId = urlParams.get('truckId');
    const sales = JSON.parse(localStorage.getItem('sales')) || [];

    const salesContainer = document.getElementById('salesContainer');
    const saveSaleButton = document.getElementById('saveSaleButton');
    const saleSummaryDiv = document.getElementById('saleSummary');
    const addTruckButton = document.getElementById('addTruckButton');
    const saveTruckButton = document.getElementById('saveTruckButton');
    const trucksListDiv = document.getElementById('trucksList');

    // Função de formatação para exibição visual
    const formatForDisplay = (num, type = 'number') => {
        switch (type) {
            case 'currency':
                return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            case 'arrobas':
            case 'weight':
                return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            default:
                return num.toLocaleString('pt-BR');
        }
    };

    // Função para exibir a lista de vendas na página 'pesagem-gado.html'
    const loadSales = () => {
        salesContainer.innerHTML = '';
        if (sales.length === 0) {
            salesContainer.innerHTML = '<li class="list-group-item">Nenhuma venda encontrada</li>';
        } else {
            sales.forEach((sale, index) => {
                const saleItem = document.createElement('li');
                saleItem.classList.add('list-group-item');
                saleItem.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title text-highlight">${sale.name}</h5>
                            <p class="card-text text-muted">${sale.date}</p>
                            <a href="resumo-da-venda.html?saleId=${index}" class="btn btn-primary">Ver Resumo</a>
                        </div>
                    </div>
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
        saveSaleButton.addEventListener('click', function () {
            const saleNameInput = document.getElementById('saleName');
            let saleName = saleNameInput.value.trim();

            // Obter a data atual e formatá-la
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
            sale.trucks.forEach((truck, index) => {
                totalWeight += truck.cattleWeight;
                totalArrobas += truck.totalArrobas;
                totalValue += truck.totalValue;

                // Exibir os dados de cada caminhão com formatação
                const truckItem = document.createElement('div');
                truckItem.classList.add('card', 'mb-3');
                truckItem.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">Caminhão: ${truck.plate}</h5>
                        <p class="card-text">
                            TARA: ${formatForDisplay(truck.taraWeight, 'weight')} kg<br>
                            Peso Bruto: ${formatForDisplay(truck.grossWeight, 'weight')} kg<br>
                            Peso Gado: ${formatForDisplay(truck.cattleWeight, 'weight')} kg<br>
                            Total Arrobas: ${formatForDisplay(truck.totalArrobas, 'arrobas')}<br>
                            Valor Total: ${formatForDisplay(truck.totalValue, 'currency')}
                        </p>
                        <button class="btn btn-warning" onclick="editTruck(${index})">Editar</button>
                    </div>
                `;
                trucksListDiv.appendChild(truckItem);
            });
        }

        const funruralDiscount = totalValue * 0.015;
        const netValue = totalValue - funruralDiscount;

        // Exibir resumo da venda com formatação
        saleSummaryDiv.innerHTML = `
            <p id="saleName">${sale.name}</p>
            <div class="summary-item">
                <span>Total de Peso (kg):</span> ${formatForDisplay(totalWeight, 'weight')}
            </div>
            <div class="summary-item">
                <span>Total de Arrobas:</span> ${formatForDisplay(totalArrobas, 'arrobas')}
            </div>
            <div class="summary-item">
                <span>Desconto FUNRURAL (1,5%):</span> ${formatForDisplay(funruralDiscount, 'currency')}
            </div>
            <div class="summary-item">
                <span id="valorBruto">Valor Bruto:</span> ${formatForDisplay(totalValue, 'currency')}
            </div>
            <div class="summary-item" id="valorLiquido">
                <span>Valor Líquido:</span> ${formatForDisplay(netValue, 'currency')}
            </div>
        `;

        // Botão para adicionar caminhão
        if (addTruckButton) {
            addTruckButton.href = `adicionar-caminhao.html?saleId=${saleId}`;
        }
    }

    // Adicionar ou editar caminhão na página 'adicionar-caminhao.html'
    if (saveTruckButton && saleId && sales[saleId]) {
        if (truckId && sales[saleId].trucks[truckId]) {
            // Se estiver editando, preencher os campos com os dados do caminhão
            const truck = sales[saleId].trucks[truckId];
            document.getElementById('truckPlate').value = truck.plate;
            document.getElementById('taraWeight').value = truck.taraWeight;
            document.getElementById('grossWeight').value = truck.grossWeight;
            document.getElementById('headsCount').value = truck.headsCount;
        }

        saveTruckButton.addEventListener('click', function () {
            const truckPlate = document.getElementById('truckPlate').value.trim();
            const taraWeight = parseFloat(document.getElementById('taraWeight').value);
            const grossWeight = parseFloat(document.getElementById('grossWeight').value);
            const headsCount = parseInt(document.getElementById('headsCount').value);

            if (truckPlate && !isNaN(taraWeight) && !isNaN(grossWeight) && !isNaN(headsCount)) {
                const cattleWeight = grossWeight - taraWeight;
                const averageWeight = cattleWeight / headsCount;
                const averageArrobas = averageWeight * 0.53 / 15;
                const totalArrobas = headsCount * averageArrobas;
                const totalValue = totalArrobas * 330; // Valor da arroba

                const newTruck = {
                    plate: truckPlate,
                    taraWeight,
                    grossWeight,
                    cattleWeight,
                    headsCount,
                    totalArrobas,
                    totalValue
                };

                if (truckId && sales[saleId].trucks[truckId]) {
                    // Atualizar o caminhão existente
                    sales[saleId].trucks[truckId] = newTruck;
                } else {
                    // Adicionar novo caminhão
                    sales[saleId].trucks.push(newTruck);
                }

                localStorage.setItem('sales', JSON.stringify(sales));

                // Redirecionar para o resumo da venda
                window.location.href = `resumo-da-venda.html?saleId=${saleId}`;
            } else {
                alert('Por favor, preencha todos os campos corretamente.');
            }
        });
    }
});

// Função para editar caminhão
function editTruck(truckIndex) {
    const urlParams = new URLSearchParams(window.location.search);
    const saleId = urlParams.get('saleId');
    const sales = JSON.parse(localStorage.getItem('sales')) || [];

    // Recarregar a página de adicionar caminhão para edição
    window.location.href = `adicionar-caminhao.html?saleId=${saleId}&truckId=${truckIndex}`;
}