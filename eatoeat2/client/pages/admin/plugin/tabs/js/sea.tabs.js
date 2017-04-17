
$(function(){
    $('.seaTabs_tab').each(function(item){
        $(this).click(function(){
            $(this).addClass('seaTabs_switch_active').siblings().removeClass('seaTabs_switch_active');
            $($('.seaTabs_item')[item]).addClass('seaTabs_content_active').siblings().removeClass('seaTabs_content_active');
        });
    });
});


$(function(){
    $('.seaTabs_tab2').each(function(item){
        $(this).click(function(){
            $(this).addClass('seaTabs_switch_active2').siblings().removeClass('seaTabs_switch_active2');
            $($('.seaTabs_item2')[item]).addClass('seaTabs_content_active2').siblings().removeClass('seaTabs_content_active2');
        });
    });
});

/*javascript for all categorey button is start from here*/

$(document).ready(function(e) {
    $(".all-cat").hover(function(){
		
		$(".all-cat-mega").toggle();
		
		});
});
