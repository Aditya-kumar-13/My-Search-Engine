import scrapy
import random

class WikipediaSpider(scrapy.Spider):
    name = "wikipedia"
    
    start_urls = [
        "https://en.wikipedia.org/wiki/Science",
        "https://en.wikipedia.org/wiki/History",
        "https://en.wikipedia.org/wiki/Art",
        "https://en.wikipedia.org/wiki/Technology",
        "https://en.wikipedia.org/wiki/Sports",
        "https://en.wikipedia.org/wiki/Music",
        "https://en.wikipedia.org/wiki/Philosophy",
    ]

    custom_settings = {
        'DEPTH_LIMIT': 3,
        'FEED_EXPORT_ENCODING': 'utf-8',
    }

    def parse(self, response):
        title = response.css('h1#firstHeading span.mw-page-title-main::text').get()

        paragraphs = response.xpath('//div[@id="mw-content-text"]//p[not(@class)]//text()').getall()
        first_paragraph = ' '.join([p.strip() for p in paragraphs if p.strip()])[:1000]

        links = response.xpath(
            '//div[@id="mw-content-text"]//a[starts-with(@href, "/wiki/") and not(contains(@href, ":"))]/@href'
        ).getall()

        links = list(set(response.urljoin(link) for link in links))

        yield {
            'title': title,
            'first_paragraph': first_paragraph,
            'url': response.url,
            'links_count': len(links),
        }

        if links:
            sample_links = random.sample(links, min(10, len(links)))
            for link in sample_links:
                yield scrapy.Request(link, callback=self.parse)
