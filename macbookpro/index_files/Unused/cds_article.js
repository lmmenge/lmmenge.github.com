Event.onDOMReady(function() {

	var StepSections = $$('section.steps');				

	StepSections.each(function(el) {
		var images = el.select('p > img');
		images.each(function(node) {
			el.insert(node);
		});
		var empty = el.select('p:empty');
		empty.each(function(node) {
			node.remove();	
		});
		var wrapper = new Element('div');
		el.insert({top: wrapper});
		var textContent = el.select('h2','p');
		textContent.each(function(node) {
			wrapper.insert(node);
		});
	});

var StepWrapSections = $$('section.stepswrap');

        StepWrapSections.each(function(el) {
                var images = el.select('p > img');
                images.each(function(node) {
                        el.insert(node);
                });
                var empty = el.select('p:empty');
                empty.each(function(node) {
                        node.remove();
                });
                var wrapper = new Element('div');
                el.insert({top: wrapper});
                var textContent = el.select('h2','p');
                textContent.each(function(node) {
                        wrapper.insert(node);
                });
        });
	
	// wrap all tables and make them responsive 
	
	var tables = $$('table');
		
	tables.each(function(el) {
		var div = new Element('div', { 'class': 'table-responsive' });
		el.wrap(div);
	});
	
	// attach events to anchors for smooth scrolling 
	
	var anchorLinks = $$('a[href*="#"]');
	
	anchorLinks.each(function(el){
		Element.observe(el,'click', function(event){
			Event.stop(event);
			var elementLink = el.readAttribute('href');
			var scrollHere = elementLink.substr(1, elementLink.length);
			Effect.ScrollTo(scrollHere);
			return false;
		});		
	});

});
