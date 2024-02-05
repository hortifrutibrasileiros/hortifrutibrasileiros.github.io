

$(document).ready(function () {

    var titleColorLight = '#ffffff';
    var titleColorDark = '#313131';
    var metas = 
    '<meta name="description" content="' + description + '">'+
    '<title>' + title + '</title>';

    $('.picIt .header .data').html(data);
    $(metas).appendTo('head');

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    function toggleDarkMode() {
        const darkMode = darkModeMediaQuery.matches;
        $('body').toggleClass('dark-mode', darkMode);

        $('meta[name="msapplication-TileColor"]').remove();
        $('meta[name="theme-color"]').remove();

        if (darkMode) {
            $('head').append('<meta name="msapplication-TileColor" content="' + titleColorDark + '">' +
                            '<meta name="theme-color" content="' + titleColorDark + '">');
        } else {
            $('head').append('<meta name="msapplication-TileColor" content="' + titleColorLight + '">' +
                            '<meta name="theme-color" content="' + titleColorLight + '">');
        }
    }
    $(metas).appendTo('head');

    toggleDarkMode();
    darkModeMediaQuery.addListener(toggleDarkMode);

    ///

    function gerarDiv(item) {
        var newItem = $('<div class="item"></div>');

        newItem.append('<div class="discr">' + item.discr + '</div>');
        newItem.append('<div class="quant"><input type="text" inputmode="numeric" maxlength="6" placeholder="' + item.unitType + '" /></div>');
        newItem.append('<div class="punit"><input type="text" inputmode="numeric" maxlength="6" value="' + item.punit + '" /></div>');
        newItem.append('<div class="valor">-</div>');

        return newItem;
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

$('#punit').on('input', function() {
    this.value = formatCurrency(this.value);
});
$('section #list').on('input', '.punit input', function() {
    this.value = formatCurrency(this.value);
});

$('section #list').on('input', '.quant input', function() {
    var valorAtual = $(this).val();
    var novoValor = valorAtual.replace(/,/g, '.');
    $(this).val(novoValor);
  });

function calcularResultado() {
    var $item = $(this).closest('.item');
    var inputValue1 = $item.find('.quant input').val().replace(',', '.');
    var rawPixValue = $item.find('.punit input').val();
    var inputValue2 = parseFloat(rawPixValue.trim().replace(',', '.')) || 0;

    var valor = parseFloat(inputValue1) * parseFloat(inputValue2);
    $item.find('.valor').text(valor.toFixed(2));
    
    if (isNaN(parseFloat(inputValue1)) || isNaN(parseFloat(inputValue2))) {
        $item.find('.valor').text('-');
    }

    atualizarTotal();
    atualizarContagemItens();

    if (parseFloat(inputValue1) > 0) {
        $item.addClass('active');
    } else {
        $item.removeClass('active');
    }

    atualizarContagemItens();
}

$('.popup.share .block div, header .button, button.concluir, .popup .foot button').addClass('click');


function exibirAviso(mensagem) {
    var avisoDiv = $('.aviso');

    avisoDiv.find('span').text(mensagem);

    avisoDiv.css({
        top: '-80px'
    }).animate({
        top: 0
    }, 200, function () {
        setTimeout(function () {
            avisoDiv.animate({
                top: '-80px'
            }, 200);
        }, 3000); // Após 3 segundos, inicia a animação para esconder o aviso
    });
}


// Adicione um evento de click no documento para lidar com botões concluir, mesmo os dinâmicos
$(document).on("click", "button.concluir:not(.off)", function() {
    abrirPopup(".popup.concluir", '.popup.concluir input');
});

// Adicione um evento de click no documento para lidar com botões concluir que estão desabilitados
$(document).on("click", "button.concluir.off", function() {
    exibirAviso('Nenhum item selecionado');
});

// Adicione um evento de mudança nos inputs para atualizar a contagem e o estado do botão
$('.quant input').on('change', function() {
    atualizarContagemItens();
});

function atualizarContagemItens() {
    var count = 0;
    $('.quant input').each(function() {
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
    } else {
        concluirElement.addClass('off');
    }
}

// Chame a função inicialmente para garantir que o estado inicial seja configurado corretamente
atualizarContagemItens();


    $('.quant input, .punit input').on('input', calcularResultado);

    $('.quant input, .punit input').on('input', function () {
        atualizarContagemItens();
    });
    
    $('#search input').on('input', function () {
        var searchTerm = $(this).val().toLowerCase();
        $('.discr').each(function () {
            var discr = $(this).text().toLowerCase();
            var $item = $(this).closest('.item');
            if (discr.includes(searchTerm)) {
                $item.show();
            } else {
                $item.hide();
            }
        });
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

    $('#discr').on('input', function() {
        var valorInput = $(this).val();
        var capitalizedInput = capitalizeFirst(valorInput);
        
        $(this).val(capitalizedInput); // Atualiza o valor do input com a versão capitalizada
    
        if (capitalizedInput.length > 0) {
            $('button.addItem').removeClass('off');
        } else {
            $('button.addItem').addClass('off');
        }
    });

    $('section #list').on('input', '.quant input, .punit input', calcularResultado);

    $(".addItem, #punit").on("click keypress", function (event) {
        if ((event.type === "click" && event.target.tagName !== "INPUT") ||
            (event.type === "keypress" && event.which === 13)) {
            var unitType = $("#unitType").val().toLowerCase();
            var discr = $("#discr").val();
            var discr = capitalizeFirst(discr);
            var punit = $("#punit").val();
            if (discr.trim() === "") {
                exibirAviso('Preencha o nome do produto!');
                $("#discr").focus();
                return;
            }
            var newItem = {
                unitType: unitType,
                discr: discr,
                punit: punit
            };

            var newItem = gerarDiv(newItem);
            $('section #list').append(newItem);
            $("#unitType, #discr, #punit").val("");

            fecharPopup()
            atualizarContagemItens();
        }
    });

    $('.total').text('R$ 0,00');

    $('.quant input').on('input', function() {
        var valorAtual = $(this).val();
        var novoValor = valorAtual.replace(/,/g, '.');
        $(this).val(novoValor);
      });

    $(".button.refresh").click(function() {
        location.reload();
      });

    $('#search input').on('input', function() {
        // Verifica se o input está vazio
        if ($(this).val() === '') {
          $('#search button.i_close').hide();
        } else {
          $('#search button.i_close').show();
        }
      });

      $('#search button.i_close').on('click', function() {
        $('#search input').val('').focus();
        $(this).hide();
        $('.item').show();
      });

      $('.popup.share .foot button').on('click', function() {
        fecharPopup();
      });

    function capitalize(str) {
        return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function fecharPopup() {
        var $popup = $(".popup:visible");
        var popupHeight = $popup.outerHeight();
    
        $popup.animate({
            top: -popupHeight
        }, 300, function () {
            $popup.hide();
        });
    
        $("#blur").fadeOut();
        window.history.back();
    }
    
    $("#blur, .popup .head button").on("click", fecharPopup);
    
    function abrirPopup(selector, inputSelector) {
        var $popup = $(selector);
        var popupHeight = $popup.outerHeight();
    
        $popup.css({
            top: -popupHeight,
            display: 'block' // Garante que o popup está visível antes da animação
        }).animate({
            top: 0
        }, 300);
    
        if (inputSelector) {
            $(inputSelector).focus();
        }
    
        $("#blur").fadeIn();
    }
    
    $("header .add").on("click", function () {
        abrirPopup(".popup.add", '.popup.add input#discr');
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
            var inputValue1 = $item.find('.quant input').val().replace('.', ',');
    
            if (inputValue1.trim() !== "") {
                var discr = $item.find('.discr').text();
                var value1type = $item.find('.quant input').attr('placeholder');
                var inputValue2 = $item.find('.punit input').val().replace('.', ',');
                var valor = $item.find('.valor').text().replace('.', ',');
    
                var newRow = $('<tr></tr>');
    
                newRow.append('<td class="left">' + inputValue1 + " " + value1type + '</td>');
                newRow.append('<td class="left">' + discr + '</td>');
                
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


    $(".sharePic").click(function() {
        var nome = $(".popup.concluir input").val();
        var nomeCliente = capitalize(nome);
            if ($("button.concluir").hasClass('off')) {
                exibirAviso('Nenhum item selecionado');
            } else {
                if (nomeCliente.trim() === "") {
                    $('.popup.share .hidden').fadeIn();
                    $('.popup.share .block, .none').hide();
                    $('.popup.share input').focus();
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














// GERAR PIX
var payload = "";
// Função principal para gerar o QR Code
function generateQRCode() {
    var rawPixValue = $('.total').text();
    var pixValue = parseFloat(rawPixValue.replace('R$', '').trim().replace(',', '.')) || 0;

    var pixKey = '+5583982145645'; // Altere para qualquer chave PIX: Celular, CPF, CNPJ ou chave aleatória.
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

$(".copyCode").click(function() {
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
        
    $('.popup.share .none').click(function() {
        var linkWhatsApp = 'https://api.whatsapp.com/send/?text=' + encodeURIComponent(payload);
        window.open(linkWhatsApp, '_blank');
    });

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
    } catch (e) {
        exibirAviso('Erro:' + e);
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


function fecharPopupUrl() {
    var $popup = $(".popup:visible");
    var popupHeight = $popup.outerHeight();
    $popup.animate({
        top: -popupHeight
    }, 300, function () {
        $popup.hide();
    });
    $("#blur").fadeOut();
}
window.onhashchange = function (e) {
    var oldURL = e.oldURL.split('#')[1];
    if (oldURL == 'popup') {
        $("#blur").hide();
        fecharPopupUrl();
        e.preventDefault();
    }
};

function href(web) {
    window.location.href = web;
}

