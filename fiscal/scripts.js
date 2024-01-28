$(document).ready(function() {
    function gerarDiv(item) {
        var newDiv = $('<div class="item"></div>');
        newDiv.append('<div><input type="text" class="quant"><a hidden>' + item.unitType + '</a></div>');
        newDiv.append('<div class="discrim">' + item.discrim + '</div>');
        newDiv.append('<div><input type="text" class="punit" value="' + item.punit + '"></div>');
        newDiv.append('<div class="valor">-</div>');
        return newDiv;
    }

    // Adiciona as divs geradas dinamicamente ao body
    items.forEach(function(item) {
        $('#body').append(gerarDiv(item));
    });
    // Variável para armazenar a contagem total
    var totalItens = 0;

    // Função para calcular o resultado
    function calcularResultado() {
        // Obter os valores dos inputs dentro da div atual
        var $item = $(this).closest('.item');
        var inputValue1 = parseFloat($item.find('.quant').val().replace(',', '.'));
        var inputValue2 = parseFloat($item.find('.punit').val().replace(',', '.'));

        // Verificar se os valores são válidos
        //if (isNaN(inputValue1) || isNaN(inputValue2)) {
        //    $item.find('.valor').text('x');
        //    return;
        //}

        // Calcular o resultado
        var valor = inputValue1 * inputValue2;

        // Atualizar o texto na div de valor
        $item.find('.valor').text(valor.toFixed(2).replace('.', ','));

        // Atualizar o total
        atualizarTotal();

        // Atualizar a contagem de itens
        atualizarContagemItens();

        if (inputValue1 > 0) {
            $item.css('background-color', '#eeeeee');
        } else {
            $item.css('background-color', ''); // Limpar a cor de fundo
        }
        atualizarContagemItens();
    }

    // Função para atualizar a contagem total de itens
    function atualizarContagemItens() {
        var count = 0;

        // Iterar sobre todas as divs com a classe 'quant' e somar apenas aquelas com valores válidos
        $('.quant').each(function() {
            var inputValue = parseFloat($(this).val().replace(',', '.'));
            if (!isNaN(inputValue) && inputValue > 0) {
                count++;
            }
        });

        // Atualizar o texto na span de itens
        $('.itens').text(count);
        // Atualizar a variável totalItens
        totalItens = count;
    }

    // Associar a função ao evento de input nos campos
    $('.quant').on('input', calcularResultado);

    // Manipulador de eventos para o campo de pesquisa
    $('#search input').on('input', function() {
        var searchTerm = $(this).val().toLowerCase();

        // Iterar sobre todas as divs com a classe 'discrim'
        $('.discrim').each(function() {
            var discrim = $(this).text().toLowerCase();
            var $item = $(this).closest('.item');

            // Verificar se o nome do discrim contém o termo de pesquisa
            if (discrim.includes(searchTerm)) {
                $item.show(); // Mostrar a linha
            } else {
                $item.hide(); // Ocultar a linha
            }
        });
    });




    // Função para atualizar o total
    function atualizarTotal() {
        var total = 0;

        // Iterar sobre todas as divs com a classe 'valor'
        $('.valor').each(function() {
            var valor = parseFloat($(this).text().replace(',', '.'));
            if (!isNaN(valor)) {
                total += valor;
            }
        });


        // Atualizar o texto na div de total
        $('.total').text(total.toFixed(2).replace('.', ','));
    }




    // Adicionar Div
    $("#adicionarDiv").on("click", function() {
        // Obter os valores dos campos de entrada
        var unitType = $("#unitType").val();
        var discrim = $("#discrim").val();
        var punit = $("#punit").val();

        // Verificar se todos os campos estão preenchidos
        if (unitType.trim() === "" || discrim.trim() === "" || punit.trim() === "") {
            alert("Por favor, preencha todos os campos antes de adicionar uma nova div.");
            return;
        }

        // Criar um novo objeto com os valores
        var newItem = {
            unitType: unitType,
            discrim: discrim,
            punit: punit
        };

        // Criar e adicionar a nova div à #body
        var newDiv = gerarDiv(newItem);
        $('#body').append(newDiv);

        // Limpar os campos de entrada
        $("#unitType, #discrim, #punit").val("");

        // Associar a função ao evento de input nos campos da nova div
        newDiv.find('.quant, .punit').on('input', calcularResultado);

        $("#blur").hide();
        $(".popup").removeClass('opened');

        // Atualizar a contagem total de itens
        atualizarContagemItens();
    });




    $(".popup .close").on("click", function() {
        $("#blur").hide();
        $(".popup").removeClass('opened');
    });
    // Quando o botão "Concluir" for clicado
    $("#concluir").on("click", function() {
        $("#blur").show();
        $(".popup.nome").addClass('opened');
        $('.popup.nome input').focus();
    });
    // Quando o botão "Add" for clicado
    $(".button.custom").on("click", function() {
        $("#blur").show();
        $(".popup.add").addClass('opened');
        $('.popup.add input#discrim').focus();
    });

    // Quando o botão "finish" for clicado
    $("#finish, .popup.nome input").on("click keypress", function(event) {
        if (event.type === "click" || (event.type === "keypress" && event.which === 13)) {
            // Obtém o valor do input
            var nomeDigitado = $(".popup.nome input").val();

            $('#tabela tr:not(.head)').empty();
            // Itera sobre cada div com a classe 'item'
            $('.item').each(function() {
                var $item = $(this);
                var inputValue1 = $item.find('.quant').val();

                // Verifica se o valor no input "quant" é válido
                if (inputValue1.trim() !== "") {
                    var value1type = $item.find('a').text();
                    var discrim = $item.find('.discrim').text();
                    var inputValue2 = $item.find('.punit').val();
                    var valor = $item.find('.valor').text();

                    // Cria uma nova linha na tabela
                    var newRow = $('<tr></tr>');

                    // Adiciona células à nova linha
                    newRow.append('<td class="left">' + inputValue1 + " " + value1type + '</td>');
                    newRow.append('<td class="left">' + discrim + '</td>');
                    newRow.append('<td class="right">' + inputValue2 + '</td>');
                    newRow.append('<td class="right">' + valor + '</td>');

                    // Adiciona a nova linha à tabela
                    $('#tabela').append(newRow);
                    // Adicionando um atraso de 1 segundo antes de chamar sharePrint()
                    setTimeout(function() {
                        sharePrint();
                    }, 500); // 1000 milissegundos = 1 segundo
                }
            });

            // Mostra o nome na div com id "nome"
            $("#cliente").text(nomeDigitado);

            // Esconde o conteúdo novamente
            $("#blur").hide();
            $(".popup").removeClass('opened');
        }
    });
    $("#blur").on("click", function() {
        $("#blur").hide();
        $(".popup").removeClass('opened');
    });
    $('.button.refresh').on('click', function() {
        location.reload();
    });

});

async function sharePrint() {
    const picIt = document.getElementById('picIt');

    try {
        const canvas = await html2canvas(picIt);
        const dataUrl = canvas.toDataURL(); // Convert canvas to data URL
        const blob = await fetch(dataUrl).then(res => res.blob());

        const file = new File([blob], 'cupomfiscal.png', {
            type: blob.type
        });

        let shareData = {
            title: 'Imprimir',
            files: [file]
        };

        await navigator.share(shareData);
        resultPara.textContent = 'MDN shared successfully';
    } catch (e) {
        resultPara.textContent = 'Error: ' + e;
    }
}

function atualizarDataHora() {
    var agora = new Date();

    // Formatando a data no formato DD/MM/AAAA
    var dataFormatada = (agora.getDate() < 10 ? '0' : '') + agora.getDate() + '/' +
        ((agora.getMonth() + 1) < 10 ? '0' : '') + (agora.getMonth() + 1) + '/' +
        agora.getFullYear();

    // Formatando a hora no formato HH:MM
    var horaFormatada = (agora.getHours() < 10 ? '0' : '') + agora.getHours() + ':' +
        (agora.getMinutes() < 10 ? '0' : '') + agora.getMinutes();

    // Atualizando os elementos HTML com as novas informações
    $('#data_atual').text(dataFormatada);
    $('#hora_atual').text(horaFormatada);
}

// Chamando a função inicialmente para exibir a data e hora atuais
atualizarDataHora();

// Configurando um intervalo para atualizar a cada segundo
setInterval(atualizarDataHora, 1000);
