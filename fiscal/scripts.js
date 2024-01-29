$(document).ready(function () {

    function gerarDiv(item) {
        var newDiv = $('<div class="item"></div>');
        newDiv.append('<div><input type="text" inputmode="numeric" class="quant"><a hidden>' + item.unitType + '</a></div>');
        newDiv.append('<div class="discrim">' + item.discrim + '</div>');
        newDiv.append('<div><input type="text" inputmode="numeric" class="punit" value="' + item.punit + '"></div>');
        newDiv.append('<div class="valor">-</div>');
        return newDiv;
    }

    items.forEach(function (item) {
        $('#body').append(gerarDiv(item));
    });
    var totalItens = 0;

    function calcularResultado() {
        var $item = $(this).closest('.item');
        var inputValue1 = parseFloat($item.find('.quant').val().replace(',', '.'));
        var inputValue2 = parseFloat($item.find('.punit').val().replace(',', '.'));
        var valor = inputValue1 * inputValue2;

        $item.find('.valor').text(valor.toFixed(2).replace('.', ','));

        if (isNaN(inputValue1) || isNaN(inputValue2)) {
            $item.find('.valor').text('-');
        }

        atualizarTotal();
        atualizarContagemItens();

        if (inputValue1 > 0) {
            $item.css('background-color', '#eeeeee');
        } else {
            $item.css('background-color', '');
        }
        atualizarContagemItens();
    }

    function atualizarContagemItens() {
        var count = 0;
        $('.quant').each(function () {
            var inputValue = parseFloat($(this).val().replace(',', '.'));
            if (!isNaN(inputValue) && inputValue > 0) {
                count++;
            }
        });

        $('.itens').text(count);
        totalItens = count;
    }

    $('.quant, .punit').on('input', calcularResultado);

    $('#search input').on('input', function () {
        var searchTerm = $(this).val().toLowerCase();
        $('.discrim').each(function () {
            var discrim = $(this).text().toLowerCase();
            var $item = $(this).closest('.item');
            if (discrim.includes(searchTerm)) {
                $item.show();
            } else {
                $item.hide();
            }
        });
    });

    $('#punit').on('input', function (event) {
        let inputValue = event.target.value.replace(/\D/g, '');
        let formattedValue = formatMoney(inputValue);
        $(this).val(formattedValue);
    });

    function formatMoney(value) {
        // Limita o valor entre 0.01 e 999.99 e formata como "0,00"
        let amount = Math.min(Math.max(parseFloat(value) / 100, 0.00), 999.99);
        return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    $('input#punit').click(function () {
        $(this).val('');
    });

    function atualizarTotal() {
        var total = 0;
        $('.valor').each(function () {
            var valor = parseFloat($(this).text().replace(',', '.'));
            if (!isNaN(valor)) {
                total += valor;
            }
        });
        $('.total').text(total.toFixed(2).replace('.', ','));
    }

    $("#adicionarDiv, #punit").on("click keypress", function (event) {
        if ((event.type === "click" && event.target.tagName !== "INPUT") ||
            (event.type === "keypress" && event.which === 13)) {
            var unitType = $("#unitType").val();
            var discrim = $("#discrim").val();
            var punit = $("#punit").val();

            if (unitType.trim() === "" || discrim.trim() === "" || punit.trim() === "") {
                $('.erro').fadeIn();
                setTimeout(function () {
                    $('.erro').fadeOut();
                }, 3000);
                return;
            }

            var newItem = {
                unitType: unitType,
                discrim: discrim,
                punit: punit
            };

            var newDiv = gerarDiv(newItem);
            $('#body').append(newDiv);

            $("#unitType, #discrim, #punit").val("");

            newDiv.find('.quant, .punit').on('input', calcularResultado);

            fecharPopup()

            atualizarContagemItens();
        }
    });

    function capitalize(str) {
        return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }

    function fecharPopup() {
        $("#blur").hide();
        $(".popup").removeClass('opened');
        window.history.back();
    }
    
    $("#blur, .popup .close").on("click", fecharPopup);

    function abrirPopup(selector, inputSelector) {
        $("#blur").show();
        $(selector).addClass('opened');
        $(inputSelector).focus();
    }
    $("#concluir").on("click", function () {
        abrirPopup(".popup.nome", '.popup.nome input');
    });

    $(".button.custom").on("click", function () {
        abrirPopup(".popup.add", '.popup.add input#discrim');
    });

    
    $("#finish, .popup.nome input").on("click keypress", function (event) {
        if ((event.type === "click" && event.target.tagName !== "INPUT") ||
            (event.type === "keypress" && event.which === 13)) {
            var nome = $(".popup.nome input").val();
            var nomeCliente = capitalize(nome);

            $('#tabela tr:not(.head)').empty();
            $('.item').each(function () {
                var $item = $(this);
                var inputValue1 = $item.find('.quant').val();

                if (inputValue1.trim() !== "") {
                    var value1type = $item.find('a').text();
                    var discrim = $item.find('.discrim').text();
                    var inputValue2 = $item.find('.punit').val();
                    var valor = $item.find('.valor').text();

                    var newRow = $('<tr></tr>');

                    newRow.append('<td class="left">' + inputValue1 + " " + value1type + '</td>');
                    newRow.append('<td class="left">' + discrim + '</td>');
                    newRow.append('<td class="right">' + inputValue2 + '</td>');
                    newRow.append('<td class="right">' + valor + '</td>');

                    $('#tabela').append(newRow);
                    setTimeout(function () {
                        sharePrint();
                    }, 500);
                }
            });

            if (nomeCliente.trim() === "") {
                $("#cliente").text('Não informado');
            } else {
                $("#cliente").text(nomeCliente);
            }

            fecharPopup();
        }
    });

    $('.button.refresh').on('click', function () {
        location.reload();
    });

});

async function sharePrint() {
    const picIt = document.getElementById('picIt');

    try {
        const canvas = await html2canvas(picIt);
        const dataUrl = canvas.toDataURL();
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
    var dataFormatada = (agora.getDate() < 10 ? '0' : '') + agora.getDate() + '/' +
        ((agora.getMonth() + 1) < 10 ? '0' : '') + (agora.getMonth() + 1) + '/' +
        agora.getFullYear();
    var horaFormatada = (agora.getHours() < 10 ? '0' : '') + agora.getHours() + ':' +
        (agora.getMinutes() < 10 ? '0' : '') + agora.getMinutes();
    $('#data_atual').text(dataFormatada);
    $('#hora_atual').text(horaFormatada);
}
atualizarDataHora();
setInterval(atualizarDataHora, 1000);

window.onhashchange = function (e) {
    var oldURL = e.oldURL.split('#')[1];

    if (oldURL == 'popup') {
        $("#blur").hide();
        $(".popup").removeClass('opened');
        e.preventDefault();
    }
};

function href(web) {
    window.location.href = web;
}
