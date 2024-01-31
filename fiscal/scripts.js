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

    function calcularResultado() {
        var $item = $(this).closest('.item');
        var inputValue1 = parseFloat($item.find('.quant').val().replace(',', '.'));
        var inputValue2 = parseFloat($item.find('.punit').val().replace(',', '.'));
        var valor = inputValue1 * inputValue2;
        $item.find('.valor').text(valor.toFixed(2));
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
                $('.aviso').text('Preencha todos os campos!');
                $('.aviso').fadeIn();
                setTimeout(function () {
                    $('.aviso').fadeOut();
                }, 3000);
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

    $('.quant, .punit').on('input', function() {
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
    $(".concluir").on("click", function () {
        abrirPopup(".popup.nome", '.popup.nome input');
    });

    $("header .custom").on("click", function () {
        abrirPopup(".popup.add", '.popup.add input#discrim');
    });

    $(".finish, .popup.nome input").on("click keypress", function (event) {
        $('.sharePic').css('animation', 'none');
        if ((event.type === "click" && event.target.tagName !== "INPUT") ||
            (event.type === "keypress" && event.which === 13)) {
            var nome = $(".popup.nome input").val();
            var nomeCliente = capitalize(nome);

            $('#tabela tr:not(.head)').empty();
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

$('button.sharePic').click(function () {
    $('.aviso').text('Compartilhe sua imagem...');
    $('.aviso').fadeIn();
    setTimeout(function () {
        $('.aviso').fadeOut();
    }, 3000);

    $('.picIt').addClass('share');

    setTimeout(function () {
        sharePrint();
    }, 500);
});

});

async function sharePrint() {
    const picIt = $('.picIt');
    const resultPara = $('.aviso');

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
        resultPara.text('Selecione o app de impressão...');
        resultPara.fadeIn();
        setTimeout(function () {
            resultPara.fadeOut();
        }, 3000);
        $('.sharePic').css('animation', 'moveButton 1s infinite');
    } catch (e) {
        resultPara.text('Error: ' + e);
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
