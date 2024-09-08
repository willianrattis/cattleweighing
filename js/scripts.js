document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente carregado e analisado.');

    const calculateButton = document.getElementById('calculateButton');
    const resultsDiv = document.getElementById('results');

    const formatNumber = (num) => {
        return new Intl.NumberFormat('pt-BR').format(num);
    };

    const formatCurrency = (num) => {
        return (num / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const unformatNumber = (numStr) => {
        return numStr.replace(/\./g, '').replace(/,/g, '.');  // Remover separadores e ajustar o ponto/virgula para cálculos
    };

    const taraWeightInput = document.getElementById('taraWeight');
    const grossWeightInput = document.getElementById('grossWeight');
    const arrobaValueInput = document.getElementById('arrobaValue');

    // Formatação no campo TARA (não alterar o comportamento existente)
    taraWeightInput.addEventListener('input', function(event) {
        let value = unformatNumber(event.target.value);
        if (!isNaN(value) && value.length > 0) {
            taraWeightInput.value = formatNumber(parseFloat(value));
        }
    });

    // Formatação no campo PESO BRUTO (não alterar o comportamento existente)
    grossWeightInput.addEventListener('input', function(event) {
        let value = unformatNumber(event.target.value);
        if (!isNaN(value) && value.length > 0) {
            grossWeightInput.value = formatNumber(parseFloat(value));
        }
    });

    // Formatação no campo VALOR ARROBA (R$) enquanto o usuário digita, com duas casas decimais
    arrobaValueInput.addEventListener('input', function(event) {
        let value = arrobaValueInput.value.replace(/\D/g, ''); // Remove tudo que não é número
        if (value.length > 0) {
            arrobaValueInput.value = formatCurrency(parseFloat(value));  // Aplica formatação monetária com casas decimais
        }
    });

    if (calculateButton) {
        console.log('Botão Calcular encontrado.');

        calculateButton.addEventListener('click', function() {
            console.log('Botão Calcular foi clicado.');

            const taraWeight = parseFloat(unformatNumber(taraWeightInput.value));
            const grossWeight = parseFloat(unformatNumber(grossWeightInput.value));
            const headsCount = parseFloat(document.getElementById('headsCount').value);

            console.log('Valores capturados:', { taraWeight, grossWeight, headsCount });

            if (!isNaN(taraWeight) && !isNaN(grossWeight) && !isNaN(headsCount)) {
                const cattleWeight = grossWeight - taraWeight;
                const averageWeight = cattleWeight / headsCount;
                const averageArrobas = averageWeight * 0.53 / 15;
                const totalArrobasCurrent = headsCount * averageArrobas;

                console.log('Resultados calculados:', { cattleWeight, averageWeight, averageArrobas, totalArrobasCurrent });

                document.getElementById('cattleWeight').innerText = formatNumber(Math.floor(cattleWeight));
                document.getElementById('averageWeight').innerText = averageWeight.toFixed(2);
                document.getElementById('averageArrobas').innerText = averageArrobas.toFixed(2);
                document.getElementById('totalArrobas').innerText = totalArrobasCurrent.toFixed(2);

                resultsDiv.style.display = 'block';
            } else {
                console.error('Um ou mais valores inválidos.');
            }
        });
    } else {
        console.error('Botão Calcular não encontrado.');
    }
});