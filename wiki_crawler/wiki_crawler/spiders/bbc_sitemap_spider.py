import scrapy
from scrapy.spiders import SitemapSpider

class BBCSitemapSpider(SitemapSpider):
    name = 'bbc_sitemap'
    allowed_domains = ['bbc.com']

    sitemap_urls = [
        'https://www.bbc.com/sitemaps/https-sitemap-com-news-1.xml',
        'https://www.bbc.com/sitemaps/https-sitemap-com-news-2.xml',
        'https://www.bbc.com/sitemaps/https-sitemap-com-news-3.xml',
        'https://www.bbc.com/sitemaps/https-sitemap-com-news-4.xml',
    ]

    def parse(self, response):
        title = response.css('h1::text').get()
        paragraphs = response.css('article p::text').getall()
        content = ' '.join(paragraphs).strip()

        if content:
            yield {
                'url': response.url,
                'title': title,
                'content': content
            }
