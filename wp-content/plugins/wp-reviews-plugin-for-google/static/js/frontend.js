jQuery(document).ready(function(a){let widget=a(WidgetCssgoogle.selector);if(widget.length){if(!a(WidgetCssgoogle.link_selector).length){a.post(WidgetCssgoogle.ajaxurl,{action:WidgetCssgoogle.action,security:WidgetCssgoogle.security},function(b){a("head").append('<style type="text/css">'+b+"</style>");widget.show();if(typeof Trustindex!="undefined"){Trustindex.resize_widgets()}})}else{widget.show()}}});