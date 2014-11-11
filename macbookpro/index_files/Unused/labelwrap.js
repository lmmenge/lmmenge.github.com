var labelwrap = Class.create({

    initialize: function (form) {
		if (!this.placeholderSupport()) {
        	this.form = $(form);
			this.formElements = this.form.select('input[placeholder], textarea[placeholder]');
		
			this.formElements.each(function(element){
				element.addClassName('placeholder').value = element.readAttribute('placeholder');
				element.observe('focus', this.focus.bind(this));
				element.observe('blur', this.blur.bind(this));		
			}.bind(this));
		
		 	this.form.observe('submit', this.submit_data.bind(this));
		}
    },
	
	placeholderSupport: function() {
  		var i = document.createElement('input');
  		return 'placeholder' in i;
	},
	
	submit_data: function(event) {
		this.formElements.each(function(element){
		
			if ($F(element) == element.readAttribute('placeholder')) {
				element.clear();
			} 	
	
		}.bind(this));
	
	},
	
    focus: function (event) {
		var element = event.element();
        if (element.hasClassName('placeholder'))
            element.clear().removeClassName('placeholder');
    },
	
    blur: function (event) {
		var element = event.element();
        if (element.value === '') {
            element.addClassName('placeholder').value = element.readAttribute('placeholder');
		}
    }
    
});