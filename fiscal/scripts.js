

$(document).ready(function () {

    function gerarDiv(item) {
        var newDiv = $('<div class="item"></div>');
        newDiv.append('<div><input type="text" inputmode="numeric" class="quant" maxlength="6" placeholder="1" /><a hidden>' + item.unitType + '</a></div>');
        newDiv.append('<div class="discrim">' + item.discrim + '</div>');
        newDiv.append('<div><input type="text" inputmode="numeric" class="punit" maxlength="6" value="' + item.punit + '" /></div>');
        newDiv.append('<div class="valor">-</div>');
        return newDiv;
    }

    items.forEach(function (item) {
        $('section #list').append(gerarDiv(item));
    });
    var totalItens = 0;

// Definir formatCurrency fora da função calcularResultado
function formatCurrency(input) {
    input = input.replace(/\D/g, '');
    input = (input / 100).toFixed(2);
    return input;
}
$('.punit').on('input', function() {
    this.value = formatCurrency(this.value);
});

function calcularResultado() {
    var $item = $(this).closest('.item');
    var inputValue1 = $item.find('.quant').val().replace(',', '.');
    var rawPixValue = $item.find('.punit').val();
    var inputValue2 = parseFloat(rawPixValue.trim().replace(',', '.')) || 0;

    var valor = parseFloat(inputValue1) * parseFloat(inputValue2);
    $item.find('.valor').text(valor.toFixed(2));
    
    if (isNaN(parseFloat(inputValue1)) || isNaN(parseFloat(inputValue2))) {
        $item.find('.valor').text('-');
    }

    atualizarTotal();
    atualizarContagemItens();

    if (parseFloat(inputValue1) > 0) {
        $item.css('background-color', '#eeeeee');
    } else {
        $item.css('background-color', '');
    }

    atualizarContagemItens();
}


function exibirAviso(mensagem) {
    $('.aviso').text(mensagem).fadeIn();
    setTimeout(function () {
        $('.aviso').fadeOut();
    }, 3000);
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

    var concluirElement = $('.concluir');
    if (count >= 1) {
        concluirElement.removeClass('off');
        $(".concluir").on("click", function () {
            abrirPopup(".popup.nome", '.popup.nome input');
        });
    } else {
        concluirElement.addClass('off');
        $(".concluir").off("click");
        $(".concluir").click(function() {
            exibirAviso('Nenhum item selecionado');
        });
    }
}

$(".concluir").click(function() {
    if ($(this).hasClass('off')) {
        exibirAviso('Nenhum item selecionado');
    }
});

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
        // Limita o valor entre 0.01 e 999.99 e formata como "0.00"
        let amount = Math.min(Math.max(parseFloat(value) / 100, 0.00), 999.99);
        return amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    $('input#punit, .closela').click(function () {
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
        $('.total').text('R$' + total.toFixed(2).replace('.', ','));
    }

    $(".addItem, #punit").on("click keypress", function (event) {
        if ((event.type === "click" && event.target.tagName !== "INPUT") ||
            (event.type === "keypress" && event.which === 13)) {
            var unitType = $("#unitType").val().toLowerCase();
            var discr = $("#discrim").val();
            var discrim = capitalizeFirst(discr);
            var punit = $("#punit").val();
            if (unitType.trim() === "" || discrim.trim() === "" || punit.trim() === "") {
                exibirAviso('Preencha todos os campos!');
                return;
            }
            var newItem = {
                unitType: unitType,
                discrim: discrim,
                punit: punit
            };
            var newDiv = gerarDiv(newItem);
            $('section #list').append(newDiv);
            $("#unitType, #discrim, #punit").val("");
            newDiv.find('.quant, .punit').on('input', calcularResultado);

            fecharPopup()
            atualizarContagemItens();
        }
    });

    $('.total').text('R$ 0,00');

    $('.quant').on('input', function() {
        var valorAtual = $(this).val();
        var novoValor = valorAtual.replace(/,/g, '.');
        $(this).val(novoValor);
      });

    var scrollDistance = 16;
    $(window).scroll(function() {
        if ($(this).scrollTop() > scrollDistance) {
            $(".head.list").addClass("fixed");
            $('body').css('margin-top', 'calc(60px + 16px + 38px)');
        } else {
            $(".head.list").removeClass("fixed");
            $('body').css('margin-top', 'calc(60px + 16px)');
        }


            var windowHeight = $(window).height();
            var documentHeight = $(document).height();
            var scrollBottom = documentHeight - windowHeight - $(this).scrollTop();
        
            if (scrollBottom > scrollDistance) {
                $(".foot.list").addClass("relative");
                $('body').css('margin-bottom', 'calc(38px + 6px + 0px)');
            } else {
                $(".foot.list").removeClass("relative");
                $('body').css('margin-bottom', 'calc(16px + 0px)');
            }
    });

    $(".button.refresh").click(function() {
        location.reload();
      });

    $('#search input').on('input', function() {
        // Verifica se o input está vazio
        if ($(this).val() === '') {
          $('button.clean').hide();
        } else {
          $('button.clean').show();
        }
      });

      $('button.clean').on('click', function() {
        $('#search input').val('').focus();
        $(this).hide();
        $('.item').show();
      });

    function capitalize(str) {
        return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }
    function capitalizeFirst(str) {
        // Transforma a primeira letra em maiúscula e mantém as demais como estão
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function fecharPopup() {
        $("#blur").hide();
        $(".popup").removeClass('opened');
        window.history.back();
    }
    
    $("#blur, .popup .head button").on("click", fecharPopup);

    function abrirPopup(selector, inputSelector) {
        $("#blur").show();
        $(selector).addClass('opened');
        $(inputSelector).focus();
    }
 

    $("header .custom").on("click", function () {
        abrirPopup(".popup.add", '.popup.add input#discrim');
    });


    $(".finish, .popup.nome input").on("click keypress", function (event) {
        $('.sharePic').css('animation', 'none');
        if ((event.type === "click" && event.target.tagName !== "INPUT") ||
            (event.type === "keypress" && event.which === 13)) {
            var nome = $(".popup.nome input").val();
            var nomeCliente = capitalize(nome);

            $('#tabela tr:not(.head)').remove();
            $('.item').each(function () {
                var $item = $(this);
                var inputValue1 = $item.find('.quant').val().replace('.', ',');

                if (inputValue1.trim() !== "") {
                    var value1type = $item.find('a').text();
                    var discrim = $item.find('.discrim').text();
                    var inputValue2 = $item.find('.punit').val().replace('.', ',');
                    var valor = $item.find('.valor').text().replace('.', ',');

                    var newRow = $('<tr></tr>');

                    newRow.append('<td class="left">' + inputValue1 + " " + value1type + '</td>');
                    newRow.append('<td class="left">' + discrim + '</td>');
                    newRow.append('<td class="right">' + inputValue2 + '</td>');
                    newRow.append('<td class="right">' + valor + '</td>');

                    $('.picIt').removeClass('share');

                    $('#tabela').append(newRow);
                }
            });

            if (nomeCliente.trim() === "") {
                $("#cliente").text('Não informado');
            } else {
                $("#cliente").text(nomeCliente);
            }

            generateQRCode();
            sharePrint();

            fecharPopup();
        }
    });

$('button.sharePic').click(function () {
    $('#qr-code-container').empty();
    $('.pixPay span').html('');
    exibirAviso('Compartilhe sua imagem...');

    $('.picIt').addClass('share');
        sharePrint();
});

});

async function sharePrint() {
    const picIt = $('.picIt');

    try {
        const canvas = await html2canvas(picIt[0]);
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
        $('.sharePic').css('animation', 'moveButton 1s infinite');
    } catch (e) {
        resultPara.text('Error: ' + e);
              resultPara.fadeIn();
        setTimeout(function () {
            resultPara.fadeOut();
        }, 30000);
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
