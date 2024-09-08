document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const saleId = urlParams.get('saleId');
    const truckId = urlParams.get('truckId');
    const sales = JSON.parse(localStorage.getItem('sales')) || [];

    const truckPlateInput = document.getElementById('truckPlate');
    const taraWeightInput = document.getElementById('taraWeight');
    const grossWeightInput = document.getElementById('grossWeight');
    const headsCountInput = document.getElementById('headsCount');
    const discountPercentageInput = document.getElementById('discountPercentage');
    const arrobaValueInput = document.getElementById('arrobaValue');
    const calculateButton = document.getElementById('calculateButton');
    const resultsDiv = document.getElementById('results');

    // Função para formatar números sem casas decimais (apenas separação por milhar)
    const formatNumberNoDecimals = (num) => {
        return new Intl.NumberFormat('pt-BR').format(Math.floor(num));
    };

    // Função para formatar valores monetários (R$)
    const formatCurrency = (num) => {
        return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const unformatNumber = (numStr) => {
        return parseFloat(numStr.replace(/\./g, '').replace(',', '.'));
    };

    const unformatCurrency = (currencyStr) => {
        return parseFloat(currencyStr.replace(/[^\d,-]/g, '').replace(',', '.'));
    };

    // Carregar dados do caminhão para edição, se `truckId` estiver presente
    if (truckId && sales[saleId].trucks[truckId]) {
        const truck = sales[saleId].trucks[truckId];
        
        truckPlateInput.value = truck.plate;
        taraWeightInput.value = formatNumberNoDecimals(truck.taraWeight); // Sem casas decimais
        grossWeightInput.value = formatNumberNoDecimals(truck.grossWeight); // Sem casas decimais
        headsCountInput.value = truck.headsCount;
        discountPercentageInput.value = '53'; // Padrão para o desconto de 53%
        arrobaValueInput.value = formatCurrency(truck.arrobaValue || 0); // Ajuste para valor da arroba
    }

    // Função de formatação para campo TARA (sem casas decimais)
    taraWeightInput.addEventListener('input', function(event) {
        let value = unformatNumber(event.target.value);
        if (!isNaN(value)) {
            taraWeightInput.value = formatNumberNoDecimals(value); // Sem casas decimais
        }
    });

    // Função de formatação para campo PESO BRUTO (sem casas decimais)
    grossWeightInput.addEventListener('input', function(event) {
        let value = unformatNumber(event.target.value);
        if (!isNaN(value)) {
            grossWeightInput.value = formatNumberNoDecimals(value); // Sem casas decimais
        }
    });

    // Função de formatação para campo VALOR ARROBA (R$) com duas casas decimais
    arrobaValueInput.addEventListener('input', function(event) {
        let value = arrobaValueInput.value.replace(/\D/g, '');
        if (value.length > 0) {
            arrobaValueInput.value = formatCurrency(parseFloat(value / 100));
        }
    });

    // Função de cálculo
    calculateButton.addEventListener('click', function() {
        const plate = truckPlateInput.value.trim();
        const taraWeight = unformatNumber(taraWeightInput.value);
        const grossWeight = unformatNumber(grossWeightInput.value);
        const headsCount = parseInt(headsCountInput.value);
        const arrobaValue = unformatCurrency(arrobaValueInput.value);

        if (plate && !isNaN(taraWeight) && !isNaN(grossWeight) && !isNaN(headsCount)) {
            const cattleWeight = grossWeight - taraWeight;
            const averageWeight = cattleWeight / headsCount;
            const averageArrobas = averageWeight * 0.53 / 15;
            const totalArrobas = headsCount * averageArrobas;
            const totalValue = totalArrobas * arrobaValue;

            // Atualizar os resultados na tela
            document.getElementById('cattleWeight').innerText = formatNumberNoDecimals(cattleWeight); // Sem casas decimais
            document.getElementById('averageWeight').innerText = averageWeight.toFixed(2); // Duas casas decimais
            document.getElementById('averageArrobas').innerText = averageArrobas.toFixed(2); // Duas casas decimais
            document.getElementById('totalArrobas').innerText = totalArrobas.toFixed(2); // Duas casas decimais

            resultsDiv.style.display = 'block';

            // Atualizar ou adicionar caminhão no array de vendas
            if (truckId && sales[saleId].trucks[truckId]) {
                // Atualizar caminhão existente
                sales[saleId].trucks[truckId] = {
                    plate,
                    taraWeight,
                    grossWeight,
                    cattleWeight,
                    headsCount,
                    totalArrobas,
                    totalValue,
                    arrobaValue
                };
            } else {
                // Adicionar novo caminhão
                const newTruck = {
                    plate,
                    taraWeight,
                    grossWeight,
                    cattleWeight,
                    headsCount,
                    totalArrobas,
                    totalValue,
                    arrobaValue
                };
                sales[saleId].trucks.push(newTruck);
            }

            localStorage.setItem('sales', JSON.stringify(sales));

            // Redirecionar para o resumo da venda
            window.location.href = `resumo-da-venda.html?saleId=${saleId}`;
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const saleId = urlParams.get('saleId');

    // Definir corretamente o link para o botão de voltar
    const backToSummaryButton = document.getElementById('backToSummary');
    if (backToSummaryButton) {
        backToSummaryButton.href = `resumo-da-venda.html?saleId=${saleId}`;
    }
});