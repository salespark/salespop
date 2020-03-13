var nspk_url="https://"+Shopify.shop+"/apps/salespop/api";
var nspk_elem = document.createElement('div');
nspk_elem.id = "nspk_list_orders";
document.body.appendChild(nspk_elem);


function func_nspk_notify_redirect(event){
    var data = new FormData();
    var shop=Shopify.shop;
    var variant=event.getAttribute('data-variant');
    var handle=event.getAttribute('data-handle');
    var notify_id=event.getAttribute('data-id');


    data.append("notify_id",notify_id);
    data.append("shop", shop);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", nspk_url+'/notify/add-clicked/');
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var revenue_item_list = [];
            console.log(localStorage.getItem("revenue_item_list"));
            if(!localStorage.getItem("revenue_item_list")||localStorage.getItem("revenue_item_list")==""){
                revenue_item_list[0]=notify_id;
            }else{
                revenue_item_list=JSON.parse(localStorage.getItem("revenue_item_list"));
                revenue_item_list.push(notify_id);
            }
            localStorage.setItem("revenue_item_list",JSON.stringify(revenue_item_list));
             window.location.href = "https://"+shop+"/products/"+handle+"?variant="+variant;
        }
    });
    xhr.send(data);
}

function nspk_timeDifferencedj(current, previous) {
    console.log(current);
    console.log(previous);


    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;
    console.log(elapsed);
    console.log('-----------');
    debugger

    if (elapsed < msPerMinute) {
        return Math.round(elapsed/1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return  Math.round(elapsed/msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return  Math.round(elapsed/msPerMonth) + ' months ago';
    }

    else {
        return  Math.round(elapsed/msPerYear ) + ' years ago';
    }
}

async function nspk_shopifyorderFunction(){

    var request = new XMLHttpRequest()
    var revenue_item_list = JSON.parse(localStorage.getItem("revenue_item_list"));

    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', nspk_url+'/notify/add-revenue/?shop='+Shopify.shop+'&totalprice='+Shopify.checkout.total_price+'&notify_id='+revenue_item_list[0], true);
    revenue_item_list.shift();
    localStorage.setItem("revenue_item_list",JSON.stringify(revenue_item_list));
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

        }
    };
    request.send();
}

if(typeof(Shopify.Checkout)!="undefined") {
    if(typeof(Shopify.Checkout.page)!="undefined") {
        if (Shopify.Checkout.page == "thank_you") {
            if (localStorage.getItem("revenue_item_list") && localStorage.getItem("revenue_item_list") != "" && localStorage.getItem("revenue_item_list")!="[]") {
                nspk_shopifyorderFunction();
            }
        }
    }
}




function createCookie(name, value, minutes) {
    var expires;
    if (minutes) {
        var date = new Date();
        //date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}




async function nspk_shopifyyourFunction(){
    if(getCookie("spk_reset_order")==""){
        localStorage.removeItem("blackorderlist");
        createCookie("spk_reset_order", "1", 60);
    }
    var request = new XMLHttpRequest()
    var blackorderlist = localStorage.getItem("blackorderlist");
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', nspk_url+'/notify/all-orders/?shop='+Shopify.shop+'&blacklist='+blackorderlist, true);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var nspk_myObj = JSON.parse(this.responseText);
            if(nspk_myObj._metadata.message=="success"){
                var nspk_records=nspk_myObj.records;
                var nspk_status=nspk_records.status;
                var nspk_settings=nspk_records.options.settings;
                var nspk_notify=nspk_records.notify;
                var nspk_design=nspk_records.options.design;
                var nspk_popup_style=nspk_settings.shop_popup_style;
                if(nspk_status==1){
                    if(nspk_settings.shop_position=='bottom left'){var nspk_position_style='left: 15px; bottom: 15px;';}
                    if(nspk_settings.shop_position=='top left'){var nspk_position_style='left: 15px; top: 15px;';}
                    if(nspk_settings.shop_position=='bottom right'){var nspk_position_style='right: 15px; bottom: 15px;';}
                    if(nspk_settings.shop_position=='top right'){var nspk_position_style='right: 15px; top: 15px;';}
                    if(nspk_settings.shop_interval_type_between=='seconds'){
                        var nspk_interval_between=nspk_settings.shop_interval_between*1000;
                        var nspk_second=nspk_settings.shop_interval_between;
                    }else{
                        var nspk_interval_between=(nspk_settings.shop_interval_between*60)*1000;
                        var nspk_second=nspk_settings.shop_interval_between*60;
                    }
                    if(nspk_design==null){
                        nspk_design = {
                            backgroundcolor: "",
                            textcolor: "",
                            topcolor: "",
                            pricecolor: "",
                            titlecolor: "",
                            productcolor: "",
                            datecolor: "",
                        };
                    }

                    /*if(nspk_records.removelist==1){
                        localStorage.removeItem("blackorderlist");
                    }*/
                    var nspk_css ='#snackbar {visibility: hidden;position: fixed;z-index: 1;}'+
                        '#snackbar.show {visibility: visible;-webkit-animation: fadein .5s, fadeout .5s '+nspk_second+'s;'+
                        'animation: fadein .5s, fadeout .5s '+nspk_second+'s;}'+
                        '.otsNotificator {width: 290px;overflow: hidden;padding: 10px;'+nspk_position_style+'}'+
                        '.otsNotificator01 {border-radius: 5px;}'+
                        '.otsNotificator01 .otsalignRight {float: right;max-width: 65px;margin-left: 10px;}'+
                        '.otsNotificator01 .otsalignRight img {max-width: 100%;height: auto;}'+
                        '.otsNotificator01 .otsDescrWrap {overflow: hidden;}'+
                        '.otsNotificator01 .otsTitleHead {display: -webkit-box;display: -ms-flexbox;'+
                        'display: flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;'+
                        'padding: 5px 10px;margin: -10px -10px 10px;}'+
                        '.otsNotificator01 .otsHeading {width: calc(50% - 10px);font-size: 13px;line-height: 1;'+
                        'margin: 0;overflow: hidden;width: 100%;text-transform: capitalize;}'+
                        '.otsNotificator01 .otsTime {font-size: 11px;line-height: 1;width: calc(50% - 10px);'+
                        '.text-align: right;}'+
                        '.otsNotificator01 .otsHeadingTitle {display: block;font-size: 15px;line-height: 1.2;'+
                        'margin-bottom: 9px;}'+
                        '.otsNotificator01 .otsPricing {font-size: 18px;line-height: 1;}'+
                        '.otsNotificator02 {border-radius: 0 0 5px 5px;}'+
                        '.otsNotificator02 .otsDescrWrap {overflow: hidden;}'+
                        '.otsNotificator02 .otsalignLeft {float: left;margin-right: 10px;width: 70px;height: 70px;'+
                        'border-radius: 100%;overflow: hidden;}'+
                        '.otsNotificator02 .otsalignLeft img {max-width: 100%;height: auto;width: 100%;border-radius: inherit;}'+
                        '.otsNotificator02 .otsTitleHead {display: -webkit-box;display: -ms-flexbox;display: flex;'+
                        '-webkit-box-align: center;-ms-flex-align: center;align-items: center;margin-bottom: 10px;}'+
                        '.otsNotificator02 .otsHeading {font-size: 16px;line-height: 1.3;margin: 0;width: calc(50% - 10px);'+
                        'text-transform: uppercase;}'+
                        '.otsNotificator02 .otsTime {font-size: 10px;line-height: 1;width: calc(50% - 10px);text-align: right;}'+
                        '.otsNotificator02 .otsHeadingTitle{font-size: 14px;line-height: 1.3;display: block;margin-bottom: 10px;}'+
                        '.otsNotificator02 .otsPricing {font-size: 18px;line-height: 1;}'+
                        '.otsNotificator03 {text-align: center;}'+
                        '.otsNotificator03 .otsTitleHead {display: -webkit-box;display: -ms-flexbox;display: flex;'+
                        '-webkit-box-align: center;-ms-flex-align: center;align-items: center;margin: -10px -10px 5px;padding: 10px;'+
                        'text-align: left;}'+
                        '.otsNotificator03 .otsImgHolder {-ms-flex-negative: 0;flex-shrink: 0;margin-right: 10px;'+
                        'width: 50px;height: 50px;overflow: hidden;border-radius: 100%;flex-shrink: 0;}'+
                        '.otsNotificator03 .otsImgHolder img {max-width: 100%;height: auto;width: 100%;border-radius: 100%;}'+
                        '.otsNotificator03 .otsExtraWrap {display: -webkit-box;display: -ms-flexbox;display: flex;'+
                        '-webkit-box-align: center;-ms-flex-align: center;align-items: center;-webkit-box-flex: 1;'+
                        '-ms-flex-positive: 1;flex-grow: 1;}'+
                        '.otsNotificator03 .otsHeading {margin: 0;font-size: 17px;line-height: 1.2;width: calc(50% - 10px);}'+
                        '.otsNotificator03 .otsHeadingTitle {display: block;font-size:16px;line-height:1.3;margin-bottom: 10px;}'+
                        '.otsNotificator03 .otsPricing {font-size: 18px;}'+
                        '.otsNotificator03 .otsTime {font-size: 10px;text-align: right;width: calc(50% - 10px);}.dlink_shopify{cursor:pointer;}'+
                        '@-webkit-keyframes fadein {'+
                        '	from {'+
                        '		bottom: 0;'+
                        '		opacity: 0;'+
                        '	}'+
                        '	to {'+
                        '		bottom: 30px;'+
                        '		opacity: 1;'+
                        '	}'+
                        '}'+
                        '@keyframes fadein {'+
                        '	from {'+
                        '		bottom: 0;'+
                        '		opacity: 0;'+
                        '	}'+
                        '	to {'+
                        '		bottom: 30px;'+
                        '		opacity: 1;'+
                        '	}'+
                        '}'+
                        '@-webkit-keyframes fadeout {'+
                        '	from {'+
                        '		bottom: 30px;'+
                        '		opacity: 1;'+
                        '	}'+
                        '	to {'+
                        '		bottom: 0;'+
                        '		opacity: 0;'+
                        '	}'+
                        '}'+
                        '@keyframes fadeout {'+
                        '	from {'+
                        '		bottom: 30px;'+
                        '		opacity: 1;'+
                        '	}'+
                        '	to {'+
                        '		bottom: 0;'+
                        '		opacity: 0;'+
                        '	}'+
                        '}';
                    var nspk_head = document.head || document.getElementsByTagName('head')[0],
                        nspk_style = document.createElement('style');
                    nspk_head.appendChild(nspk_style);
                    nspk_style.type = 'text/css';
                    if (nspk_style.styleSheet){
                        // This is required for IE8 and below.
                        nspk_style.styleSheet.cssText = nspk_css;
                    } else {
                        nspk_style.appendChild(document.createTextNode(nspk_css));
                    }
                    for (var i = 0; i <=nspk_notify.length; i++) {
                        (function(i,nspk_notify){
                            window.setTimeout(function(){
                                if(i == nspk_notify.length){
                                    document.getElementById('nspk_list_orders').innerHTML ='';
                                    nspk_shopifyyourFunction();
                                }else{
                                    var orderlist = [];
                                    var nspk_blackorderlist = localStorage.getItem("blackorderlist");
                                   // console.log(blackorderlist);
                                    if(nspk_blackorderlist== null ){
                                        var nspk_orderlist = [];
                                        nspk_orderlist[0]=nspk_notify[i].id;
                                    }else{
                                        var nspk_orderlist = JSON.parse(localStorage.getItem("blackorderlist"));
                                        nspk_orderlist.push(nspk_notify[i].id);
                                    }
                                    localStorage.setItem("blackorderlist", JSON.stringify(nspk_orderlist));

                                    var today = new Date();
                                    var nspk_date=nspk_timeDifferencedj(today,new Date(nspk_notify[i].order_date));
                                    var nspk_item_data=JSON.parse(nspk_notify[i].item_data);
                                    var nspk_name=nspk_item_data.name;
                                    var nspk_image=nspk_item_data.image;
                                    var nspk_detail=nspk_item_data.customer.first_name+' '+nspk_item_data.customer.last_name+' in '+nspk_item_data.customer.billing_country+' '+nspk_item_data.customer.billing_city+' purchase by';

                                    if(nspk_popup_style==3){
                                        html  ='<div class="otsNotificator otsNotificator03 show " id="snackbar" style="';
                                                if(nspk_design.backgroundcolor!=""){
                                                    html +='background-color:'+nspk_design.backgroundcolor+';';
                                                }else{
                                                    html +='background-color:#f1f1f1;';
                                                }
                                                html +='box-shadow: 0 0 3px rgba(0, 0, 0, .7);';

                                        html +='"><a href="javascript:void(0);" id="notify-'+nspk_notify[i].id+'" class="dlink_shopify" data-variant="'+nspk_item_data.variant_id+'" data-handle="'+nspk_item_data.handle+'" data-id="'+nspk_notify[i].id+'" onclick="func_nspk_notify_redirect(this)">';
                                        html +='<div class="otsTitleHead" style="';
                                            if(nspk_design.topcolor!=""){
                                                html +='background-color:'+nspk_design.topcolor+';';
                                            }else{
                                                html +='background-color: #625f5f;';
                                            }
                                            if(nspk_design.textcolor!=""){
                                                html +='color:'+nspk_design.textcolor+';';
                                            }else{
                                                html +='color: #666666;';
                                            }
                                        html +='">';

                                        html +='<div class="otsImgHolder">'+
                                            '<img src="'+nspk_image+'" >'+
                                            '</div>'+
                                            '<div class="otsExtraWrap">'+
                                            '<h2 class="otsHeading" style="';
                                                    if(nspk_design.productcolor!=""){
                                                        html +='color:'+nspk_design.productcolor+';';
                                                    }
                                        html +='">';
                                        html +=nspk_name+'</h2>'+
                                            '<time class="otsTime" datetime="2011-01-12" style="';
                                                if(nspk_design.datecolor!=""){
                                                    html +='color:'+nspk_design.datecolor+';';
                                                }
                                        html +='">'+nspk_date+'</time>'+
                                            '</div>'+
                                            '</div>'+
                                            '<div class="otsDescrWrap">'+
                                            '<span class="otsHeadingTitle" style="';
                                                if(nspk_design.titlecolor!=""){
                                                    html +='color:'+nspk_design.titlecolor+';';
                                                }
                                        html +='">'+nspk_detail+'</span>'+
                                            '<span class="otsPricing" style="';
                                                if(nspk_design.pricecolor!=""){
                                                    html +='color:'+nspk_design.pricecolor+';';
                                                }
                                        html +='">'+nspk_item_data.price+Shopify.currency.active+'</span>'+
                                            '</div>'+
                                            '</a></div>';
                                    }
                                    if(nspk_popup_style==2){
                                        html  ='<div class="otsNotificator otsNotificator02 show" id="snackbar" style="';
                                            if(nspk_design.backgroundcolor!=""){
                                                html +='background-color:'+nspk_design.backgroundcolor+';';
                                            }else{
                                                html +='background-color: #f1f1f1;';
                                            }
                                            if(nspk_design.textcolor!=""){
                                                html +='color:'+nspk_design.textcolor+';';
                                            }else{
                                                html +='color: #666666;';
                                            }
                                            if(nspk_design.topcolor!=""){
                                                html +='border-top: 4px solid '+nspk_design.topcolor+';';
                                            }else{
                                                html +='border-top: 4px solid #332c2c;';
                                            }
                                        html +='"><a href="javascript:void(0);" id="notify-'+nspk_notify[i].id+'" class="dlink_shopify" data-variant="'+nspk_item_data.variant_id+'" data-handle="'+nspk_item_data.handle+'" data-id="'+nspk_notify[i].id+'" onclick="func_nspk_notify_redirect(event)">';
                                        html +='<div class="otsImgHolder otsalignLeft">'+
                                            '<img src="'+nspk_image+'" >'+
                                            '</div>'+
                                            '<div class="otsDescrWrap">'+
                                            '<div class="otsTitleHead">'+
                                            '<h2 class="otsHeading" style="';
                                                if(nspk_design.productcolor!=""){
                                                    html +='color:'+nspk_design.productcolor+';';
                                                }
                                        html +='">';
                                        html +=nspk_name+'</h2>'+
                                            '<time class="otsTime" datetime="2011-01-12" style="';
                                                if(nspk_design.datecolor!=""){
                                                    html +='color:'+nspk_design.datecolor+';';
                                                }
                                            html +='">'+nspk_date+'</time>'+
                                            '</div>'+
                                            '<span class="otsHeadingTitle" style="';
                                                if(nspk_design.titlecolor!=""){
                                                    html +='color:'+nspk_design.titlecolor+';';
                                                }
                                            html +='">'+nspk_detail+'</span>'+
                                            '<span class="otsPricing" style="';
                                                if(nspk_design.pricecolor!=""){
                                                    html +='color:'+nspk_design.pricecolor+';';
                                                }
                                            html +='">'+nspk_item_data.price+Shopify.currency.active+'</span>'+
                                            '</div>'+
                                            '</a></div>';
                                    }
                                    if(nspk_popup_style==1){
                                        html  ='<div class="otsNotificator otsNotificator01 show" id="snackbar" style="';
                                            if(nspk_design.backgroundcolor!=""){
                                                html +='background-color:'+nspk_design.backgroundcolor+';';
                                            }else{
                                                html +='background-color:#f1f1f1;';
                                            }
                                            if(nspk_design.backgroundcolor!=""){
                                                html +='color:'+nspk_design.textcolor+';';
                                            }else{
                                                html +='color:#666666;';
                                            }
                                            html +='box-shadow: 0 0 3px rgba(0, 0, 0, .7);';

                                        html +='"><a href="javascript:void(0);" id="notify-'+nspk_notify[i].id+'" class="dlink_shopify" data-variant="'+nspk_item_data.variant_id+'" data-handle="'+nspk_item_data.handle+'" data-id="'+nspk_notify[i].id+'" onclick="func_nspk_notify_redirect(this)">';
                                        html +='<div class="otsTitleHead" style="';
                                                if(nspk_design.topcolor!=""){
                                                    html +='background-color: '+nspk_design.topcolor+';';
                                                }else{
                                                    html +='background-color:rgb(225, 225, 225);';
                                                }
                                        html +='">';
                                        html +='<h2 class="otsHeading" style="';
                                                if(nspk_design.productcolor!=""){
                                                    html +='color:'+nspk_design.productcolor+';';
                                                }
                                            html +='">';
                                            html +=nspk_name+'</h2>'+
                                            '<time class="otsTime" datetime="2011-01-12" style="';
                                                if(nspk_design.datecolor!=""){
                                                    html +='color:'+nspk_design.datecolor+';';
                                                }
                                            html +='">'+nspk_date+'</time>'+
                                            '</div>'+
                                            '<div class="otsImgHolder otsalignRight"> '+
                                                '<img src="'+nspk_image+'" >'+
                                            '</div>'+
                                            '<div class="otsDescrWrap">'+
                                            '<span class="otsHeadingTitle" style="';
                                                if(nspk_design.titlecolor!=""){
                                                    html +='color:'+nspk_design.titlecolor+';';
                                                }
                                            html +='">'+nspk_detail+'</span>'+
                                            '<span class="otsPricing" style="';
                                                if(nspk_design.pricecolor!=""){
                                                    html +='color:'+nspk_design.pricecolor+';';
                                                }
                                             html +='">'+nspk_item_data.price+Shopify.currency.active+'</span>'+
                                            '</div>'+
                                            '</a></div>';
                                    }
                                    document.getElementById('nspk_list_orders').innerHTML =html;
                                }
                            }, i * nspk_interval_between);

                        }(i,nspk_notify));

                    }
                    document.getElementById('nspk_list_orders').innerHTML ='';
                }

            }
        }
    };
    request.send();
}
if(typeof(Shopify.Checkout)=="undefined") {
   nspk_shopifyyourFunction();
}



