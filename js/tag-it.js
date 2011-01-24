(function($) {

	$.fn.tagit = function (options) {

		var el = this;

		const BACKSPACE		= 8;
		const ENTER			= 13;
		const SPACE			= 32;
		const COMMA			= 44;

		// add the tagit CSS class.
		el.addClass("tagit");

		// create the input field.
		var html_input_field = '<li class="tagit-new"><input class="tagit-input" type="text" /></li>';
		el.html(html_input_field);

		tag_input = el.children(".tagit-new").children(".tagit-input");

		// Add default tags for the input field
		if (options.startingTags != null){
			$.each(options.startingTags, function(key, tag){
				create_choice(tag);
			});
		}

		$(this).click(function(e){
			if (e.target.tagName == 'A') {
				// Removes a tag when the little 'x' is clicked.
				// Event is binded to the UL, otherwise a new tag (LI > A) wouldn't have this event attached to it.
				$(e.target).parent().remove();
			}
			else {
				// Sets the focus() to the input field, if the user clicks anywhere inside the UL.
				// This is needed because the input field needs to be of a small size.
				tag_input.focus();
			}
		});

		tag_input.keypress(function(event){
			if (event.which == BACKSPACE) {
				if (tag_input.val() == "") {
					// When backspace is pressed, the last tag is deleted.
					$(el).children(".tagit-choice:last").remove();
				}
			}
			// Comma/Space/Enter are all valid delimiters for new tags.
			else if (event.which == COMMA || event.which == SPACE || event.which == ENTER) {
				event.preventDefault();
				check_for_tag();
			}
		});

		tag_input.autocomplete({
			source: options.availableTags, 
			select: function (event,ui) {
				if (is_new(ui.item.value)) {
					create_choice (ui.item.value);
				}
				// Cleaning the input.
				tag_input.val("");
				// Preventing the tag input to be update with the chosen value.
				return false;
			}
		});

		// check if there's a tag when the element loses focus
		tag_input.blur(function(){
			check_for_tag();
		});
		
		function check_for_tag () {
			var typed = tag_input.val();
			typed = typed.replace(/,+$/,"");
			typed = typed.trim();

			if (typed != "") {
				if (is_new(typed)) {
					create_choice(typed);
				}
				// Cleaning the input.
				tag_input.val("");
			}
		}

		function is_new (value) {
			var is_new = true;
			this.tag_input.parents("ul").children(".tagit-choice").each(function(i){
				n = $(this).children("input").val();
				if (value == n) {
					is_new = false;
				}
			})
			return is_new;
		}

		function create_choice (value) {
			var el = '';
			el  = '<li class="tagit-choice">';
			el += value;
			el += '<a class="close">x</a>';
			el += '<input type="hidden" style="display:none;" value="'+value+'" name="item[tags][]">';
			el += '</li>';
			var li_search_tags = this.tag_input.parent();
			$(el).insertBefore(li_search_tags);
			this.tag_input.val("");
		}

	};

	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,"");
	};

})(jQuery);
