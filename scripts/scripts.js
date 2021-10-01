$(document).ready(function(){
    var hour = (new Date()).getHours();
    if (hour >= 3 && hour <= 12){
        $("#log").text('bom dia');
    } else if (hour >= 12 && hour <= 18){
        $("#log").text('boa tarde');
    } else {
         $("#log").text('boa noite');
    }
});
    
$('.label').siblings('input[name="unity_price"]').each(function() {
    var precoBase = Number($(this).val());
    $(this).siblings('.label').children('.price').first().html(parseFloat(precoBase).toFixed(2).replace(".",","));

});


$('.label').siblings('input[name="product_name"]').each(function() {
  var tst = $(this).val();
  $(this).siblings('.label').children('.name').first().text(tst);
});
$('.picture').siblings('input[name="product_id"]').each(function() {
  var tst = $(this).val();
  $(this).siblings('.picture').first().html('<img src="images/products/'+tst+'.jpg">');
});
$(".set-value").append(
    "<input type='button' value='–' class='minus'>"+
    "<input type='number' min='1' value='1' class='number' name='quantity' data-cesta-feira-attribute>"+
    "<input type='button' value='+' class='plus'>");
$("form input[type='submit']").val("ADD Á SACOLA");

$('#search input').keyup(function() {
    $('header .category.todos').addClass('pin');
    $('.category.legumes, .category.hortalicas, .category.frutas, .category.outros').removeClass('pin');
    $('#catalog .product').show();
    var nomeFiltro = $(this).val().toLowerCase();
    console.log(nomeFiltro);
    $('.catalog').find('.product').each(function() {
        var conteudoCelula = $(this).find('.name').text();
        console.log(conteudoCelula);
        var corresponde = conteudoCelula.toLowerCase().indexOf(nomeFiltro) >=0;
        $(this).css('display', corresponde ? '' : 'none');
    });
    if($('.catalog').children(':visible').length == 0) {
        $('.info p').text('Desculpe, nenhum produto foi encontrado.');
    }else {
        $('.info p').text('Escolha a quantidade e adicione os itens que deseja à sua sacola.');
    }
});

$("input[type='submit']").click(function(){
	$('.bag').addClass('added');
	setTimeout(function(){
	$('.bag').removeClass('added');
	}, 400);
    updateCount();
});

$(document).ready(function() {
    $('.minus').click(function () {
        var $input = $(this).parent().find('input.number');
        var count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);
        $input.change();
        return false;
    });
    $('.plus').click(function () {
        var $input = $(this).parent().find('input.number');
        $input.val(parseInt($input.val()) + 1);
        $input.change();
        return false;
    });
});


$('a.bag').click(function() {
    $('iframe').attr( 'src', function ( i, val ) { return val; });
    $('.iframe').addClass('open');
    $('.fade').show();
});

var fixIt = $('header').offset().top;
$(window).scroll(function() {
    var currentScroll = $(window).scrollTop();
    if (currentScroll >= fixIt) {
        $('header').addClass('fix');
    } else {
        $('header').removeClass('fix');
    }
});

$('.product').sort(function(a, b) {
    if (a.textContent < b.textContent) {
      return -1;
    } else {
      return 1;
    }
  }).appendTo('#catalog');

  $('header .category').click(function() {
    $(this).addClass('pin');
    $("html, body").animate({ scrollTop: 0 }, "slow");
});
$('header .category.todos').click(function() {
    $('.category.legumes, .category.hortalicas, .category.frutas, .category.outros').removeClass('pin');
    $('#catalog .product').fadeIn("slow");
});
$('header .category.legumes').click(function() {
    $('.category.todos, .category.hortalicas, .category.frutas, .category.outros').removeClass('pin');
    $('.product.legume').fadeIn("slow");
    $('.product.hortalica, .product.fruta, .product.outro').hide();
});
$('.categories .area .category.hortalicas').click(function() {
    $('.category.todos, .category.legumes, .category.frutas, .category.outros').removeClass('pin');
    $('.product.hortalica').fadeIn("slow");
    $('.product.legume, .product.fruta, .product.outro').hide();
});
$('.categories .area .category.frutas').click(function() {
    $('.category.todos, .category.hortalicas, .category.legumes, .category.outros').removeClass('pin');
    $('.product.fruta').fadeIn("slow");
    $('.product.legume, .product.hortalica, .product.outro').hide();
});
$('.categories .area .category.outros').click(function() {
    $('.category.todos, .category.hortalicas, .category.frutas, .category.legumes').removeClass('pin');
    $('.product.outro').fadeIn("slow");
    $('.product.legume, .product.hortalica, .product.fruta').hide();
});
