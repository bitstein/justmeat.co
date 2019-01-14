# frozen_string_literal: true

module Jekyll
  module Tags
    class WikiLink < Liquid::Tag
      include Jekyll::Filters::URLFilters

      class << self
        def tag_name
          name.split("::").last.downcase
        end
      end

      def initialize(tag_name, relative_path, tokens)
        super

        @relative_path = relative_path.strip
        if !@relative_path.end_with? ".md"
          @relative_path = "#{@relative_path}.md"
        end
      end

      def render(context)
        @context = context
        site = context.registers[:site]
        relative_path = Liquid::Template.parse(@relative_path).render(context)

        site.each_site_file do |item|
          if item.relative_path.include? "wiki/pages"
            wiki_path = item.relative_path.sub!("wiki/pages/", "")
            return relative_url(item) if wiki_path == relative_path
          end
        end

        raise ArgumentError, <<~MSG
          Could not find document '#{relative_path}' in tag '#{self.class.tag_name}'.
          Make sure the document exists and the path is correct.
        MSG
      end
    end
  end
end

Liquid::Template.register_tag("wikilink", Jekyll::Tags::WikiLink)
