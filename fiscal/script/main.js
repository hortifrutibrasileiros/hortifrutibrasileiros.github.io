$(document).ready(function () {

    function gerarDiv(item) {
        var newDiv = $('<div class="item"></div>');
        newDiv.append('<div><input type="text" inputmode="numeric" class="quant" maxlength="6" placeholder="+" /><a hidden>' + item.unitType + '</a></div>');
        newDiv.append('<div class="discrim">' + item.discrim + '</div>');
        newDiv.append('<div><input type="text" inputmode="numeric" class="punit" maxlength="6" value="' + item.punit + '" /></div>');
        newDiv.append('<div class="valor"> + item.total + </div>');
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
$('.punit, #valor').on('input', function() {
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
    var avisoDiv = $('<div class="aviso"><button class="icon i_warning"></button><span></span></div>');
    $('body').append(avisoDiv);
    avisoDiv.find('span').text(mensagem);
    avisoDiv.fadeIn();
    setTimeout(function () {
        avisoDiv.fadeOut();
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

    var concluirElement = $('button.concluir');
    if (count >= 1) {
        concluirElement.removeClass('off');
        $("button.concluir").on("click", function () {
            abrirPopup(".popup.concluir", '.popup.concluir input');
        });
    } else {
        concluirElement.addClass('off');
        $("button.concluir").off("click");
        $("button.concluir").click(function() {
            exibirAviso('Nenhum item selecionado');
        });
    }
}

$("button.concluir").click(function() {
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

    $('#discrim').on('input', function() {
        var valorInput = $(this).val();
        if(valorInput.length > 0){
            $('button.addItem').removeClass('off');
        } else {
            $('button.addItem').addClass('off');
        }
    });




    $(".addItem, #total").on("click keypress", function (event) {
        if ((event.type === "click" && event.target.tagName !== "INPUT") ||
            (event.type === "keypress" && event.which === 13)) {
            var unitType = $("#unitType").val().toLowerCase();
            var discr = $("#discrim").val();
            var discrim = capitalizeFirst(discr);
            var punit = $("#punit").val();
            var total = $("#total").val();
            if (discrim.trim() === "") {
                exibirAviso('Preencha o nome do produto!');
                $("#discrim").focus();
                return;
            }
            var newItem = {
                unitType: unitType,
                discrim: discrim,
                punit: punit,
                total: total
            };
            var newDiv = gerarDiv(newItem);
            $('section #list').append(newDiv);
            $("#unitType, #discrim, #punit, #total").val("");
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
        $('.popup.share .hidden, .none').hide();
        $("#blur").fadeOut();
        $(".popup").fadeOut();
        $('.popup.share .block').fadeIn();
        window.history.back();
    }
    
    $("#blur, .popup .head button").on("click", fecharPopup);

    function abrirPopup(selector, inputSelector) {
        $("#blur").show();
        $(selector).fadeIn();
        $(inputSelector).focus();
    }
 

    $("header .add").on("click", function () {
        abrirPopup(".popup.add", '.popup.add input#discrim');
    });
    $("header .share").on("click", function () {
        abrirPopup(".popup.share");
    });

$('.popup.concluir input').on('input', function(){
        $('.popup.share input').val($(this).val());
      });
$('.popup.share input').on('input', function(){
        $('.popup.concluir input').val($(this).val());
      });
    
    function pegarNome() {
        var nome = $(".popup.concluir input").val();
        var nomeCliente = capitalize(nome);
        if (nomeCliente.trim() === "") {
            $("#cliente").text('Não informado');
        } else {
            $("#cliente").text(nomeCliente);
        }
    }

    function gerarTabela() {
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
                
                if (inputValue2 !== valor) {
                    newRow.append('<td class="right">' + inputValue2 + '</td>');
                } else {
                    newRow.append('<td class="right">-</td>');
                }
                
                newRow.append('<td class="right">' + valor + '</td>');
    
                $('#tabela').append(newRow);
            }
        });
        generateQRCode();
    } //end

    $(".finish_print, .popup.concluir input").on("click keypress", function (event) {
        if ((event.type === "click" && event.target.tagName !== "INPUT") ||
            (event.type === "keypress" && event.which === 13)) {
                $('.picIt').removeClass('share');
                pegarNome();
                gerarTabela();
                sharePrint();
                fecharPopup();
        }
    }); // end


    $("#sharePic").click(function() {
    var nome = $(".popup.concluir input").val();
    var nomeCliente = capitalize(nome);
        if ($("button.concluir").hasClass('off')) {
            exibirAviso('Nenhum item selecionado');
        } else {
            if (nomeCliente.trim() === "") {
                $('.popup.share .hidden').fadeIn();
                $('.popup.share .block, .none').hide();
                $('.popup.share .o_nome').focus();
            } else {
                pegarNome();
                gerarTabela();
                $('.picIt').addClass('share');
                $('#qr-code-container').empty();
                $('.pixPay span').html('');
                sharePrint();
                fecharPopup();
                exibirAviso('Compartilhe sua imagem...');
            }
        }
    });

    $(".finish_share, .popup.share input").on("click keypress", function (event) {
        if ((event.type === "click" && event.target.tagName !== "INPUT") ||
            (event.type === "keypress" && event.which === 13)) {
                pegarNome();
                gerarTabela();
                $('.picIt').addClass('share');
                $('#qr-code-container').empty();
                $('.pixPay span').html('');
                sharePrint();
                fecharPopup();
                exibirAviso('Compartilhe sua imagem...');
        }
    }); // end















    var payload = "";
// Bloco principal: Gera os dados necessários para o Payload PIX


// Função principal para gerar o QR Code
function generateQRCode() {
    var rawPixValue = $('.total').text();
    var pixValue = parseFloat(rawPixValue.replace('R$', '').trim().replace(',', '.')) || 0;

    var pixKey = '+5583987593831'; // Altere para qualquer chave PIX: Celular, CPF, CNPJ ou chave aleatória.
    var destinatario = 'THIAGO SOUTO BRASILEIRO'; // Digite aqui o destinatário
    var cidade = 'SAO PAULO'; // Digite aqui a cidade com máximo de 24 caracteres

    // Construindo o Payload PIX a partir dos dados adicionados.
    payload = buildPixPayload(pixKey, pixValue, destinatario, cidade);

    // Calcula o CRC16 e o adiciona ao payload PIX
    var crc16 = getCRC16(payload);
    payload += '6304' + crc16.toString(16).toUpperCase();

    // Exibe o QR Code
    displayQRCode(payload);

    // Habilita o botão de copiar payload
    document.getElementById('copyCode').disabled = false;
}

// Função para construir o Payload PIX
function buildPixPayload(pixKey, pixValue, destinatario, cidade) {
    var pixValueFormatted = pixValue.toFixed(2);
    var pixLengthValue = pixValueFormatted.length;
    var pixLengthFormatted = pixLengthValue.toString().padStart(2, '0');
    var destinatarioLength = destinatario.length;
    var cidadeLength = cidade.length.toString().padStart(2, '0');

    return '00020126360014BR.GOV.BCB.PIX01' + pixKey.length + pixKey +
        '52040000530398654' + pixLengthFormatted + pixValueFormatted +
        '5802BR59' + destinatarioLength + destinatario +
        '60' + cidadeLength + cidade + '62130509pixcartao';
}

function displayQRCode(payload) {
        if ($('#pixCheckbox').is(':checked')) {
            $('#qr-code-container').empty();
            var qrcode = new QRCode($('#qr-code-container')[0], {
                text: payload.toString(),
                width: 228,
                height: 228,
            });
            $('.pixPay span').html('<button class="icon i_scan"></button>Pague por PIX:');
        } else {
            $('#qr-code-container').empty();
            $('.pixPay span').html('');
        }
}


// Função para copiar o valor do payload para a área de transferência
function copyPayloadToClipboard() {
    var tempInput = $("<input>");
    tempInput.val(payload);
    $("body").append(tempInput);
    tempInput.select();
    document.execCommand("copy");
    tempInput.remove();
}


$('.popup.share .none').click(function() {
    var linkWhatsApp = 'https://api.whatsapp.com/send/?text=' + encodeURIComponent(payload);
    window.open(linkWhatsApp, '_blank');
});

// Função para calcular o CRC16
function getCRC16(payload) {
    payload += '6304';
    var polinomio = 0x1021;
    var resultado = 0xFFFF;
    var length = payload.length;

    for (var offset = 0; offset < length; offset++) {
        resultado ^= (payload.charCodeAt(offset) << 8);

        for (var bitwise = 0; bitwise < 8; bitwise++) {
            if ((resultado <<= 1) & 0x10000) {
                resultado ^= polinomio;
            }
            resultado &= 0xFFFF;
        }
    }

    return resultado;
}

$("#copyCode").click(function() {
    var rawPixValue = $('.total').text();
    var pixValue = parseFloat(rawPixValue.replace('R$', '').trim().replace(',', '.')) || 0;
    if (pixValue === 0) {
        exibirAviso('Não há valor neste cupom!');
    } else {
        pegarNome();
        generateQRCode();
        exibirAviso('Código PIX de R$ ' + pixValue + ' copiado!');
        $('.popup.share .none').fadeIn();
        copyPayloadToClipboard();
    }
}); // end

$("#copyCode").click(function() {
    var rawPixValue = $('.total').text();
    var pixValue = parseFloat(rawPixValue.replace('R$', '').trim().replace(',', '.')) || 0;
    if (pixValue === 0) {
        exibirAviso('Não há valor neste cupom!');
    } else {
        pegarNome();
        generateQRCode();
        exibirAviso('Código PIX de R$ ' + pixValue + ' copiado!');
        $('.popup.share .none').fadeIn();
        copyPayloadToClipboard();
    }
}); // end










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
        $(".popup").fadeOut();
        e.preventDefault();
    }
};

function href(web) {
    window.location.href = web;
    }
