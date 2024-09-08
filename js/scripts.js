document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente carregado e analisado.');

    const urlParams = new URLSearchParams(window.location.search);
    const saleId = urlParams.get('saleId');
    const sales = JSON.parse(localStorage.getItem('sales')) || [];

    const calculateButton = document.getElementById('calculateButton');
    const resultsDiv = document.getElementById('results');
    
    const formatNumber = (num) => {
        return new Intl.NumberFormat('pt-BR').format(num);
    };

    const formatCurrency = (num) => {
        return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const unformatNumber = (numStr) => {
        return numStr.replace(/\./g, '').replace(',', '.');
    };

    const unformatCurrency = (currencyStr) => {
        return parseFloat(currencyStr.replace(/[^\d,-]/g, '').replace(',', '.'));
    };

    const taraWeightInput = document.getElementById('taraWeight');
    const grossWeightInput = document.getElementById('grossWeight');
    const arrobaValueInput = document.getElementById('arrobaValue');
    const discountPercentageInput = document.getElementById('discountPercentage');
    const headsCountInput = document.getElementById('headsCount');

    // Função de formatação para campo TARA
    taraWeightInput.addEventListener('input', function(event) {
        let value = unformatNumber(event.target.value);
        if (!isNaN(value) && value.length > 0) {
            taraWeightInput.value = formatNumber(parseFloat(value));
        }
    });

    // Função de formatação para campo PESO BRUTO
    grossWeightInput.addEventListener('input', function(event) {
        let value = unformatNumber(event.target.value);
        if (!isNaN(value) && value.length > 0) {
            grossWeightInput.value = formatNumber(parseFloat(value));
        }
    });

    // Função de formatação para campo VALOR ARROBA (R$) com duas casas decimais
    arrobaValueInput.addEventListener('input', function(event) {
        let value = arrobaValueInput.value.replace(/\D/g, '');
        if (value.length > 0) {
            arrobaValueInput.value = formatCurrency(parseFloat(value / 100));
        }
    });

    // Verificar se o botão de calcular existe
    if (calculateButton) {
        calculateButton.addEventListener('click', function() {
            // Capturar e desformatar os valores
            const taraWeight = parseFloat(unformatNumber(taraWeightInput.value));
            const grossWeight = parseFloat(unformatNumber(grossWeightInput.value));
            const headsCount = parseInt(headsCountInput.value);
            const arrobaValue = unformatCurrency(arrobaValueInput.value);

            // Verificar se todos os valores são válidos
            if (!isNaN(taraWeight) && taraWeight > 0 && !isNaN(grossWeight) && grossWeight > 0 && !isNaN(headsCount) && headsCount > 0 && !isNaN(arrobaValue) && arrobaValue > 0) {
                // Cálculos
                const cattleWeight = grossWeight - taraWeight;
                const averageWeight = cattleWeight / headsCount;
                const averageArrobas = averageWeight * 0.53 / 15;
                const totalArrobasCurrent = headsCount * averageArrobas;

                const totalValue = totalArrobasCurrent * arrobaValue;
                const funruralDiscount = totalValue * 0.015;
                const netValue = totalValue - funruralDiscount;

                console.log('Resultados calculados:', { cattleWeight, averageWeight, averageArrobas, totalArrobasCurrent, totalValue, funruralDiscount, netValue });

                // Exibir os resultados calculados na página
                document.getElementById('cattleWeight').innerText = formatNumber(Math.floor(cattleWeight));
                document.getElementById('averageWeight').innerText = averageWeight.toFixed(2);
                document.getElementById('averageArrobas').innerText = averageArrobas.toFixed(2);
                document.getElementById('totalArrobas').innerText = totalArrobasCurrent.toFixed(2);

                resultsDiv.style.display = 'block';

                if (saleId && sales[saleId]) {
                    const newTruck = {
                        plate: document.getElementById('truckPlate').value.trim(),
                        taraWeight,
                        grossWeight,
                        cattleWeight,
                        headsCount,
                        totalArrobas: totalArrobasCurrent,
                        totalValue: totalValue  // Armazenar o valor bruto
                    };

                    sales[saleId].trucks.push(newTruck);
                    localStorage.setItem('sales', JSON.stringify(sales));

                    window.location.href = `resumo-da-venda.html?saleId=${saleId}`;
                } else {
                    alert('Venda não encontrada.');
                }
            } else {
                alert('Por favor, preencha todos os campos corretamente.');
            }
        });
    }
});