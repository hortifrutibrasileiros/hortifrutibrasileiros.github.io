var payload = "";
// Bloco principal: Gera os dados necessários para o Payload PIX

document.getElementById('copy_payload_button').addEventListener('click', copyPayloadToClipboard);

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
    document.getElementById('copy_payload_button').disabled = false;
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
            $('.pixPay span').html('<button class="icon">q</button>Pague por PIX:');
        } else {
            $('#qr-code-container').empty();
            $('.pixPay span').html('');
        }
}

// Função para copiar o valor do payload para a área de transferência
function copyPayloadToClipboard() {
    var tempInput = document.createElement("input");
    tempInput.value = payload;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    // Exibe mensagem de sucesso
    var copySuccessMessage = document.getElementById('copy_success_message');
    copySuccessMessage.style.display = 'block';

    // Oculta a mensagem após alguns segundos
    setTimeout(function () {
        copySuccessMessage.style.display = 'none';
    }, 2000); // A mensagem será ocultada após 2 segundos (2000 milissegundos)
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
